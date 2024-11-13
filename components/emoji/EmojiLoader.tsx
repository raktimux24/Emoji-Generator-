"use client";

import { Sparkles } from "lucide-react";

export function EmojiLoader() {
  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <div className="relative">
        {/* Main circle pulse */}
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        
        {/* Rotating sparkles */}
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
          <Sparkles className="absolute -top-1 left-1/2 h-5 w-5 -translate-x-1/2 text-primary/60" />
          <Sparkles className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-primary/60" style={{ transform: 'translate(-50%, -50%) rotate(90deg)' }} />
          <Sparkles className="absolute bottom-0 left-1/2 h-5 w-5 -translate-x-1/2 text-primary/60" style={{ transform: 'translate(-50%, 0) rotate(180deg)' }} />
        </div>

        {/* Center circle */}
        <div className="relative h-16 w-16 rounded-full bg-primary/20 p-3">
          <div className="h-full w-full animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-primary/40" />
        </div>
      </div>

      {/* Loading text with animated dots */}
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium text-muted-foreground">
          Creating magic
        </span>
        <span className="flex space-x-1">
          <span className="animate-[bounce_1s_infinite]">.</span>
          <span className="animate-[bounce_1s_infinite_0.2s]">.</span>
          <span className="animate-[bounce_1s_infinite_0.4s]">.</span>
        </span>
      </div>
    </div>
  );
}