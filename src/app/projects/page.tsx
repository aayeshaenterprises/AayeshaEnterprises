"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { MediaLightbox } from "@/components/ui/MediaLightbox";
import { PlayCircle } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type?: "image" | "video"; cloudinaryId?: string } | null>(null);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-heading font-bold mb-6">Our Projects</h1>
      <p className="text-muted-foreground text-lg max-w-3xl mb-16">
        Explore our portfolio of completed steel fabrication and welding projects.
      </p>
      
      <div className="space-y-24">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                <div className="aspect-video bg-muted rounded-xl" />
                <div className="aspect-video bg-muted rounded-xl" />
                <div className="aspect-video bg-muted rounded-xl" />
              </div>
            </div>
          ))
        ) : projects.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No projects added yet.
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="border-b border-border pb-24 last:border-0 last:pb-0">
              <h2 className="text-3xl font-bold font-heading mb-4 text-foreground">{project.heading || project.title || "Untitled Project"}</h2>
              {project.description && (
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-4xl">
                  {project.description}
                </p>
              )}
              
              {project.mediaFiles && project.mediaFiles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {project.mediaFiles.map((media: any, index: number) => {
                    const isVideo = media.url.includes(".mp4") || media.url.includes(".mov");
                    return (
                      <div 
                        key={index} 
                        className="relative aspect-video rounded-xl overflow-hidden bg-muted group cursor-pointer shadow-sm hover:shadow-xl transition-all"
                        onClick={() => setSelectedMedia({ url: media.url, type: isVideo ? "video" : "image", cloudinaryId: media.cloudinaryId })}
                      >
                        {isVideo ? (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900">
                            <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
                          </div>
                        ) : (
                          <Image 
                            src={media.url} 
                            alt={`${project.heading} media ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    );
                  })}
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
