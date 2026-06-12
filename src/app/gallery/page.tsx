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
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No media uploaded yet.
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="relative aspect-square rounded-xl overflow-hidden bg-muted group cursor-pointer shadow-sm hover:shadow-xl transition-all"
              onClick={() => setSelectedMedia({ url: item.url, type: item.type, cloudinaryId: item.cloudinaryId })}
            >
              {item.type === 'image' ? (
                <Image 
                  src={item.url} 
                  alt="Gallery Item" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized // Bypassing next/image domains restriction since it's cloudinary
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white">
                  <PlayCircle className="w-16 h-16 opacity-80" />
                  <span className="mt-2 text-sm font-medium opacity-80">Video</span>
                </div>
              )}
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
