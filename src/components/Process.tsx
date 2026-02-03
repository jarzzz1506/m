const steps = [
  {
    step: "01",
    title: "Free Survey",
    description:
      "We visit your property to inspect the infestation, identify the moth species, and assess the extent of damage. No charge, no obligation.",
  },
  {
    step: "02",
    title: "Custom Treatment Plan",
    description:
      "Based on our findings, we recommend a tailored treatment plan with transparent pricing. We explain every step so you know exactly what to expect.",
  },
  {
    step: "03",
    title: "Professional Treatment",
    description:
      "Our BPCA-certified technicians carry out the treatment using industry-leading products and techniques. Most treatments are completed in a single visit.",
  },
  {
    step: "04",
    title: "Follow-Up & Prevention",
    description:
      "We return to verify the treatment's success, install monitoring traps, and provide bespoke prevention advice to keep your home moth-free.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            How It Works
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
            Our Simple 4-Step Process
          </h2>
          <p className="mt-4 text-lg text-muted">
            From initial contact to a moth-free home, we make the process
            straightforward and stress-free.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary/20 -translate-x-4" />
              )}
              <div className="text-4xl font-bold text-primary/15 mb-3">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
