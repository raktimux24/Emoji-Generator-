import { EmojiGridSkeleton } from "@/components/emoji/EmojiGridSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-pulse">
        <div className="h-8 w-48 rounded bg-muted"></div>
        <div className="mt-2 h-4 w-96 rounded bg-muted"></div>
      </div>
      <EmojiGridSkeleton />
    </div>
  );
}