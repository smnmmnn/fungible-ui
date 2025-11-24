import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const responseSchema = {
  type: "object",
  properties: {
    utterance: {
      type: "string",
      description: "The natural language response to the user",
    },
    ui: {
      type: "object",
      properties: {
        version: {
          type: "number",
          description: "Version of the UI schema",
        },
        components: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["single_number", "bar_chart"],
                description: "Type of UI component to render",
              },
              id: {
                type: "string",
                description: "Unique identifier for the component",
              },
            },
            required: ["type", "id"],
            additionalProperties: false,
          },
        },
      },
      required: ["version", "components"],
      additionalProperties: false,
    },
  },
  required: ["utterance", "ui"],
  additionalProperties: false,
} as const;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Add system message with instructions for UI components
    const systemMessage: { role: "system"; content: string } = {
      role: "system",
      content: [
        "You are an internal conversational UI assistant built into PostHog's product. Your primary job is to help PostHog users interact with their product analytics data through natural conversation, rendering UI components when appropriate.",
        "",
        "ABOUT POSTHOG:",
        "PostHog is an open-source product analytics platform that helps teams understand how users interact with their products. It provides features like event tracking, user analytics, feature flags, session recordings, A/B testing, and more. PostHog is used by product teams, engineers, and data analysts to make data-driven decisions about their products. Users typically want to understand metrics like user engagement, feature adoption, conversion rates, cost analysis, and other product insights.",
        "",
        "WRITING STYLE:",
        "Be a helpful, friendly assistant. Write in a slightly PostHog-influenced style: conversational and approachable, but professional. Keep it casual and friendly without being overly corporate. Be clear and direct while maintaining a warm, helpful tone.",
        "",
        "IMPORTANT RULES:",
        "- ONLY return UI components when the user asks a question that requires data visualization",
        '- When returning UI components, set utterance to an empty string ""',
        '- Use "single_number" component for questions about a single metric/value (e.g., "What\'s my total LLM cost for the last 30 days?")',
        '- Use "bar_chart" component for questions about breakdowns/comparisons by category (e.g., "Give me a breakdown of LLM cost by model over the last 30 days")',
        "- For regular conversational questions that don't need visualization, return only an utterance (no UI components)",
        '- Each component must have a unique "id" field',
        "",
        "Examples:",
        '- "What\'s my total LLM cost for the last 30 days?" → utterance: "", ui: { version: 1, components: [{ type: "single_number", id: "total-cost" }] }',
        '- "Give me a breakdown of LLM cost by model" → utterance: "", ui: { version: 1, components: [{ type: "bar_chart", id: "cost-by-model" }] }',
        '- "Hello, how are you?" → utterance: "Hello! I\'m doing well, thank you for asking.", ui: { version: 1, components: [] }',
      ].join("\n"),
    };

    // Use GPT-5 Nano model with structured outputs
    const stream = await openai.chat.completions.create({
      model: "gpt-5-mini-2025-08-07",
      messages: [systemMessage, ...messages],
      stream: true,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "chat_response",
          strict: true,
          schema: responseSchema,
        },
      },
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let accumulatedContent = "";
          let inUtteranceString = false;
          let escapeNext = false;
          const utteranceStartPattern = '"utterance"';
          let patternMatchIndex = 0;
          let afterColon = false;

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              accumulatedContent += content;

              // Process each character to detect and stream utterance content
              for (let i = 0; i < content.length; i++) {
                const char = content[i];

                if (!inUtteranceString) {
                  // Try to match "utterance": pattern
                  if (patternMatchIndex < utteranceStartPattern.length) {
                    if (char === utteranceStartPattern[patternMatchIndex]) {
                      patternMatchIndex++;
                    } else {
                      patternMatchIndex = 0;
                    }
                  } else if (!afterColon) {
                    // After matching "utterance", look for : and "
                    if (char === ":") {
                      afterColon = true;
                    } else if (char !== " " && char !== "\n" && char !== "\t") {
                      patternMatchIndex = 0;
                      afterColon = false;
                    }
                  } else if (char === '"') {
                    // Found the opening quote of utterance value
                    inUtteranceString = true;
                    escapeNext = false;
                  } else if (char !== " " && char !== "\n" && char !== "\t") {
                    // Reset if we see non-whitespace before the quote
                    patternMatchIndex = 0;
                    afterColon = false;
                  }
                } else {
                  // Inside utterance string - stream characters as they come
                  if (escapeNext) {
                    // Handle escaped characters
                    let escapedChar = char;
                    if (char === "n") escapedChar = "\n";
                    else if (char === '"') escapedChar = '"';
                    else if (char === "\\") escapedChar = "\\";
                    else escapedChar = "\\" + char;

                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ content: escapedChar })}\n\n`
                      )
                    );
                    escapeNext = false;
                  } else if (char === "\\") {
                    escapeNext = true;
                  } else if (char === '"') {
                    // End of utterance string
                    inUtteranceString = false;
                    patternMatchIndex = 0;
                    afterColon = false;
                  } else {
                    // Stream regular character
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ content: char })}\n\n`
                      )
                    );
                  }
                }
              }
            }
          }

          // Parse the final accumulated content as structured JSON
          if (accumulatedContent.trim()) {
            try {
              const parsed = JSON.parse(accumulatedContent);

              // Send the structured output with UI components
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ structured: parsed })}\n\n`
                )
              );
            } catch {
              // If parsing fails, send the content as utterance
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    structured: {
                      utterance: accumulatedContent,
                      ui: { version: 1, components: [] },
                    },
                  })}\n\n`
                )
              );
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to get response from OpenAI";
    const errorStatus = 500;
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error instanceof Error ? error.stack : null,
      }),
      { status: errorStatus, headers: { "Content-Type": "application/json" } }
    );
  }
}
