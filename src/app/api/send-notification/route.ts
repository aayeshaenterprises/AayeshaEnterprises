import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Vercel deployment: Read from Environment Variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Local development fallback
      const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
      admin.initializeApp({
        credential: admin.credential.cert(require(serviceAccountPath))
      });
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

    const response = await admin.messaging().sendEachForMulticast(message);
    
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
