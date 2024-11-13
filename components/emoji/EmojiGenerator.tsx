"use client";

import { useState } from "react";
import { PromptInput } from "./PromptInput";
import { EmojiDisplay } from "./EmojiDisplay";
import { generateEmoji } from "@/lib/emoji";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/providers";

export type GenerationStatus = "idle" | "generating" | "success" | "error";

export function EmojiGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerate = async (prompt: string) => {
    // Validate user authentication
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to generate emojis",
      });
      return;
    }

    // Validate prompt
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a description for your emoji",
      });
      return;
    }

    try {
      setStatus("generating");
      setError(null);
      setCurrentPrompt(prompt);
      
      const result = await generateEmoji(prompt);
      
      if (!result) {
        throw new Error("Failed to generate emoji");
      }
      
      setImage(result);
      setStatus("success");
      
      toast({
        title: "Success!",
        description: "Your emoji has been created successfully.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate emoji";
      setError(errorMessage);
      setStatus("error");
      
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage,
      });
    }
  };

  const handleRegenerate = () => {
    if (currentPrompt) {
      handleGenerate(currentPrompt);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <PromptInput 
        onGenerate={handleGenerate} 
        disabled={status === "generating"} 
        initialPrompt={currentPrompt}
      />
      <EmojiDisplay
        image={image}
        status={status}
        error={error}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}