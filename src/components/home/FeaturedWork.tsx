"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Maximize2 } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Industrial Storage Shed",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1581092334246-88022a15c381?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Modern Spiral Staircase",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Heavy Duty Security Gate",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1456108169123-149b18a3857e?q=80&w=1200&auto=format&fit=crop",
  },
];

export function FeaturedWork() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-primary font-medium tracking-wider uppercase text-sm mb-3">Our Portfolio</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-bold">Featured Projects</h3>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/projects"
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-500 z-10" />
              
              <Image 
                src={project.image} 
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                <div className="text-primary font-medium text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {project.category}
                </div>
                <h4 className="text-2xl font-bold text-white mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 font-heading">
                  {project.title}
                </h4>
                <Link 
                  href={`/projects/${project.id}`}
                  className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 hover:scale-110 hover:bg-accent"
                >
                  <Maximize2 className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
