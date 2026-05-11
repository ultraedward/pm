// SilverPriceChart is now a thin wrapper around the generic MetalPriceChart.
// Existing usage <SilverPriceChart /> (no props) continues to work unchanged.
"use client";
import { MetalPriceChart } from "./MetalPriceChart";

export function SilverPriceChart() {
  return <MetalPriceChart metal="silver" />;
}
