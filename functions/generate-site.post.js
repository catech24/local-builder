
export async function onRequestPost(context) {
  const { request } = context;
  try {
    const body = await request.json();
    const {
      businessName,
      niche,
      services,
      city,
      state,
      zip,
      additionalCities,
      priceRange,
      painPoints,
      customerType,
      tier,
      openaiKey
    } = body;

    if (!niche || !city || !openaiKey || !tier) {
      return new Response(JSON.stringify({ error: "Missing required input" }), {
        status: 400,
      });
    }

    const systemPrompt = `
You are an expert in local SEO and Answer Engine Optimization (AEO). Based on the business details provided below, generate a structured content plan and create content modules that match one of these tiers: Mini, Medium, or Power SEO Local Business. All content must be AEO-first, pain-point driven, optimized for local intent, and structured to support internal linking and AI Overviews.

Business Info:
- Business Name: \${businessName}
- Niche: \${niche}
- Services: \${services.join(", ")}
- Location: \${city}, \${state}, \${zip}
- Service Area: \${additionalCities}
- Price Range: \${priceRange}
- Target Audience: \${customerType}
- Customer Pain Points: \${painPoints}

Tier Selected: \${tier}

Content Strategy Output:
1. List of pages to create
2. For each page, provide:
   - AEO-optimized Title and Meta Description
   - H1, H2s, H3s
   - Intro paragraph (snippet-worthy)
   - 2–3 FAQs with schema-ready Q&A
   - CTA with local keyword and contact info
   - Interlink suggestions
\`;

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${openaiKey}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Please generate the full content output now." }
        ],
        temperature: 0.7
      })
    });

    const result = await completion.json();

    if (!result.choices || !result.choices[0]) {
      return new Response(JSON.stringify({ error: "No response from OpenAI" }), {
        status: 500,
      });
    }

    const content = result.choices[0].message.content;

    return new Response(JSON.stringify({ content }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500
    });
  }
}
