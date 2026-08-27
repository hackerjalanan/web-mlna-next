"use client";

import { useState } from "react";

export default function JsonFormatter() {
  const [json, setJson] = useState("");

  const formatJson = () => {
    try {
      const result = JSON.stringify(
        JSON.parse(json),
        null,
        2
      );

      setJson(result);

    } catch {
      alert("JSON tidak valid");
    }
  };

  return (
    <div className="space-y-4">

      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="h-64 w-full rounded border p-4 font-mono"
        placeholder='{"name":"test"}'
      />

      <button
        onClick={formatJson}
        className="rounded bg-cyan-500 px-4 py-2"
      >
        Format JSON
      </button>

    </div>
  );
}