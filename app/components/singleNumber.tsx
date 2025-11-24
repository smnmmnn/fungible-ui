"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent } from "./card";
import { TimePeriod } from "./types";
import { RollingDigit } from "../utils/rollingDigit";

function SkeletonLoader() {
  return (
    <div className="text-4xl tabular-nums tracking-tight flex mono-counter mt-2.5 items-center">
      <div
        className="rounded skeleton-shimmer"
        style={{ width: "11ch", height: "2.5rem" }}
      />
    </div>
  );
}

export default function SingleNumber() {
  const values: Record<TimePeriod, number> = {
    "7": 12345.67,
    "30": 81238.28,
    "90": 153210.23,
    "365": 592120.23,
  };

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("30");
  const [isLoading, setIsLoading] = useState(false);

  const formattedNumber = values[selectedPeriod].toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Card className="w-full mb-1.5">
      <CardHeader
        title="Total cost"
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
      />

      <CardContent>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="text-4xl tabular-nums tracking-tight flex mono-counter mt-2.5">
            {Array.from(formattedNumber).map((char, index) =>
              /\d/.test(char) ? (
                <RollingDigit
                  key={`${char}-${index}`}
                  value={char}
                  index={index}
                />
              ) : (
                <span key={`${char}-${index}`} className="inline-block">
                  {char}
                </span>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
