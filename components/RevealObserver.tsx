"use client";

import { useEffect } from "react";

/**
 * Wires up scroll-reveal for every element with the `.reveal` class.
 *
 * Two layers of robustness:
 *
 * 1. MutationObserver — watches for elements added after initial mount.
 *    Required for Next.js App Router pages that use `force-dynamic` /
 *    streaming, where page content arrives in the DOM *after* the layout
 *    client component has already hydrated and run its first useEffect.
 *
 * 2. Safety-net setTimeout — after 600 ms, anything still hidden gets
 *    `.revealed` unconditionally. Guarantees no content is ever stuck
 *    invisible if an IntersectionObserver callback is delayed or missed.
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );

    function observeAll() {
      document
        .querySelectorAll<Element>(".reveal:not(.revealed)")
        .forEach((el) => io.observe(el));
    }

    // Observe whatever is already in the DOM
    observeAll();

    // Re-query every time new nodes land (streaming / Suspense boundaries)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    // Hard fallback: reveal anything still hidden after 600 ms
    const timer = setTimeout(() => {
      document
        .querySelectorAll<Element>(".reveal:not(.revealed)")
        .forEach((el) => el.classList.add("revealed"));
    }, 600);

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return null;
}
