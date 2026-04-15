import Anthropic from "@anthropic-ai/sdk";
import { sessions } from "@/lib/sessions";

export async function POST(req) {
  try {
    const { messages, profile } = await req.json();

    if (!messages || !messages.length) {
      return Response.json(
        { error: "No messages provided." },
        { status: 400 },
      );
    }

    const profileStr = profile
      ? `Sport: ${profile.sport || "N/A"}, Level: ${profile.level || "N/A"}, Age: ${profile.age || "N/A"}, Location: ${profile.city || "N/A"}`
      : "No profile provided";

    const sessionsStr = sessions
      .map(
        (s) =>
          `- ${s.title} by ${s.coach} | ${s.sport} | ${s.skill_level} | Ages ${s.age_min}-${s.age_max} | ${s.city}, ${s.province} | $${s.price} | ${s.schedule} | ${s.spots_available} spots | ${s.session_type}`,
      )
      .join("\n");

    const systemPrompt = `You are Coach Danielle, an AI sports coaching assistant for CoachEasy — Canada's coaching marketplace. You help athletes and parents find the right coaching sessions, camps, and clinics across Canada. The athlete's current profile is: ${profileStr}. You have access to the following upcoming sessions on CoachEasy:\n${sessionsStr}\nWhen a user asks about finding coaches or sessions, give a brief 2-3 sentence friendly response confirming you found matches, then end your message with the exact tag: [SHOW_COACHES:sport] where sport is one of: hockey, soccer, basketball, fitness. For example: [SHOW_COACHES:hockey]. Only include this tag when showing coach results, not for general questions. Always respond in the language the user writes in (English or French).`;

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const stream = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
      messages,
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
      },
    });
  } catch (err) {
    console.error("Chat error:", err);
    return Response.json(
      { error: "Failed to get response. Please try again." },
      { status: 500 },
    );
  }
}
