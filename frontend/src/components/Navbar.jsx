export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">✈️</span>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Travel Planner
          </h1>
        </div>

        {/* Menu */}
        <div className="hidden md:flex gap-8 text-slate-300">

          <a href="#" className="hover:text-blue-400 transition">
            Home
          </a>

          <a href="#" className="hover:text-blue-400 transition">
            Features
          </a>

          <a href="#" className="hover:text-blue-400 transition">
            How It Works
          </a>

        </div>

        {/* Buttons */}
        <div className="flex gap-3">

          <button
            className="
            px-5 py-2
            rounded-xl
            border border-slate-700
            hover:bg-slate-800
            transition
            "
          >
            Login
          </button>

          <button
            className="
            px-5 py-2
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-purple-600
            hover:scale-105
            transition
            "
          >
            Register
          </button>

        </div>

      </div>

    </nav>
  );
}