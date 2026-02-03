const areas = [
  {
    region: "Central London",
    boroughs: [
      "Westminster",
      "City of London",
      "Camden",
      "Islington",
      "Southwark",
      "Lambeth",
    ],
  },
  {
    region: "West London",
    boroughs: [
      "Kensington & Chelsea",
      "Hammersmith & Fulham",
      "Ealing",
      "Hounslow",
      "Richmond",
      "Hillingdon",
    ],
  },
  {
    region: "North London",
    boroughs: [
      "Barnet",
      "Haringey",
      "Enfield",
      "Waltham Forest",
      "Hackney",
      "Hampstead",
    ],
  },
  {
    region: "South London",
    boroughs: [
      "Wandsworth",
      "Merton",
      "Croydon",
      "Bromley",
      "Greenwich",
      "Lewisham",
    ],
  },
  {
    region: "East London",
    boroughs: [
      "Tower Hamlets",
      "Newham",
      "Barking",
      "Redbridge",
      "Havering",
      "Bexley",
    ],
  },
];

export default function Coverage() {
  return (
    <section id="coverage" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Service Areas
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
            Covering All London Boroughs
          </h2>
          <p className="mt-4 text-lg text-muted">
            Our fleet of fully-equipped vans covers every corner of Greater
            London. No call-out charges, no travel fees.
          </p>
        </div>

        {/* Areas Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {areas.map((area) => (
            <div
              key={area.region}
              className="rounded-xl border border-gray-200 p-5"
            >
              <h3 className="text-sm font-bold text-primary uppercase tracking-wide mb-3">
                {area.region}
              </h3>
              <ul className="space-y-1.5">
                {area.boroughs.map((borough) => (
                  <li key={borough} className="text-sm text-muted">
                    {borough}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t see your area? We likely cover it.{" "}
          <a href="#contact" className="text-primary font-medium underline">
            Get in touch
          </a>{" "}
          to confirm coverage in your postcode.
        </p>
      </div>
    </section>
  );
}
