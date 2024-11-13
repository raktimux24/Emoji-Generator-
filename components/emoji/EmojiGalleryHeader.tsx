import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function EmojiGalleryHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Emoji Gallery</h1>
        <p className="text-muted-foreground">
          Browse your generated emojis and discover community creations
        </p>
      </div>
      <Button asChild>
        <Link href="/generate">
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Link>
      </Button>
    </div>
  );
}