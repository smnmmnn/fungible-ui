"use client";

import { ArrowRight, Plus, Paperclip, Camera, Github } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown";

interface ComposerProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function Composer({
  onSendMessage,
  isLoading = false,
}: ComposerProps) {
  const [input, setInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && !isLoading) {
      onSendMessage(trimmedInput);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = !input.trim() || isLoading;

  return (
    <div className="sticky bottom-0 flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full z-20">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl border-posthog-3000-100 border focus-within:border-posthog-3000-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="w-full h-12 resize-none focus:outline-none p-3.5"
              placeholder="Type your message..."
            />
            <div className="flex items-center gap-2 p-2.5 justify-between">
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger>
                  <button
                    type="button"
                    className={`size-8 border border-posthog-3000-200 hover:bg-posthog-3000-100 cursor-pointer text-posthog-3000-900 rounded-md flex items-center justify-center ${
                      dropdownOpen ? "bg-posthog-3000-100" : ""
                    }`}
                  >
                    <Plus size={18} strokeWidth={1.5} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start">
                  <DropdownMenuItem
                    icon={<Paperclip size={16} strokeWidth={1.5} />}
                    onClick={() => {
                      // TODO: Implement file upload
                      setDropdownOpen(false);
                    }}
                  >
                    Upload a file
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    icon={<Camera size={16} strokeWidth={1.5} />}
                    onClick={() => {
                      // TODO: Implement screenshot
                      setDropdownOpen(false);
                    }}
                  >
                    Take a screenshot
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    icon={<Github size={16} strokeWidth={1.5} />}
                    onClick={() => {
                      // TODO: Implement GitHub integration
                      setDropdownOpen(false);
                    }}
                  >
                    Add from GitHub
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                type="submit"
                disabled={isDisabled}
                className={`group relative h-8 border rounded-md cursor-pointer text-posthog-3000-900 ${
                  isDisabled
                    ? "bg-posthog-3000-200 border-posthog-3000-300 cursor-not-allowed"
                    : "bg-primary-3000-frame-bg-light border-primary-3000-button-border-light hover:border-primary-3000-button-border-hover-light"
                }`}
              >
                <span
                  className={`-m-px h-[calc(100%+2px)] w-[calc(100%+2px)] bg-white border rounded-md px-2.5 flex items-center justify-center ${
                    isDisabled
                      ? "border-posthog-3000-300 translate-y-0"
                      : "border-primary-3000-button-border-light -translate-y-0.5 group-hover:border-primary-3000-button-border-hover-light group-hover:-translate-y-0.75 group-active:-translate-y-0.25"
                  }`}
                >
                  <ArrowRight
                    strokeWidth={1.5}
                    size={18}
                    className={isDisabled ? "text-posthog-3000-500" : ""}
                  />
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="h-6 bg-posthog-3000-100/90 w-full -mt-2 z-10"></div>
    </div>
  );
}
