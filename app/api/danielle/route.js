import Anthropic from "@anthropic-ai/sdk";
import { COACHEASY_KNOWLEDGE_BASE } from "@/lib/knowledge-base";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { messages, language } = await req.json();

    if (!messages || !messages.length) {
      return Response.json(
        { error: "No messages provided." },
        { status: 400 },
      );
    }

    /* Anthropic requires the first message to have role "user".
       The widget includes the greeting (assistant) at the start,
       so strip any leading assistant messages. */
    const apiMessages = messages.filter((m) => m.role === "user" || m.role === "assistant");
    const firstUserIdx = apiMessages.findIndex((m) => m.role === "user");
    const trimmedMessages = firstUserIdx >= 0 ? apiMessages.slice(firstUserIdx) : [];

    /* Strip to only role + content — Anthropic rejects extra fields */
    const cleanMessages = trimmedMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    if (!cleanMessages.length || cleanMessages[0].role !== "user") {
      return Response.json(
        {
          error:
            "I'm having trouble connecting right now. Please contact us at info@coacheasy.com or call (800) 284-4602.",
        },
        { status: 400 },
      );
    }

    const systemPrompt =
      "You are Danielle, CoachEasy's AI support assistant. " +
      (language
        ? `The user's preferred language is ${language}. Respond in that language when possible. `
        : "") +
      COACHEASY_KNOWLEDGE_BASE;

    const stream = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      stream: true,
      system: systemPrompt,
      messages: cleanMessages,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("Danielle chat error:", err);
    return Response.json(
      {
        error:
          "I'm having trouble connecting right now. Please contact us at info@coacheasy.com or call (800) 284-4602.",
      },
      { status: 500 },
    );
  }
}
