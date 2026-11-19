"use client";

import { useState } from "react";

export interface AccordionItem {
  question: string;
  answer: string;
}

export function SimpleAccordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-start justify-between gap-4 py-5 text-left group"
            >
              <span
                className="text-sm font-bold transition-colors duration-150"
                style={{ color: isOpen ? "var(--gold)" : "var(--text)" }}
              >
                {item.question}
              </span>
              <span
                className="mt-0.5 flex-shrink-0 text-lg leading-none select-none transition-transform duration-200"
                style={{ color: "var(--text-muted)", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {/* Always render answer in DOM so Google can index it;
                CSS visibility controls the accordion, not conditional render. */}
            <div
              className="pb-5 text-sm text-gray-400 leading-relaxed"
              style={{ display: isOpen ? "block" : "none" }}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
