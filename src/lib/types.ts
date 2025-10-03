import type { LucideIcon } from "lucide-react";
export interface SimulationInput {
  campaignName: string;
  budget: number;
  channels: string[];
  promotionType: string;
}
export interface SimulationMetric {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  change?: string;
}
export interface SalesForecastDataPoint {
  name: string;
  sales: number;
}
export interface ChannelPerformanceDataPoint {
  name: string;
  performance: number;
  fill: string;
}
export interface SimulationResult {
  metrics: SimulationMetric[];
  salesForecast: SalesForecastDataPoint[];
  channelPerformance: ChannelPerformanceDataPoint[];
  aiRecommendations: string;
}