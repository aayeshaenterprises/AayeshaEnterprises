"use client";

import { useEffect } from "react";
import { db } from "@/lib/firestore";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

export function VisitTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const lastVisit = localStorage.getItem("lastVisitDate");
        
        // Only track once per day per user
        if (lastVisit === today) return;

        const docRef = doc(db, "analytics", "overview");
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          await setDoc(docRef, {
            totalVisits: 1,
            todayVisits: 1,
            activeUsers: 1,
            lastDate: today
          });
        } else {
          const data = docSnap.data();
          let newTodayVisits = data.todayVisits || 0;
          
          if (data.lastDate !== today) {
            newTodayVisits = 1; // reset today visits
          } else {
            newTodayVisits += 1;
          }

          await updateDoc(docRef, {
            totalVisits: increment(1),
            todayVisits: newTodayVisits,
            lastDate: today,
            activeUsers: Math.floor(Math.random() * 5) + 1 // dummy active users simulation
          });
        }
        
        localStorage.setItem("lastVisitDate", today);
      } catch (e) {
        console.error("Failed to track visit", e);
      }
    };

    trackVisit();
  }, []);

  return null;
}
