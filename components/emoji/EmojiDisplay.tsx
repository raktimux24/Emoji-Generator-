"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { GenerationStatus } from "./EmojiGenerator";
import { EmojiLoader } from "./EmojiLoader";

interface EmojiDisplayProps {
  image: string | null;
  status: GenerationStatus;
  error: string | null;
  onRegenerate: (prompt: string) => void;
}

export function EmojiDisplay({
  image,
  status,
  error,
  onRegenerate,
}: EmojiDisplayProps) {
  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "emoji.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center border-l p-6">
      <div className="relative mb-4 flex h-[300px] w-[300px] items-center justify-center rounded-lg border bg-muted/50">
        {status === "generating" && <EmojiLoader />}
        {status === "error" && (
          <div className="text-center text-sm text-destructive">{error}</div>
        )}
        {status === "success" && image && (
          <Image
            src={image}
            alt="Generated emoji"
            width={256}
            height={256}
            className="rounded-lg"
          />
        )}
      </div>

      {status === "success" && image && (
        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button onClick={() => onRegenerate("")} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        </div>
      )}
    </div>
  );
}