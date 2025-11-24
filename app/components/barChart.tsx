"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "./card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Plus } from "lucide-react";
import { TimePeriod } from "./types";

interface ModelCost {
  model: string;
  cost: number;
  percentage: number;
}

type TimePeriodData = {
  "7": ModelCost[];
  "30": ModelCost[];
  "90": ModelCost[];
  "365": ModelCost[];
};

interface BarChartProps {
  data?: TimePeriodData;
}

const defaultData: TimePeriodData = {
  "7": [
    { model: "Claude Sonnet 4.5", cost: 1850.45, percentage: 75 },
    { model: "Claude Sonnet 4.5 Thinking", cost: 4850.22, percentage: 88 },
    { model: "Gemini 3 Pro Preview Low", cost: 2850.67, percentage: 83 },
    { model: "GPT-5 Medium", cost: 1950.33, percentage: 78 },
    { model: "GPT-5 Codex", cost: 844.0, percentage: 67 },
  ],
  "30": [
    { model: "Claude Sonnet 4.5", cost: 12150.45, percentage: 72 },
    { model: "Claude Sonnet 4.5 Thinking", cost: 31850.22, percentage: 86 },
    { model: "Gemini 3 Pro Preview Low", cost: 18750.67, percentage: 80 },
    { model: "GPT-5 Medium", cost: 12850.33, percentage: 77 },
    { model: "GPT-5 Codex", cost: 5636.61, percentage: 67 },
  ],
  "90": [
    { model: "Claude Sonnet 4.5", cost: 22850.45, percentage: 74 },
    { model: "Claude Sonnet 4.5 Thinking", cost: 60150.22, percentage: 89 },
    { model: "Gemini 3 Pro Preview Low", cost: 35450.67, percentage: 84 },
    { model: "GPT-5 Medium", cost: 24350.33, percentage: 81 },
    { model: "GPT-5 Codex", cost: 10408.56, percentage: 70 },
  ],
  "365": [
    { model: "Claude Sonnet 4.5", cost: 88250.45, percentage: 76 },
    { model: "Claude Sonnet 4.5 Thinking", cost: 232150.22, percentage: 91 },
    { model: "Gemini 3 Pro Preview Low", cost: 137050.67, percentage: 85 },
    { model: "GPT-5 Medium", cost: 94050.33, percentage: 83 },
    { model: "GPT-5 Codex", cost: 40618.56, percentage: 71 },
  ],
};

const colors = [
  "var(--data-color-2)",
  "var(--data-color-3)",
  "var(--data-color-4)",
  "var(--data-color-5)",
  "var(--data-color-6)",
  "var(--data-color-10)",
];

export default function BarChart({ data = defaultData }: BarChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("30");
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Format cost as currency
  const formatCost = (cost: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cost);
  };

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setIsLoading(true);
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Memoize color map creation to avoid recalculating on every render
  const modelColorMap = useMemo(() => {
    const allModels = new Set<string>();
    Object.values(data).forEach((periodData) => {
      periodData.forEach((item) => allModels.add(item.model));
    });
    const sortedAllModels = Array.from(allModels).sort();
    return new Map(
      sortedAllModels.map((model, index) => [
        model,
        colors[index % colors.length],
      ])
    );
  }, [data]);

  // Memoize chart data preparation to avoid recalculating on every render
  const chartData = useMemo(() => {
    const currentData = data[selectedPeriod];
    const maxCost = Math.max(...currentData.map((item) => item.cost));

    return currentData
      .map((item) => ({
        name: item.model,
        cost: item.cost,
        percentage:
          maxCost > 0
            ? Math.round((item.cost / maxCost) * 100)
            : item.percentage,
        color: modelColorMap.get(item.model) || colors[0],
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [data, selectedPeriod, modelColorMap]);

  return (
    <Card className="min-w-lg mb-1.5">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <h4>Cost by model</h4>
        </div>
        <div className="flex items-center gap-0.5">
          <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger>
              <button
                className={`font-medium flex items-center whitespace-nowrap gap-1.75 tracking-tight hover:bg-posthog-3000-100 rounded-md p-1.5 px-2.5 pr-2.75 h-8 cursor-pointer ${
                  isFilterOpen ? "bg-posthog-3000-100" : ""
                }`}
              >
                <Plus size={15} strokeWidth={2} />
                Add filter
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsFilterOpen(false)}>
                Filters…
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CardHeader
            title=""
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </div>
      </div>
      <CardContent className="pb-2">
        {isLoading ? (
          <div className="mt-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  {/* Model name skeleton - matches text-sm font-medium height */}
                  <div className="h-5 rounded w-48 skeleton-shimmer" />
                  {/* Cost skeleton - matches text-sm font-medium tabular-nums height */}
                  <div className="h-5 rounded w-20 tabular-nums skeleton-shimmer" />
                </div>
                {/* Bar skeleton - matches 8px height */}
                <div className="w-full h-2 rounded-full skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {chartData.map((item, index) => (
              <div
                key={`${item.name}-${selectedPeriod}`}
                className="space-y-1 animate-fade-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                {/* Labels row */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-posthog-3000-900">
                    {item.name}
                  </span>
                  <span className="text-sm font-medium text-posthog-3000-900 tabular-nums">
                    {formatCost(item.cost)}
                  </span>
                </div>
                {/* Bar row - using recharts */}
                <div
                  className="w-full relative bg-posthog-3000-100 rounded-full overflow-hidden"
                  style={{ height: "8px" }}
                >
                  <ResponsiveContainer width="100%" height={8}>
                    <RechartsBarChart
                      data={[{ name: item.name, percentage: item.percentage }]}
                      layout="vertical"
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    >
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis type="category" dataKey="name" hide width={0} />
                      <Bar
                        dataKey="percentage"
                        radius={[0, 4, 4, 0]}
                        barSize={8}
                        fill={item.color}
                        isAnimationActive={true}
                        animationDuration={600}
                        animationBegin={index * 50}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
