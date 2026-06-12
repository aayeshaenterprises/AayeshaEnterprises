import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Vercel deployment: Read from Environment Variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      // Local development fallback
      const serviceAccountPath = path.join(process.cwd(), 'service-account.json.json');
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        initializeApp({
          credential: cert(serviceAccount)
        });
      }
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export async function POST(req: Request) {
  try {
    const { tokens, title, body } = await req.json();

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ success: false, error: 'No tokens provided' }, { status: 400 });
    }

    const message = {
      notification: {
        title,
        body
      },
      tokens, // Sends to multiple devices at once
    };

    const response = await getMessaging().sendEachForMulticast(message);
    
    return NextResponse.json({ 
      success: true, 
      successCount: response.successCount,
      failureCount: response.failureCount 
    });
  } catch (error: any) {
    console.error('Error sending push notification:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
