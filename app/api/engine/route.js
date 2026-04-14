import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are the AI engine behind CoachEasy, a coaching session platform. You handle three tasks depending on the action passed in.

---

ACTION: generate_session
INPUT: A plain-language session description from a coach.
OUTPUT: Return ONLY a valid JSON object with these keys: title, price (number only), sport, ageGroup, level, format, schedule, location, maxAthletes. No markdown, no explanation.

---

ACTION: match_group
CONTEXT: You are Danielle, an assistant helping a coach pick an athlete group to send a session to.
INPUT: The coach's description of who should receive the session.
OUTPUT: Reply in one sentence — no filler, just the match confirmation. Then on a new line write: SELECTED_GROUP:<key>. If the description is unclear, ask one short clarifying question and omit the SELECTED_GROUP line. Never show the SELECTED_GROUP token in your visible reply.

---

ACTION: draft_email
INPUT: Session details and recipient group.
OUTPUT: A plain-text email body only — no subject line, no greeting, 3–4 short paragraphs, warm and motivating tone, ends with a clear call to action to register or reply. No markdown.`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return Response.json(
        { error: "Missing action parameter." },
        { status: 400 },
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    let userMessage = "";

    if (action === "generate_session") {
      const { prompt } = body;
      if (!prompt) {
        return Response.json(
          { error: "Missing prompt for generate_session." },
          { status: 400 },
        );
      }
      userMessage = `ACTION: generate_session\nINPUT: ${prompt}`;
    } else if (action === "match_group") {
      const { coachName, groups, description } = body;
      if (!description || !groups) {
        return Response.json(
          { error: "Missing description or groups for match_group." },
          { status: 400 },
        );
      }
      const groupsList = groups
        .map((g) => `- ${g.key}: ${g.name} (${g.count} athletes)`)
        .join("\n");
      userMessage = `ACTION: match_group\nCOACH: ${coachName || "Coach"}\nGROUPS:\n${groupsList}\nINPUT: ${description}`;
    } else if (action === "draft_email") {
      const { session, coachName, groupName } = body;
      if (!session || !groupName) {
        return Response.json(
          { error: "Missing session or groupName for draft_email." },
          { status: 400 },
        );
      }
      const s = session;
      const sessionLine = `${s.title} | ${s.sport} | Ages ${s.ageGroup} | ${s.level} level | ${s.schedule} | ${s.location} | $${s.price}/session | Max ${s.maxAthletes} athletes`;
      userMessage = `ACTION: draft_email\nSESSION: ${sessionLine}\nCOACH: ${coachName || "Coach"}\nGROUP: ${groupName}`;
    } else {
      return Response.json(
        { error: `Unknown action: ${action}` },
        { status: 400 },
      );
    }

    let fullText = "";

    const stream = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        fullText += event.delta.text;
      }
    }

    fullText = fullText.trim();

    // Action-specific response parsing
    if (action === "generate_session") {
      let jsonStr = fullText;
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr
          .replace(/^```(?:json)?\n?/, "")
          .replace(/\n?```$/, "");
      }
      const session = JSON.parse(jsonStr);
      return Response.json({ action, session });
    }

    if (action === "match_group") {
      // Extract SELECTED_GROUP:<key> from the response
      const match = fullText.match(/SELECTED_GROUP:(\S+)/);
      const selectedGroup = match ? match[1] : null;
      // Remove the SELECTED_GROUP token from visible text
      const visibleText = fullText
        .replace(/\n?SELECTED_GROUP:\S+/, "")
        .trim();
      return Response.json({
        action,
        message: visibleText,
        selectedGroup,
      });
    }

    if (action === "draft_email") {
      return Response.json({ action, email: fullText });
    }

    return Response.json({ action, result: fullText });
  } catch (err) {
    console.error("Engine error:", err);
    return Response.json(
      { error: "Engine request failed. Please try again." },
      { status: 500 },
    );
  }
}
