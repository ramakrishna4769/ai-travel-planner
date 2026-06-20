export default function PackingPreview() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="text-center mb-16">

        <h2 className="text-4xl md:text-5xl font-bold">
          Smart Packing Assistant
        </h2>

        <p className="text-slate-400 mt-4">
          AI automatically suggests what to pack based on destination,
          weather, and activities.
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
        "
      >

        <div className="flex justify-between items-center mb-8">

          <div>
            <h3 className="text-2xl font-bold">
              Tokyo Trip Checklist
            </h3>

            <p className="text-slate-400">
              Weather: Rainy • 18°C
            </p>
          </div>

          <div className="bg-green-600 px-4 py-2 rounded-xl">
            AI Generated
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="space-y-4">

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Passport
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Travel Tickets
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Power Bank
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Mobile Charger
            </label>

          </div>

          <div className="space-y-4">

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Umbrella
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Walking Shoes
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Light Jacket
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />
              Water Bottle
            </label>

          </div>

        </div>

      </div>

    </section>
  );
}