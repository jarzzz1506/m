const credentials = [
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    title: "BPCA Certified",
    description: "Full members of the British Pest Control Association",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
        />
      </svg>
    ),
    title: "RSPH Qualified",
    description: "Royal Society for Public Health Level 2 certified technicians",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17l-5.384 3.18 1.421-5.99L2.26 7.84l6.134-.533L11.42 2l3.026 5.306 6.134.534-4.795 4.519 1.42 5.99-5.383-3.18z"
        />
      </svg>
    ),
    title: "5-Star Rated",
    description: "4.9/5 average across 800+ verified Google reviews",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Same-Day Service",
    description: "Emergency response available 7 days a week across London",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-section-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
              London&apos;s Most Trusted Moth Control Experts
            </h2>
            <p className="mt-6 text-muted leading-relaxed">
              Since 2008, MothGuard London has been protecting homes and
              businesses across the capital from damaging moth infestations. Our
              team of BPCA-certified technicians combines deep entomological
              knowledge with the latest treatment technologies to deliver
              lasting, guaranteed results.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              We understand the distress a moth infestation can cause -
              from ruined heirloom carpets to damaged designer wardrobes. That&apos;s
              why we offer free, no-obligation surveys and transparent pricing
              with no hidden fees.
            </p>

            {/* Insurance Badge */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-lg bg-white border border-gray-200 px-5 py-3">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Fully Insured & Guaranteed
                </div>
                <div className="text-xs text-muted">
                  £5M public liability insurance | All treatments guaranteed
                </div>
              </div>
            </div>
          </div>

          {/* Credentials Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {credentials.map((cred) => (
              <div
                key={cred.title}
                className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  {cred.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {cred.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{cred.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
