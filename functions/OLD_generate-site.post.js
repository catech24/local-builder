export async function onRequestPost(context) {
  const { request } = context;
  try {
    const { niche, location, openaiKey } = await request.json();

    if (!niche || !location || !openaiKey) {
      return new Response(JSON.stringify({ error: "Missing input" }), {
        status: 400
      });
    }

    const prompt = `Generate a complete SEO-optimized landing page in HTML for a ${niche} business in ${location}. Include:
- Title tag
- Meta description
- H1 and H2s
- Clear CTA
- FAQ section
- FAQ structured data in JSON-LD
Output only raw HTML.`;

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const result = await completion.json();
    const html = result.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ html }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
