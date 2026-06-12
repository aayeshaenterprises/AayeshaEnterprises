import { db } from "./firebase";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

export async function getProjects() {
  try {
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getFeaturedProjects() {
  try {
    const q = query(
      collection(db, "projects"), 
      where("featured", "==", true),
      orderBy("order", "asc"),
      limit(3)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

export async function getServices() {
  try {
    const q = query(
      collection(db, "services"), 
      where("active", "==", true),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export async function getTestimonials() {
  try {
    const q = query(
      collection(db, "testimonials"), 
      where("active", "==", true),
      limit(3)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function submitContactForm(data: { name: string; phone: string; message: string; }) {
  try {
    const docRef = await addDoc(collection(db, "inquiries"), {
      ...data,
      read: false,
      createdAt: serverTimestamp()
    });

    // Send push notification to all admins using FCM via Next.js API
    await sendAdminPushNotification(
      "New Website Inquiry! 🚀", 
      `${data.name} sent a message: "${data.message.substring(0, 50)}..."`
    );

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error };
  }
}

export async function sendAdminPushNotification(title: string, body: string) {
  try {
    const tokensSnapshot = await getDocs(collection(db, "devices"));
    const pushTokens = tokensSnapshot.docs.map(doc => doc.data().pushToken).filter(Boolean);

    if (pushTokens.length > 0) {
      await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokens: pushTokens,
          title,
          body
        }),
      });
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}
