import { Brain } from "lucide-react";

export default function LoadingMessage() {
  return (
    <div className="w-full flex justify-start flex-col items-start gap-1.5 text-xs">
      <div className="px-1.5 py-2.25 flex items-center gap-1">
        <Brain size={14} strokeWidth={1.5} className="text-posthog-3000-600" />
        <span className="text-posthog-3000-600">Snagging…</span>
      </div>
    </div>
  );
}
