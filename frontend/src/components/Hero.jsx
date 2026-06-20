export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">

        <div className="text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 mb-8">

            <span>🤖</span>

            <span className="text-sm text-slate-300">
              Powered by Gemini AI
            </span>

          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">

            Plan Your Dream Trip

            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">

              With AI

            </span>

          </h1>

          {/* Description */}
          <p className="max-w-3xl mx-auto mt-8 text-lg md:text-xl text-slate-400">

            Generate complete travel itineraries,
            realistic budgets, hotel recommendations,
            and smart packing lists in seconds.

          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

            <button
              className="
              px-8 py-4
              rounded-2xl
              font-semibold
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              hover:scale-105
              transition
              "
            >
              Start Planning
            </button>

            <button
              className="
              px-8 py-4
              rounded-2xl
              border border-slate-700
              hover:bg-slate-900
              transition
              "
            >
              Watch Demo
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}