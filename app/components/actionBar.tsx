import { Copy, Eye, RefreshCcw, ThumbsDown, ThumbsUp } from "lucide-react";

export default function ActionBar() {
  return (
    <div className="flex items-center gap-1">
      <button className="size-6 rounded-md hover:bg-posthog-3000-200 flex items-center justify-center cursor-pointer">
        <ThumbsUp size={14} strokeWidth={1.5} />
      </button>
      <button className="size-6 rounded-md hover:bg-posthog-3000-200 flex items-center justify-center cursor-pointer">
        <ThumbsDown size={14} strokeWidth={1.5} />
      </button>
      <button className="size-6 rounded-md hover:bg-posthog-3000-200 flex items-center justify-center cursor-pointer">
        <RefreshCcw size={14} strokeWidth={1.5} />
      </button>
      <button className="size-6 rounded-md hover:bg-posthog-3000-200 flex items-center justify-center cursor-pointer">
        <Eye size={14} strokeWidth={1.5} />
      </button>
      <button className="size-6 rounded-md hover:bg-posthog-3000-200 flex items-center justify-center cursor-pointer">
        <Copy size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
