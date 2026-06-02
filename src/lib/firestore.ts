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
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error };
  }
}
