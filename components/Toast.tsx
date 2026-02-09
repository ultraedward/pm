"use client";

import { useEffect } from "react";

export function Toast({ message }: { message: string }) {
  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.getElementById("toast");
      if (el) el.remove();
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      id="toast"
      className="fixed bottom-6 right-6 z-50 rounded bg-black px-4 py-2 text-sm text-white shadow-lg"
    >
      {message}
    </div>
  );
}