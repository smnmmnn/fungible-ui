export type TimePeriod = "7" | "30" | "90" | "365";

export const timePeriodLabels: Record<TimePeriod, string> = {
  "7": "Last 7 days",
  "30": "Last 30 days",
  "90": "Last 90 days",
  "365": "Last year",
};

