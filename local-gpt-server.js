import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/functions/generate-site", async (req, res) => {
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
  } = req.body;

  if (!niche || !city || !openaiKey || !tier) {
    return res.status(400).json({ error: "Missing required input" });
  }

  const systemPrompt = `
You are an expert in local SEO and Answer Engine Optimization (AEO). Based on the business details provided below, generate a structured content plan and create content modules that match one of these tiers: Mini, Medium, or Power SEO Local Business. All content must be AEO-first, pain-point driven, optimized for local intent, and structured to support internal linking and AI Overviews.

Business Info:
- Business Name: ${businessName}
- Niche: ${niche}
- Services: ${services.join(", ")}
- Location: ${city}, ${state}, ${zip}
- Service Area: ${additionalCities}
- Price Range: ${priceRange}
- Target Audience: ${customerType}
- Customer Pain Points: ${painPoints}

Tier Selected: ${tier}

Content Strategy Output:
1. List of pages to create
2. For each page, provide:
   - AEO-optimized Title and Meta Description
   - H1, H2s, H3s
   - Intro paragraph (snippet-worthy)
   - 2–3 FAQs with schema-ready Q&A
   - CTA with local keyword and contact info
   - Interlink suggestions
`;

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
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

    const json = await completion.json();
    const content = json.choices?.[0]?.message?.content;
    res.json({ content });
  } catch (err) {
    console.error("🔥 GPT Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(8787, () => {
  console.log("✅ Local GPT server running on http://localhost:8787");
});
