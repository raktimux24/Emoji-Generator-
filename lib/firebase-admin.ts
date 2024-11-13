"use client";

import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const adminApp = getApp();
const adminStorage = getStorage(adminApp);

// Create default bucket if it doesn't exist
async function ensureDefaultBucket() {
  try {
    const bucket = adminStorage.bucket();
    const [exists] = await bucket.exists();
    
    if (!exists) {
      await bucket.create();
      console.log('Default bucket created successfully');
      
      // Set CORS configuration
      await bucket.setCorsConfiguration([
        {
          origin: ['*'],
          method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          maxAgeSeconds: 3600,
          responseHeader: [
            'Content-Type',
            'Authorization',
            'Content-Length',
            'User-Agent',
            'x-goog-resumable',
          ],
        },
      ]);
      
      // Set storage rules
      const rules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /emojis/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`;
      
      await bucket.file('storage.rules').save(rules);
    }
  } catch (error) {
    console.error('Error ensuring default bucket:', error);
  }
}

ensureDefaultBucket();

export { adminStorage };