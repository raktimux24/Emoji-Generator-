export interface EmojiImage {
  id: string;
  url: string;
  prompt: string;
  createdAt?: Date;
  userId: string; // Add userId for storage path construction
}