export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-gradient-to-b from-transparent to-white/5 backdrop-blur-xl">
      
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* TOP LINE */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mb-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">

          {/* LEFT */}
          <div className="text-center md:text-left">
            <p className="font-medium text-gray-300">
              © {new Date().getFullYear()} CollegeToCarrier
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Built for smarter learning 🚀
            </p>
          </div>

          {/* CENTER */}
          <div className="flex gap-6 text-xs font-medium">
            <span className="hover:text-white cursor-pointer transition hover:underline underline-offset-4">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer transition hover:underline underline-offset-4">
              Terms
            </span>
            <span className="hover:text-white cursor-pointer transition hover:underline underline-offset-4">
              Support
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex gap-4 text-lg">
            <span className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 cursor-pointer transition shadow-sm">
              🌐
            </span>
            <span className="p-2 rounded-full bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 cursor-pointer transition shadow-sm">
              📘
            </span>
            <span className="p-2 rounded-full bg-white/5 hover:bg-pink-500/20 hover:text-pink-400 cursor-pointer transition shadow-sm">
              📸
            </span>
          </div>

        </div>

        {/* BOTTOM LINE */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Designed with ❤️ for students & teachers
        </div>

      </div>
    </footer>
  );
}