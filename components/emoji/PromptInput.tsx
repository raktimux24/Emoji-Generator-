"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  disabled?: boolean;
  initialPrompt?: string;
}

export function PromptInput({ onGenerate, disabled, initialPrompt = "" }: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <div className="space-y-2">
        <label
          htmlFor="prompt"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Describe your emoji
        </label>
        <Textarea
          id="prompt"
          placeholder="E.g., A happy cat wearing sunglasses and a party hat"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[200px] resize-none"
          disabled={disabled}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={disabled || !prompt.trim()}
      >
        <Wand2 className={`mr-2 h-4 w-4 ${disabled ? "animate-spin" : ""}`} />
        {disabled ? "Generating..." : "Generate Emoji"}
      </Button>
    </form>
  );
}