export default function Footer() {
  return (
    <footer className="bg-foreground text-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white text-lg font-bold">
                M
              </div>
              <span className="text-lg font-bold text-white">
                MothGuard London
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              London&apos;s leading specialist moth treatment company. BPCA
              certified, fully insured, and trusted by thousands of homeowners
              since 2008.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Carpet Moth Treatment
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Clothes Moth Removal
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Pantry Moth Control
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Heat Treatment
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Moth Surveys
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Commercial Services
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors">
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href="#coverage" className="hover:text-white transition-colors">
                  Service Areas
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:02071234567"
                  className="hover:text-white transition-colors"
                >
                  020 7123 4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@mothguard.london"
                  className="hover:text-white transition-colors"
                >
                  info@mothguard.london
                </a>
              </li>
              <li>Mon-Sat: 8am-8pm</li>
              <li>Sun: 10am-6pm</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} MothGuard London. All rights
            reserved. Company No. 07654321.
          </p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
