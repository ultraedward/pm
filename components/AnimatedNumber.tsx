"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  decimals?: number;
  className?: string;
};

export default function AnimatedNumber({
  value,
  decimals = 2,
  className = "",
}: Props) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const start = previousValue.current;
    const end = value;

    const duration = 500;
    const startTime = performance.now();

    function animate(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      const current = start + (end - start) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValue.current = end;
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className={className}>
      {displayValue.toFixed(decimals)}
    </span>
  );
}