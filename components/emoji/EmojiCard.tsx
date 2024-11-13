"use client";

import Image from "next/image";
import { useState } from "react";
import { Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type EmojiImage } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

interface EmojiCardProps {
  emoji: EmojiImage;
}

export function EmojiCard({ emoji }: EmojiCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (isDownloading || !emoji.url) return;

    try {
      setIsDownloading(true);

      // For base64 images
      if (emoji.url.startsWith('data:')) {
        // Create a temporary link
        const link = document.createElement('a');
        link.href = emoji.url;
        link.download = `emoji-${emoji.id || 'download'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For regular URLs
        const response = await fetch(emoji.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `emoji-${emoji.id || 'download'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      toast({
        title: "Download Complete",
        description: "Your emoji has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not download the emoji. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <Image
            src={emoji.url}
            alt={emoji.prompt}
            fill
            className="object-cover"
            unoptimized
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-all">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleDownload}
                disabled={isDownloading}
                className="h-10 w-10"
              >
                <Download className={`h-5 w-5 ${isDownloading ? 'animate-bounce' : ''}`} />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardFooter className="flex flex-col items-start gap-1 p-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {emoji.prompt}
        </p>
        {emoji.createdAt && (
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(emoji.createdAt, { addSuffix: true })}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}