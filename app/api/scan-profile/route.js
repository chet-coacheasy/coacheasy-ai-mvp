import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return Response.json({ error: "No URL provided" }, { status: 400 });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = `You are an AI assistant that researches sports coaches online. Given a website URL, extract and return coach profile information as JSON.

Return ONLY valid JSON with this exact structure, no markdown, no preamble:
{
  "firstName": "",
  "lastName": "",
  "orgName": "",
  "city": "",
  "province": "",
  "sport": "",
  "levels": [],
  "ageRange": "",
  "languages": [],
  "phone": "",
  "email": "",
  "bio": "",
  "bioFr": "",
  "expertise": [],
  "yearsExp": "",
  "instagram": "",
  "facebook": "",
  "tiktok": "",
  "youtube": ""
}

Fill every field you can infer from the URL and domain name. For Canadian coaches, default province based on city. Generate a compelling 2-3 sentence bio in both English and French if not found. Return empty string for fields you cannot determine — never return null.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Research this coach's website and extract their profile: ${url}`,
        },
      ],
    });

    const text = response.content[0]?.text || "{}";

    // Try to parse JSON from the response
    let parsed;
    try {
      // Handle case where response might be wrapped in markdown code block
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      parsed = {};
    }

    return Response.json(parsed);
  } catch (err) {
    console.error("Scan profile error:", err);
    return Response.json(
      { error: "Failed to scan profile. Please fill in manually." },
      { status: 500 }
    );
  }
}
