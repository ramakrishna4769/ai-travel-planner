export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Enter Trip Details",
      description:
        "Choose destination, duration, budget, and interests."
    },
    {
      number: "02",
      title: "AI Generates Plan",
      description:
        "Gemini AI creates a complete itinerary instantly."
    },
    {
      number: "03",
      title: "Customize Trip",
      description:
        "Add, remove, or regenerate activities as needed."
    },
    {
      number: "04",
      title: "Travel Smarter",
      description:
        "Get hotels, budget estimates, and packing suggestions."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="text-center mb-16">

        <h2 className="text-4xl md:text-5xl font-bold">
          How It Works
        </h2>

        <p className="text-slate-400 mt-4">
          Plan your perfect trip in just a few steps.
        </p>

      </div>

      <div className="grid md:grid-cols-4 gap-8">

        {steps.map((step) => (
          <div
            key={step.number}
            className="
              bg-slate-900
              border border-slate-800
              rounded-3xl
              p-8
              text-center
              hover:border-purple-500
              transition
            "
          >

            <div
              className="
                text-4xl
                font-bold
                text-blue-400
                mb-4
              "
            >
              {step.number}
            </div>

            <h3 className="text-xl font-bold mb-3">
              {step.title}
            </h3>

            <p className="text-slate-400">
              {step.description}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}