"use client";

import { EmojiCard } from "./EmojiCard";
import { EmojiGridSkeleton } from "./EmojiGridSkeleton";
import { type EmojiImage } from "@/lib/types";

interface EmojiGridProps {
  emojis: EmojiImage[];
  isLoading: boolean;
  emptyMessage: string;
}

export function EmojiGrid({ emojis, isLoading, emptyMessage }: EmojiGridProps) {
  if (isLoading) {
    return <EmojiGridSkeleton />;
  }

  if (emojis.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-center text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {emojis.map((emoji) => (
        <EmojiCard key={emoji.id} emoji={emoji} />
      ))}
    </div>
  );
}