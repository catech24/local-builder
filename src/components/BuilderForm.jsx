import { useState } from "react";

export default function BuilderForm({ onGenerate }) {
  const [formData, setFormData] = useState({
    businessName: "",
    niche: "",
    services: "",
    city: "",
    state: "",
    zip: "",
    additionalCities: "",
    priceRange: "",
    painPoints: "",
    customerType: "",
    tier: "Mini"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...formData,
      services: formData.services.split(",").map((s) => s.trim()),
      openaiKey: import.meta.env.VITE_OPENAI_KEY
    };

    console.log("📦 Sending payload:", payload);

    try {
      const res = await fetch("/functions/generate-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate site");
      onGenerate(data.content);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {[
        { label: "Business Name", name: "businessName" },
        { label: "Primary Service Niche", name: "niche" },
        { label: "Top 3 Services (comma-separated)", name: "services" },
        { label: "Target City", name: "city" },
        { label: "State", name: "state" },
        { label: "Zip Code", name: "zip" },
        { label: "Other Cities (optional)", name: "additionalCities" },
        { label: "Price Range (optional)", name: "priceRange" },
        { label: "Common Customer Pain Points", name: "painPoints" },
        { label: "Customer Type (e.g. Homeowners)", name: "customerType" }
      ].map(({ label, name }) => (
        <div key={name}>
          <label>{label}</label>
          <input type="text" name={name} value={formData[name]} onChange={handleChange} required={name !== "priceRange" && name !== "additionalCities"} />
        </div>
      ))}

      <label>Tier</label>
      <select name="tier" value={formData.tier} onChange={handleChange}>
        <option value="Mini">Mini</option>
        <option value="Medium">Medium</option>
        <option value="Power">Power</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Site"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
