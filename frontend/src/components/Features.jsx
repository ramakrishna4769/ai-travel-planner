const features = [
  {
    icon: "🤖",
    title: "AI Itinerary Generator",
    description:
      "Generate day-by-day travel plans based on destination, budget, and interests.",
  },
  {
    icon: "💰",
    title: "Budget Estimation",
    description:
      "Get realistic cost estimates for flights, hotels, food, and activities.",
  },
  {
    icon: "🏨",
    title: "Hotel Suggestions",
    description:
      "Discover recommended hotels based on your budget and destination.",
  },
  {
    icon: "✏️",
    title: "Editable Itinerary",
    description:
      "Add activities, remove plans, or regenerate specific travel days.",
  },
  {
    icon: "🎒",
    title: "Packing Assistant",
    description:
      "AI-generated packing checklist based on weather and activities.",
  },
  {
    icon: "🔒",
    title: "Secure Accounts",
    description:
      "JWT authentication and user-specific data protection.",
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="text-center mb-16">

        <h2 className="text-4xl md:text-5xl font-bold">
          Everything You Need
        </h2>

        <p className="text-slate-400 mt-4">
          Built for modern travelers using AI.
        </p>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {features.map((feature, index) => (
          <div
            key={index}
            className="
              bg-slate-900
              border border-slate-800
              rounded-3xl
              p-8
              hover:border-blue-500
              hover:-translate-y-2
              transition
              duration-300
            "
          >

            <div className="text-5xl mb-5">
              {feature.icon}
            </div>

            <h3 className="text-xl font-bold mb-3">
              {feature.title}
            </h3>

            <p className="text-slate-400">
              {feature.description}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}