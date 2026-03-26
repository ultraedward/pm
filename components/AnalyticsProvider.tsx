"use client";

import { Analytics } from "@vercel/analytics/next";

export default function AnalyticsProvider() {
  return (
    <Analytics
      beforeSend={(event) => {
        if (
          typeof window !== "undefined" &&
          window.localStorage.getItem("lode_owner") === "true"
        ) {
          return null;
        }
        return event;
      }}
    />
  );
}
