"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PhoneCall, Mail } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-24 bg-primary overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      {/* Decorative sparks */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5] 
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-10 left-10 w-32 h-32 bg-accent/30 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3] 
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-10 right-10 w-48 h-48 bg-white/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-primary-foreground/90 text-lg md:text-xl mb-10">
            Contact us today for a free consultation and quote. Let's turn your ideas into strong, durable reality.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Get a Free Quote
            </Link>
            
            <a 
              href="tel:+919876543210"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              Call +91 98765 43210
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
