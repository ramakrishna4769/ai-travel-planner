export default function CTAFooter() {
  return (
    <>
      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-24">

        <div
          className="
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          rounded-3xl
          p-12
          text-center
          "
        >

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready To Plan Your Next Adventure?
          </h2>

          <p className="text-lg text-slate-100 mb-8 max-w-2xl mx-auto">
            Create personalized itineraries, discover hotels,
            estimate budgets, and travel smarter with AI.
          </p>

          <button
            className="
            bg-white
            text-slate-900
            px-8
            py-4
            rounded-2xl
            font-bold
            hover:scale-105
            transition
            "
          >
            Create Free Trip
          </button>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <div>

              <h3 className="text-2xl font-bold">
                ✈ AI Travel Planner
              </h3>

              <p className="text-slate-400 mt-2">
                Travel planning powered by AI.
              </p>

            </div>

            <div className="flex gap-6 text-slate-400">

              <a href="#" className="hover:text-white">
                Home
              </a>

              <a href="#" className="hover:text-white">
                Features
              </a>

              <a href="#" className="hover:text-white">
                Login
              </a>

              <a href="#" className="hover:text-white">
                Register
              </a>

            </div>

          </div>

          <hr className="border-slate-800 my-6" />

          <p className="text-center text-slate-500">
            © 2026 AI Travel Planner. All rights reserved.
          </p>

        </div>

      </footer>
    </>
  );
}