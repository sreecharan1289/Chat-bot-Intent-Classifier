"use client";
import React from "react";

export default function Output({ text }: { text: string }) {
  return (
    <pre className="min-h-[160px] whitespace-pre-wrap rounded-md border border-zinc-200/50 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      {text || "Output will appear here..."}
    </pre>
  );
}
