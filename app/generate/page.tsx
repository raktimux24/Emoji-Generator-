"use client";

import { EmojiGenerator } from "@/components/emoji/EmojiGenerator";
import { Card } from "@/components/ui/card";

export default function GeneratePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Generate Emoji</h1>
        <p className="text-muted-foreground">
          Enter a prompt to generate your custom emoji using AI
        </p>
      </div>
      
      <Card className="overflow-hidden">
        <EmojiGenerator />
      </Card>
    </div>
  );
}