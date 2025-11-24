"use client";

import { useState, useRef, useEffect } from "react";
import Composer from "./components/composer";
import UserMessage from "./components/userMessage";
import AssistantMessage from "./components/assistantMessage";
import LoadingMessage from "./components/loadingMessage";
import { Message, UIComponent } from "./types/chat";
import SingleNumber from "./components/singleNumber";
import BarChart from "./components/barChart";
import ActionBar from "./components/actionBar";
import { Squirrel } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderUIComponent = (component: UIComponent) => {
    switch (component.type) {
      case "single_number":
        return <SingleNumber />;
      case "bar_chart":
        return <BarChart />;
      default:
        return (
          <div className="px-4 py-2.25 bg-white border border-posthog-3000-100 rounded-xl text-sm text-posthog-3000-600">
            Component type &quot;{component.type}&quot; not yet implemented
          </div>
        );
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (userMessage: string) => {
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    // Add empty assistant message that we'll update as we stream
    const assistantMessageIndex = newMessages.length;
    setMessages([...newMessages, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...newMessages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(
          `Failed to get response: ${response.status} ${errorText}`
        );
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              setIsLoading(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[assistantMessageIndex] = {
                    role: "assistant",
                    content: accumulatedContent,
                    ui: updated[assistantMessageIndex]?.ui,
                  };
                  return updated;
                });
              }
              if (parsed.structured) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[assistantMessageIndex] = {
                    role: "assistant",
                    content: parsed.structured.utterance || accumulatedContent,
                    ui: parsed.structured.ui,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantMessageIndex] = {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        };
        return updated;
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-posthog-3000-50 flex flex-col text-base  min-h-svh">
      <div
        ref={messagesContainerRef}
        className="grow flex justify-center py-6 overflow-y-auto"
      >
        <div className="max-w-3xl w-full flex flex-col gap-3.5">
          {messages.length === 0 && (
            <div className="w-full h-full flex justify-center items-center">
              <div className="text-center flex justify-center flex-col items-center">
                <Squirrel
                  size={40}
                  strokeWidth={1.5}
                  className="text-posthog-3000-600 mb-3"
                />
                <div className="font-[750] text-xl mb-1">
                  How can I help you understand users?
                </div>
                <div className="text-posthog-3000-600 italic">
                  Build something people want.
                </div>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              {message.role === "user" ? (
                <UserMessage message={message.content} />
              ) : message.content ||
                (message.ui?.components && message.ui.components.length > 0) ? (
                <>
                  {message.content && (
                    <AssistantMessage message={message.content} />
                  )}
                  {message.ui?.components &&
                    message.ui.components.length > 0 &&
                    message.ui.components.map((component) => (
                      <div key={component.id} className="w-fit">
                        {renderUIComponent(component)}
                        <ActionBar />
                      </div>
                    ))}
                </>
              ) : (
                <LoadingMessage />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <Composer onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
