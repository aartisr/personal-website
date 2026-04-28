"use client";

import { useState } from "react";
import "./faq-section.css";

export type FAQ = {
  question: string;
  answer: string;
};

export type FAQSectionProps = {
  heading: string;
  description: string;
  faqs: FAQ[];
};

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`faq-accordion-item${isOpen ? " open" : ""}`}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={onToggle}
        aria-expanded={isOpen ? "true" : "false"}
      >
        <span className="text-base font-semibold leading-snug faq-accordion-question">
          {faq.question}
        </span>
        <span
          className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-transform duration-200 faq-accordion-icon${isOpen ? " open" : " closed"}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-3.5 h-3.5"
          >
            <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z" />
          </svg>
        </span>
      </button>

      {/* Answer panel */}
      <div className={`faq-accordion-panel${isOpen ? " open" : " closed"}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed faq-accordion-answer">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection({ heading, description, faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 faq-section"
    >
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        {(heading || description) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-bold faq-section-heading">
                {heading}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg faq-section-description">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
