"use client";

import { useEffect } from "react";

/**
 * Mounts an IntersectionObserver that adds the `.revealed` class to any
 * element with the `.reveal` class as it scrolls into view.
 * Combined with the CSS in globals.css this produces a staggered
 * fade-up entrance effect for below-the-fold sections.
 *
 * Re-queries on every render so dynamically added `.reveal` elements
 * (e.g. after hydration) are picked up too.
 */
export function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" },
    );

    document.querySelectorAll(".reveal:not(.revealed)").forEach((el) =>
      observer.observe(el),
    );

    return () => observer.disconnect();
  }, []);

  return null;
}
