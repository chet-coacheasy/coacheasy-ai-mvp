import Anthropic from "@anthropic-ai/sdk";

const systemPrompt = `You are an AI assistant for CoachEasy that helps sports coaches create session listings. When given a description of a coaching session, extract and return ONLY a JSON object (no markdown, no extra text) with these fields: sessionName (string, catchy and professional), sport (string), ageGroup (string, e.g. "10-13"), level (string, one of: C/B, A/AA, AA/AAA, AAA, Elite/Pro), format (string, one of: Single Session, Multiple Sessions, Camp), schedule (string, human-readable), location (string), pricePerSession (number), badgeLabel (string, e.g. "Hockey · Clinic").`;

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: "Please provide a session description." },
        { status: 400 },
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Stream the response and collect the full text
    let fullText = "";

    const stream = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
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

    // Strip any markdown code fences if present
    let jsonStr = fullText.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "");
    }

    const session = JSON.parse(jsonStr);
    return Response.json(session);
  } catch (err) {
    console.error("Generate session error:", err);
    return Response.json(
      {
        error:
          "Failed to generate session. Please check your API key and try again.",
      },
      { status: 500 },
    );
  }
}
