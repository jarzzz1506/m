"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How do I know if I have a moth infestation?",
    answer:
      "Common signs include small holes in clothing or fabrics, bare patches on carpets (especially under furniture), tiny caterpillar-like larvae, silky webbing or cocoon casings, and adult moths flying around your home. If you spot any of these, contact us for a free survey.",
  },
  {
    question: "How much does moth treatment cost in London?",
    answer:
      "Treatment costs depend on the severity of the infestation, property size, and treatment method required. A standard residential treatment typically starts from around £150-£300. We always provide a free survey and transparent quote before any work begins - no hidden costs.",
  },
  {
    question: "Is the treatment safe for children and pets?",
    answer:
      "Yes. We use products that are approved for domestic use and follow strict safety protocols. For families with young children or pets, we also offer a completely chemical-free heat treatment option. Our technicians will advise on any precautions needed.",
  },
  {
    question: "How long does moth treatment take?",
    answer:
      "Most residential treatments are completed in 2-4 hours depending on property size. Heat treatments may take 6-8 hours. You can typically return to normal use of your home the same day, though we'll advise on any specific waiting periods.",
  },
  {
    question: "Do you offer a guarantee on your treatments?",
    answer:
      "Yes, all our moth treatments come with a 12-month guarantee. If moths return within the guarantee period, we'll re-treat your property at no extra cost. This gives you complete peace of mind that the problem is truly resolved.",
  },
  {
    question: "What moth species are common in London?",
    answer:
      "The most common species we treat in London are the Common Clothes Moth (Tineola bisselliella), Case-bearing Clothes Moth (Tinea pellionella), and the Brown House Moth (Hofmannophila pseudospretella). We also deal with Indian Meal Moths in kitchens and pantries.",
  },
  {
    question: "Can I treat moths myself with shop-bought products?",
    answer:
      "While shop-bought sprays and traps can help with very minor issues, they rarely resolve an established infestation. Professional treatment targets all life stages (eggs, larvae, pupae, and adults) and reaches hidden areas that DIY products cannot. We strongly recommend professional treatment for any persistent moth problem.",
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-base font-semibold text-foreground pr-4">
          {question}
        </span>
        <svg
          className={`h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-sm text-muted leading-relaxed">{answer}</div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28 bg-section-alt">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="rounded-xl bg-white border border-gray-200 px-6 sm:px-8">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
