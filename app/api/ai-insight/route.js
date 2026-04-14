import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: "Please provide a prompt." },
        { status: 400 },
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    let fullText = "";

    const stream = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      stream: true,
      system:
        "You are a concise AI coaching business advisor for CoachEasy. Return ONLY the plain text insight — no JSON, no quotes, no labels, no markdown. Just 1-2 direct sentences.",
      messages: [{ role: "user", content: prompt }],
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        fullText += event.delta.text;
      }
    }

    return Response.json({ insight: fullText.trim() });
  } catch (err) {
    console.error("AI insight error:", err);
    return Response.json(
      { error: "Failed to generate insight." },
      { status: 500 },
    );
  }
}
