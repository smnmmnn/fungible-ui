"use client";

import { ReactNode, useState } from "react";
import { CalendarRange, MoreHorizontal, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown";
import { TimePeriod, timePeriodLabels } from "./types";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white min-w-96 rounded-xl p-4 border-posthog-3000-100 border ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title?: string;
  selectedPeriod?: TimePeriod;
  onPeriodChange?: (period: TimePeriod) => void;
  lastComputed?: string;
  children?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  selectedPeriod,
  onPeriodChange,
  lastComputed,
  children,
  className = "",
}: CardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);

  const handleMoveTo = () => {
    setIsOpen(false);
    // Handle move to action
  };

  const handleExport = () => {
    setIsOpen(false);
    // Handle export action
  };

  const handleRefresh = () => {
    setIsOpen(false);
    // Handle refresh action
  };

  const handlePeriodSelect = (period: TimePeriod) => {
    if (period === selectedPeriod) {
      setIsDateRangeOpen(false);
      return;
    }
    onPeriodChange?.(period);
    setIsDateRangeOpen(false);
  };

  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      <div className="flex items-center gap-2">
        {title && <h4>{title}</h4>}
        {children}
      </div>
      <div className="flex items-center gap-0.5">
        {selectedPeriod !== undefined && onPeriodChange && (
          <DropdownMenu
            open={isDateRangeOpen}
            onOpenChange={setIsDateRangeOpen}
          >
            <DropdownMenuTrigger>
              <button
                className={`font-medium flex items-center gap-1.75 tracking-tight hover:bg-posthog-3000-100 rounded-md p-1.5 px-2.5 pr-2.75 h-8 cursor-pointer ${
                  isDateRangeOpen ? "bg-posthog-3000-100" : ""
                }`}
              >
                <CalendarRange size={15} strokeWidth={2} />
                {timePeriodLabels[selectedPeriod]}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {(Object.keys(timePeriodLabels) as TimePeriod[]).map((period) => (
                <DropdownMenuItem
                  key={period}
                  onClick={() => handlePeriodSelect(period)}
                  isSelected={selectedPeriod === period}
                >
                  {timePeriodLabels[period]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger>
            <button
              className={`font-medium flex items-center justify-center hover:bg-posthog-3000-100 rounded-md p-1.5 h-8 w-8 cursor-pointer ${
                isOpen ? "bg-posthog-3000-100" : ""
              }`}
            >
              <MoreHorizontal size={16} strokeWidth={2} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem
              onClick={handleMoveTo}
              trailingIcon={<ChevronRight size={16} strokeWidth={2} />}
            >
              Move to
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleExport}
              trailingIcon={<ChevronRight size={16} strokeWidth={2} />}
            >
              Export
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleRefresh}
              subtext={`Last computed ${lastComputed || "2 minutes ago"}`}
            >
              Refresh data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}
