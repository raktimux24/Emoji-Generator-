"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmojiGrid } from "@/components/emoji/EmojiGrid";
import { useEffect, useState } from "react";
import { EmojiGalleryHeader } from "@/components/emoji/EmojiGalleryHeader";
import { type EmojiImage } from "@/lib/types";
import { useAuth } from "@/components/providers";
import { getUserEmojis, getCommunityEmojis } from "@/lib/emoji";
import { useToast } from "@/components/ui/use-toast";

export default function GalleryPage() {
  const [personalEmojis, setPersonalEmojis] = useState<EmojiImage[]>([]);
  const [communityEmojis, setCommunityEmojis] = useState<EmojiImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchEmojis() {
      try {
        setIsLoading(true);
        if (user) {
          const userEmojis = await getUserEmojis(user.uid);
          setPersonalEmojis(userEmojis);
        }
        const community = await getCommunityEmojis();
        setCommunityEmojis(community);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load emojis. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmojis();
  }, [user, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <EmojiGalleryHeader />
      
      <Tabs defaultValue="personal" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="personal">My Emojis</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <EmojiGrid 
            emojis={personalEmojis} 
            isLoading={isLoading}
            emptyMessage="You haven't generated any emojis yet. Start creating!"
          />
        </TabsContent>
        
        <TabsContent value="community">
          <EmojiGrid 
            emojis={communityEmojis} 
            isLoading={isLoading}
            emptyMessage="No community emojis found. Be the first to share!"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}