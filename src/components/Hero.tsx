export default function Hero() {
  return (
    <section className="relative pt-16 bg-gradient-to-br from-primary-dark via-primary to-primary-light overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm text-white/90 mb-6">
              <svg
                className="h-4 w-4 text-accent"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              BPCA Certified | Trusted Since 2008
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              London&apos;s Expert{" "}
              <span className="text-accent">Moth Treatment</span> Specialists
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-xl leading-relaxed">
              Protect your home, wardrobe, and carpets from destructive moth
              infestations. Fast, discreet, and guaranteed results across all
              London boroughs.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-7 py-3.5 text-base font-bold text-primary-dark hover:bg-accent-dark transition-colors shadow-lg"
              >
                Get a Free Survey
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
              <a
                href="tel:02071234567"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                Call 020 7123 4567
              </a>
            </div>

            {/* Stats */}
            <div className="mt-10 flex gap-8 sm:gap-12">
              {[
                { value: "15K+", label: "Homes Treated" },
                { value: "17", label: "Years Experience" },
                { value: "4.9/5", label: "Google Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-96 h-96 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-7xl mb-4">🛡️</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Same-Day Service
                </h3>
                <p className="text-white/70">
                  Emergency moth treatment available 7 days a week across London
                </p>
                <div className="mt-6 inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 text-accent text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  Technicians available now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path
            d="M0,48 C480,80 960,0 1440,48 L1440,80 L0,80 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
