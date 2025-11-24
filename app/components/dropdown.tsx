"use client";

import * as Popover from "@radix-ui/react-popover";
import { ReactNode } from "react";

interface DropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DropdownMenu({
  children,
  open,
  onOpenChange,
}: DropdownMenuProps) {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Popover.Root>
  );
}

interface DropdownMenuTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export function DropdownMenuTrigger({
  children,
  asChild = true,
}: DropdownMenuTriggerProps) {
  return <Popover.Trigger asChild={asChild}>{children}</Popover.Trigger>;
}

interface DropdownMenuContentProps {
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  minWidth?: string;
  className?: string;
}

export function DropdownMenuContent({
  children,
  side = "bottom",
  align = "start",
  minWidth = "200px",
  className = "",
}: DropdownMenuContentProps) {
  return (
    <Popover.Portal>
      <Popover.Content
        className={`bg-white rounded-lg border border-posthog-3000-200 shadow-lg p-1 z-50 ${className}`}
        style={{ minWidth }}
        side={side}
        align={align}
        sideOffset={5}
      >
        <div className="flex flex-col gap-px">{children}</div>
      </Popover.Content>
    </Popover.Portal>
  );
}

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  subtext?: string;
  isSelected?: boolean;
  className?: string;
}

export function DropdownMenuItem({
  children,
  onClick,
  icon,
  trailingIcon,
  subtext,
  isSelected = false,
  className = "",
}: DropdownMenuItemProps) {
  const hasSubtext = !!subtext;
  const hasTrailingIcon = !!trailingIcon;

  if (hasSubtext) {
    return (
      <button
        onClick={onClick}
        className={`text-left flex-col flex px-2 py-2 rounded-md hover:bg-posthog-3000-100 text-sm font-medium ${
          isSelected ? "bg-posthog-3000-100" : ""
        } ${className}`}
      >
        {children}
        <span className="text-xs text-posthog-3000-600">{subtext}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`text-left flex items-center ${
        hasTrailingIcon ? "justify-between" : ""
      } px-2 py-2 rounded-md hover:bg-posthog-3000-100 text-sm font-medium w-full ${
        isSelected ? "bg-posthog-3000-100" : ""
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{children}</span>
      </div>
      {hasTrailingIcon && trailingIcon}
    </button>
  );
}
