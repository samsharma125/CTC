import Providers from "@/components/Providers";
import "./globals.css";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        
        <Providers>
          {/* MAIN CONTENT */}
          <main className="flex-grow">
            {children}
          </main>

          {/* 🔻 FOOTER (GLOBAL) */}
          <Footer />
        </Providers>

      </body>
    </html>
  );
}