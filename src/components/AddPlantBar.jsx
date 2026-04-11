import React, { useState } from "react";
import { KNOWN_PARENT_IDS } from "../data/taxonomy";
import styles from "./AddPlantBar.module.css";

export function AddPlantBar({ onAdd }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    const plantName = value.trim();
    if (!plantName) return;
    setLoading(true);
    setStatus("Classifying with AI...");

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) {
        setStatus("No API key found. Add VITE_ANTHROPIC_API_KEY to your .env file.");
        setLoading(false);
        return;
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Classify the plant "${plantName}" in the plant taxonomy hierarchy.
Return ONLY a JSON object with no markdown, no explanation — just raw JSON. Format:
{
  "valid": true/false,
  "nodeId": "unique_snake_case_id",
  "name": "Scientific name (Genus species)",
  "rank": "species or genus",
  "desc": "One sentence description.",
  "parentId": "id of the parent node — must be one of: ${KNOWN_PARENT_IDS.join(", ")}",
  "invalidReason": "if valid is false, explain why"
}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.map((i) => i.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);

      if (!result.valid) {
        setStatus(result.invalidReason || "Could not classify plant.");
        setLoading(false);
        return;
      }

      onAdd(result.parentId, {
        id: result.nodeId,
        name: result.name,
        rank: result.rank,
        desc: result.desc,
        children: [],
      });

      setStatus(`Added "${result.name}"`);
      setValue("");
    } catch (err) {
      console.error(err);
      setStatus("Error classifying plant. Check your API key and try again.");
    }
    setLoading(false);
  }

  return (
    <div className={styles.wrapper}>
      {status && <div className={styles.status}>{status}</div>}
      <div className={styles.bar}>
        <input
          className={styles.input}
          type="text"
          placeholder="Add a plant (e.g. 'basil', 'oak tree')..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          disabled={loading}
        />
        <button
          className={styles.btn}
          onClick={handleAdd}
          disabled={loading || !value.trim()}
        >
          {loading ? "Classifying…" : "Classify + Add"}
        </button>
      </div>
    </div>
  );
}
