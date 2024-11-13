import { db, auth } from './firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const HUGGINGFACE_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/PTtuts/flux-emoji";

export async function generateEmoji(prompt: string): Promise<string> {
  // Validate environment variables
  if (!HUGGINGFACE_API_KEY) {
    throw new Error("HuggingFace API key is not configured");
  }

  // Validate authentication
  if (!auth.currentUser) {
    throw new Error("Please sign in to generate emojis");
  }

  // Validate prompt
  if (!prompt?.trim()) {
    throw new Error("Please provide a description for your emoji");
  }

  try {
    // Generate the emoji using HuggingFace API
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({ 
        inputs: prompt,
        options: { wait_for_model: true }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Failed to generate emoji: ${response.statusText}`
      );
    }

    // Get the image data as blob
    const imageBlob = await response.blob();
    
    if (!imageBlob || imageBlob.size === 0) {
      throw new Error("Generated image is empty or invalid");
    }
    
    // Convert blob to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Failed to convert image to base64"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read image data"));
      reader.readAsDataURL(imageBlob);
    });

    // Generate unique ID for the emoji
    const imageId = uuidv4();

    // Store in Firestore
    await addDoc(collection(db, 'emojis'), {
      id: imageId,
      userId: auth.currentUser.uid,
      prompt: prompt.trim(),
      imageUrl: base64,
      createdAt: serverTimestamp(),
      isPublic: true,
    });

    return base64;
  } catch (error) {
    console.error("Error generating emoji:", error);
    
    // Handle specific error types
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Network error. Please check your internet connection.");
    }
    
    if (error instanceof Error) {
      throw new Error(
        error.message.includes('Firebase') 
          ? "Failed to save emoji. Please try again." 
          : error.message
      );
    }
    
    throw new Error("Failed to generate emoji. Please try again.");
  }
}

export async function getUserEmojis(userId: string) {
  if (!userId) {
    console.error("No user ID provided");
    return [];
  }

  try {
    const q = query(
      collection(db, 'emojis'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.data().id,
      url: doc.data().imageUrl,
      prompt: doc.data().prompt,
      createdAt: doc.data().createdAt?.toDate(),
      userId: doc.data().userId,
    }));
  } catch (error) {
    console.error("Error fetching user emojis:", error);
    return [];
  }
}

export async function getCommunityEmojis() {
  try {
    const q = query(
      collection(db, 'emojis'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.data().id,
      url: doc.data().imageUrl,
      prompt: doc.data().prompt,
      createdAt: doc.data().createdAt?.toDate(),
      userId: doc.data().userId,
    }));
  } catch (error) {
    console.error("Error fetching community emojis:", error);
    return [];
  }
}