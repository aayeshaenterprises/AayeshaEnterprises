"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Welding sparks particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.life = Math.random() * 100;
        
        const colors = ["#f97316", "#f59e0b", "#fbbf24", "#ef4444"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1;
        this.speedY += 0.05; // gravity
        
        if (this.size > 0.2) this.size -= 0.05;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const createParticles = () => {
      if (particles.length < 100) {
        particles.push(new Particle());
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      createParticles();

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      requestAnimationFrame(animateParticles);
    };

    animateParticles();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // GSAP Text Reveal
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
      );
    }
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-20"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop")' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      
      {/* Sparks Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-70 mix-blend-screen pointer-events-none" />

      <div className="container relative z-20 mx-auto px-4 text-center">
        <div ref={textRef} className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-primary font-medium tracking-wider uppercase text-sm md:text-base">
            Premium Quality, Unmatched Durability
          </h2>
          
          <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight">
            Shaping Steel into <br />
            <span className="text-gradient">Masterpieces</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Aayesha Enterprises delivers top-tier steel fabrication, welding, and custom structures tailored to your exact specifications.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/projects"
              className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full overflow-hidden shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10">Explore Our Work</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/contact"
              className="px-8 py-4 bg-card text-foreground font-semibold rounded-full border border-border hover:border-primary/50 transition-all hover:bg-muted"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
