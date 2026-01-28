declare module "react-chartjs-2" {
  import * as React from "react";
  import { ChartData, ChartOptions } from "chart.js";

  export interface ChartProps {
    data: ChartData<any>;
    options?: ChartOptions<any>;
  }

  export const Line: React.ComponentType<ChartProps>;
  export const Bar: React.ComponentType<ChartProps>;
  export const Pie: React.ComponentType<ChartProps>;
}