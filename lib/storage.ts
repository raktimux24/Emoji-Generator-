import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

interface UploadOptions {
  path: string;
  file: File;
  metadata?: { [key: string]: string };
}

export async function uploadFile({ path, file, metadata }: UploadOptions) {
  try {
    // Create storage reference with full path
    const storageRef = ref(storage, path);

    // Set up metadata with content type and custom fields
    const uploadMetadata = {
      contentType: file.type,
      customMetadata: {
        ...metadata,
        uploadedAt: new Date().toISOString(),
      },
    };

    // Upload file with metadata
    const snapshot = await uploadBytes(storageRef, file, uploadMetadata);
    console.log('Upload successful:', snapshot.ref.fullPath);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', downloadURL);

    return { downloadURL, path };
  } catch (error) {
    console.error('Storage error:', error);
    throw error;
  }
}