export default function TripPreview() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="text-center mb-16">

        <h2 className="text-4xl md:text-5xl font-bold">
          AI Generated Trip Preview
        </h2>

        <p className="text-slate-400 mt-4">
          See how AI creates detailed travel plans.
        </p>

      </div>

      <div
        className="
        max-w-4xl
        mx-auto
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        p-8
        shadow-2xl
        "
      >

        <div className="flex justify-between items-center mb-8">

          <div>
            <h3 className="text-3xl font-bold">
              Tokyo, Japan 🇯🇵
            </h3>

            <p className="text-slate-400">
              5 Days • Medium Budget
            </p>
          </div>

          <div
            className="
            bg-gradient-to-r
            from-blue-600
            to-purple-600
            px-4
            py-2
            rounded-xl
            "
          >
            AI Generated
          </div>

        </div>

        {/* Day 1 */}
        <div className="mb-6">

          <h4 className="text-xl font-bold text-blue-400 mb-3">
            Day 1
          </h4>

          <ul className="space-y-2 text-slate-300">
            <li>✅ Visit Sensoji Temple</li>
            <li>✅ Explore Asakusa Street Food</li>
          </ul>

        </div>

        {/* Day 2 */}
        <div className="mb-6">

          <h4 className="text-xl font-bold text-purple-400 mb-3">
            Day 2
          </h4>

          <ul className="space-y-2 text-slate-300">
            <li>✅ Tokyo Skytree</li>
            <li>✅ Akihabara Shopping</li>
          </ul>

        </div>

        {/* Budget */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div
            className="
            bg-slate-950
            border
            border-slate-800
            rounded-2xl
            p-6
            "
          >

            <h4 className="text-xl font-bold mb-4">
              Budget Estimate
            </h4>

            <div className="space-y-2 text-slate-300">

              <p>✈ Flights: $400</p>
              <p>🏨 Hotel: $300</p>
              <p>🍜 Food: $150</p>
              <p>🎟 Activities: $100</p>

              <hr className="border-slate-700 my-3" />

              <p className="font-bold text-green-400">
                Total: $950
              </p>

            </div>

          </div>

          <div
            className="
            bg-slate-950
            border
            border-slate-800
            rounded-2xl
            p-6
            "
          >

            <h4 className="text-xl font-bold mb-4">
              Recommended Hotels
            </h4>

            <div className="space-y-3">

              <p>🏨 Hotel Sakura Tokyo</p>

              <p>🏨 Shinjuku Grand Hotel</p>

              <p>🏨 Tokyo Imperial Palace Hotel</p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}