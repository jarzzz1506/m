const services = [
  {
    icon: "🏠",
    title: "Carpet Moth Treatment",
    description:
      "Specialist treatment for carpet moths (Tineola bisselliella) that damage wool carpets, rugs, and underlay. We use targeted insecticide sprays and heat treatment.",
    features: [
      "Full carpet inspection",
      "Residual spray treatment",
      "Larvae removal",
      "12-month guarantee",
    ],
  },
  {
    icon: "👔",
    title: "Clothes Moth Removal",
    description:
      "Protect your wardrobe from common clothes moths. Expert treatment for cashmere, silk, wool, and other natural fibre garments.",
    features: [
      "Wardrobe inspection",
      "Pheromone trapping",
      "Fumigation treatment",
      "Prevention advice",
    ],
  },
  {
    icon: "🍞",
    title: "Pantry Moth Control",
    description:
      "Eliminate Indian meal moths and other pantry pests that contaminate stored food products in kitchens and larders.",
    features: [
      "Source identification",
      "Deep clean protocol",
      "Residual treatment",
      "Monitoring traps",
    ],
  },
  {
    icon: "🔥",
    title: "Heat Treatment",
    description:
      "Chemical-free moth elimination using controlled heat. Ideal for sensitive environments, antiques, and properties with children or pets.",
    features: [
      "Chemical-free option",
      "Kills all life stages",
      "Single visit solution",
      "Safe for delicates",
    ],
  },
  {
    icon: "🔍",
    title: "Moth Surveys & Monitoring",
    description:
      "Comprehensive property surveys using pheromone traps to identify moth species, infestation severity, and risk areas.",
    features: [
      "Species identification",
      "Risk assessment report",
      "Trap monitoring",
      "Ongoing reporting",
    ],
  },
  {
    icon: "🏢",
    title: "Commercial Moth Control",
    description:
      "Specialist moth management for museums, galleries, retail stores, hotels, and heritage properties across London.",
    features: [
      "Bespoke contracts",
      "Discreet service",
      "Compliance reports",
      "24/7 emergency response",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Our Services
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
            Comprehensive Moth Treatment Solutions
          </h2>
          <p className="mt-4 text-lg text-muted">
            From residential homes to commercial properties, we offer the full
            range of moth control services tailored to your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-xl border border-gray-200 p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-foreground/80"
                  >
                    <svg
                      className="h-4 w-4 text-primary flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
