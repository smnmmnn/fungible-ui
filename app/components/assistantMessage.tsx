"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ActionBar from "./actionBar";

export default function AssistantMessage({ message }: { message: string }) {
  return (
    <div className="w-full flex justify-start flex-col items-start gap-1.5">
      <div className="px-4 py-3.5 bg-white border border-posthog-3000-100 rounded-xl max-w-[95%]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-lg font-bold mt-3 mb-2" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-base font-bold mt-2 mb-1" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-2 last:mb-0" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal list-inside mb-2 space-y-1"
                {...props}
              />
            ),
            li: ({ node, ...props }) => <li className="ml-4" {...props} />,
            code: ({ node, className, ...props }: any) => {
              const isInline = !className;
              return isInline ? (
                <code
                  className="bg-posthog-3000-100 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                />
              ) : (
                <code className={className} {...props} />
              );
            },
            pre: ({ node, ...props }) => (
              <pre
                className="bg-posthog-3000-100 p-3 rounded-lg overflow-x-auto mb-2 text-sm"
                {...props}
              />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-posthog-3000-200 pl-4 italic my-2"
                {...props}
              />
            ),
            a: ({ node, ...props }) => (
              <a
                className="text-primary-3000-button-border-hover-light underline"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-2">
                <table
                  className="min-w-full border-collapse border border-posthog-3000-200"
                  {...props}
                />
              </div>
            ),
            th: ({ node, ...props }) => (
              <th
                className="border border-posthog-3000-200 px-3 py-2 bg-posthog-3000-100 font-semibold"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td
                className="border border-posthog-3000-200 px-3 py-2"
                {...props}
              />
            ),
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
      <ActionBar />
    </div>
  );
}
