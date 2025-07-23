console.log("App is rendering...");

import { useState } from "react";
import BuilderForm from "./components/BuilderForm";
import PreviewPane from "./components/PreviewPane";

export default function App() {
  const [html, setHtml] = useState("");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>AI Website Builder</h1>
      <BuilderForm onGenerate={setHtml} />
      <PreviewPane html={html} />
    </div>
  );
}
