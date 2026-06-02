"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    company: "BuildTech Constructions",
    text: "Aayesha Enterprises delivered our warehouse structure ahead of schedule. The quality of welding and structural integrity is outstanding.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sunita Sharma",
    company: "Homeowner",
    text: "They designed and installed a beautiful custom staircase for my home. The finish is premium and the team was highly professional.",
    rating: 5,
  },
  {
    id: 3,
    name: "Vikram Singh",
    company: "Industrial Solutions",
    text: "Our go-to partner for all heavy-duty fabrication needs. Reliable, cost-effective, and excellent craftsmanship.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-card border-y border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-primary font-medium tracking-wider uppercase text-sm mb-3">Testimonials</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-bold">What Our Clients Say</h3>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background border border-border p-8 rounded-2xl relative"
            >
              <Quote className="w-12 h-12 text-primary/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-6 text-accent">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>
              <div>
                <div className="font-bold font-heading">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
