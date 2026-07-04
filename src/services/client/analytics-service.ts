import type {
  AnalyticsSummary,
  AnalyticsDataPoint,
  TopPost,
  TrafficSource,
  DeviceStats,
} from "@/types";
import {
  MOCK_ANALYTICS_SUMMARY,
  MOCK_ANALYTICS_DATA,
  MOCK_TOP_POSTS,
  MOCK_TRAFFIC_SOURCES,
  MOCK_DEVICE_STATS,
} from "@/mock/data";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const analyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    await delay();
    return MOCK_ANALYTICS_SUMMARY;
  },

  async getChartData(): Promise<AnalyticsDataPoint[]> {
    await delay(250);
    return MOCK_ANALYTICS_DATA;
  },

  async getTopPosts(): Promise<TopPost[]> {
    await delay(200);
    return MOCK_TOP_POSTS;
  },

  async getTrafficSources(): Promise<TrafficSource[]> {
    await delay(200);
    return MOCK_TRAFFIC_SOURCES;
  },

  async getDeviceStats(): Promise<DeviceStats[]> {
    await delay(200);
    return MOCK_DEVICE_STATS;
  },
};
