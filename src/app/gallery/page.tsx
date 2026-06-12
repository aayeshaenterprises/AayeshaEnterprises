"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import { MediaLightbox } from "@/components/ui/MediaLightbox";

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type?: "image" | "video"; cloudinaryId?: string } | null>(null);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-heading font-bold mb-6">Gallery</h1>
      <p className="text-muted-foreground text-lg max-w-3xl mb-12">
        A closer look at our craftsmanship and attention to detail.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-square bg-muted rounded-2xl animate-pulse border border-white/5" />
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No gallery items added yet.
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="relative aspect-square rounded-2xl overflow-hidden bg-muted group cursor-pointer shadow-lg hover:shadow-primary/20 border border-white/5 hover:border-primary/50 transition-all duration-300"
              onClick={() => setSelectedMedia({ url: item.url, type: item.type, cloudinaryId: item.cloudinaryId })}
            >
              {item.type === 'image' ? (
                <Image 
                  src={item.url} 
                  alt="Gallery image" 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                  <PlayCircle className="w-16 h-16 text-white/80 group-hover:scale-125 transition-transform duration-500" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))
        )}
      </div>

      <MediaLightbox 
        media={selectedMedia!} 
        isOpen={!!selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
      />
    </div>
  );
}
