const testimonials = [
  {
    name: "Sarah Thompson",
    location: "Kensington, W8",
    rating: 5,
    text: "We had a terrible carpet moth infestation that was destroying our Persian rugs. MothGuard came out the same day, were incredibly thorough, and the moths haven't returned in over a year. Worth every penny.",
  },
  {
    name: "James Harrington",
    location: "Islington, N1",
    rating: 5,
    text: "After finding moth damage to several cashmere jumpers, I called MothGuard in a panic. They were calm, professional, and sorted the problem quickly. Their prevention advice has been invaluable.",
  },
  {
    name: "Priya Patel",
    location: "Richmond, TW9",
    rating: 5,
    text: "Used MothGuard for our boutique hotel. They worked discreetly outside of guest hours and set up an ongoing monitoring programme. Absolutely first-class service and communication throughout.",
  },
  {
    name: "David Chen",
    location: "Hampstead, NW3",
    rating: 5,
    text: "The heat treatment option was perfect for us as we have young children. No chemicals, done in one visit, and the moths were completely eradicated. Highly recommend their eco-friendly approach.",
  },
  {
    name: "Emma Fitzgerald",
    location: "Chelsea, SW3",
    rating: 5,
    text: "MothGuard saved my vintage clothing collection. Their technician identified the exact species and explained the treatment process clearly. Three months on and no sign of moths returning.",
  },
  {
    name: "Robert Singh",
    location: "Dulwich, SE21",
    rating: 5,
    text: "Professional from start to finish. The free survey was genuinely useful, no hard sell at all. Fair pricing and the 12-month guarantee gives real peace of mind. Already recommended to neighbours.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 text-accent"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-section-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Customer Reviews
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
            Trusted by Thousands of London Homeowners
          </h2>
          <p className="mt-4 text-lg text-muted">
            Don&apos;t just take our word for it. Here&apos;s what our customers say
            about their experience with MothGuard London.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((review) => (
            <div
              key={review.name}
              className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm"
            >
              <Stars count={review.rating} />
              <p className="mt-4 text-sm text-foreground/80 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm font-semibold text-foreground">
                  {review.name}
                </div>
                <div className="text-xs text-muted">{review.location}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-white border border-gray-200 px-6 py-3 shadow-sm">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="h-5 w-5 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">
              4.9/5 from 800+ Google Reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
