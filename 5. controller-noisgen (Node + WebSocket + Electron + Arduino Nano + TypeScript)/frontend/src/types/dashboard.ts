export interface ChartSeries {
  values: number[];
  stroke: string;
  fill: string;
  label: string;
}

export interface ChartTheme {
  background: string;
  grid: string;
  axis: string;
}

export type DashboardView = 'manual' | 'modes' | 'custom';
