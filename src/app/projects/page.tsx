"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      <p className="text-muted-foreground text-lg max-w-3xl mb-12">
        Explore our portfolio of completed steel fabrication and welding projects.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-video bg-muted rounded-xl animate-pulse" />
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No projects added yet.
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="group cursor-pointer">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted mb-4">
                {project.mediaFiles && project.mediaFiles.length > 0 ? (
                  <Image 
                    src={project.mediaFiles[0].url} 
                    alt={project.title} 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white opacity-50">
                    No Image
                  </div>
                )}
                {project.mediaFiles && project.mediaFiles.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                    +{project.mediaFiles.length - 1} More
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold font-heading mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-muted-foreground line-clamp-2">{project.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
