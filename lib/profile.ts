import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

interface ProfileData {
  name?: string;
  city?: string;
  country?: string;
  bio?: string;
  photoURL?: string;
  thumbnailURL?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

async function createThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 32; // Tiny thumbnail for Auth
        let width = img.width;
        let height = img.height;

        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function createProfileImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256; // Larger size for display
        let width = img.width;
        let height = img.height;

        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function updateProfilePicture(userId: string, file: File): Promise<string> {
  try {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Create both versions of the image
    const [thumbnail, fullImage] = await Promise.all([
      createThumbnail(file),
      createProfileImage(file)
    ]);

    // Update Firestore first
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      photoURL: fullImage,
      thumbnailURL: thumbnail,
      updatedAt: new Date(),
    });

    // Update Auth profile with tiny thumbnail
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        photoURL: thumbnail
      });
    }

    return fullImage;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string): Promise<ProfileData> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const defaultProfile: ProfileData = {
        name: auth.currentUser?.displayName || '',
        email: auth.currentUser?.email || '',
        photoURL: '',
        thumbnailURL: auth.currentUser?.photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(userRef, defaultProfile);
      return defaultProfile;
    }

    return userDoc.data() as ProfileData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

export async function updateUserProfile(userId: string, data: Partial<ProfileData>): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Remove photo URLs from data as they're handled separately
    const { photoURL, thumbnailURL, ...updateData } = data;
    
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: new Date(),
    });

    // Update Auth profile if name changed
    if (data.name && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: data.name,
      });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }
}