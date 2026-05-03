import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification"; // ✅ ADD
import jwt from "jsonwebtoken";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }: any) {
      try {
        if (account && user) {
          await connectDB();

          if (!user?.email) return token;

          let dbUser = await User.findOne({ email: user.email });

          let roleFromCookie = "student";
          try {
            const cookieStore = await cookies();
            roleFromCookie =
              cookieStore.get("role")?.value || "student";
          } catch {
            roleFromCookie = "student";
          }

          // ======================
          // ✅ CREATE USER
          // ======================
          if (!dbUser) {
            dbUser = await User.create({
              name: user.name || "User",
              email: user.email,
              role:
                roleFromCookie === "teacher"
                  ? "teacher"
                  : "student",
              isVerified: true,
            });

            // ======================
            // 🔔 NOTIFY TEACHERS (NEW STUDENT)
            // ======================
            if (dbUser.role === "student") {
              const teachers = await User.find({ role: "teacher" });

              if (teachers.length > 0) {
                const notifications = teachers.map((t) => ({
                  userId: t._id.toString(),
                  role: "teacher",
                  type: "student_join",
                  title: "New Student Joined 🎓",
                  message: `${dbUser.name || "A student"} joined the platform`,
                }));

                await Notification.insertMany(notifications);
              }
            }
          }

          // ======================
          // ROLE CHECK
          // ======================
          if (roleFromCookie && dbUser.role !== roleFromCookie) {
            token.error = "ROLE_MISMATCH";
            return token;
          }

          token.role = dbUser.role;
          token.id = dbUser._id.toString();
          token.email = user.email;

          // ======================
          // 🔥 FIX 401 (CUSTOM JWT COOKIE)
          // ======================
          try {
            const customToken = jwt.sign(
              { id: dbUser._id, role: dbUser.role },
              process.env.JWT_SECRET!,
              { expiresIn: "7d" }
            );

            const cookieStore = await cookies();
            cookieStore.set("token", customToken, {
              httpOnly: true,
              path: "/",
              sameSite: "lax",
              secure: false,
            });
          } catch (err) {
            console.log("COOKIE ERROR:", err);
          }
        }

        return token;
      } catch (error) {
        console.log("JWT ERROR:", error);
        return token;
      }
    },

    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.error = token.error;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signup",
  },

  session: {
    strategy: "jwt" as const,
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };