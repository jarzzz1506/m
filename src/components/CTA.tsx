export default function CTA() {
  return (
    <section
      id="contact"
      className="py-20 sm:py-28 bg-gradient-to-br from-primary-dark via-primary to-primary-light"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Copy */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Get Your Free Moth Survey Today
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-lg">
              Don&apos;t let moths cause further damage. Contact us now for a free,
              no-obligation property survey and transparent quote.
            </p>

            {/* Contact Methods */}
            <div className="mt-8 space-y-4">
              <a
                href="tel:02071234567"
                className="flex items-center gap-3 text-white hover:text-accent transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <svg
                    className="h-5 w-5"
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
                </div>
                <div>
                  <div className="text-sm text-white/60">Call us</div>
                  <div className="font-semibold">020 7123 4567</div>
                </div>
              </a>
              <a
                href="mailto:info@mothguard.london"
                className="flex items-center gap-3 text-white hover:text-accent transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-white/60">Email us</div>
                  <div className="font-semibold">info@mothguard.london</div>
                </div>
              </a>
              <div className="flex items-center gap-3 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-white/60">Working hours</div>
                  <div className="font-semibold">
                    Mon-Sat: 8am-8pm | Sun: 10am-6pm
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="rounded-xl bg-white p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-foreground mb-1">
              Request a Free Quote
            </h3>
            <p className="text-sm text-muted mb-6">
              Fill in the form below and we&apos;ll get back to you within 2 hours.
            </p>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="07xxx xxx xxx"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Postcode *
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="e.g. SW1A 1AA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Type of Problem
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-muted">
                  <option value="">Select...</option>
                  <option value="carpet">Carpet Moths</option>
                  <option value="clothes">Clothes Moths</option>
                  <option value="pantry">Pantry Moths</option>
                  <option value="unsure">Not Sure</option>
                  <option value="commercial">Commercial Enquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tell Us More
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                  placeholder="Describe the problem or any details that might help..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-6 py-3 text-base font-bold text-white hover:bg-primary-dark transition-colors"
              >
                Get My Free Quote
              </button>
              <p className="text-xs text-center text-muted">
                No spam. Your details are safe with us.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
