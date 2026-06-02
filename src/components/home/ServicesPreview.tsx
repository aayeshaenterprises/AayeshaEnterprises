"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Wrench, Shield, Home, Factory } from "lucide-react";

const services = [
  {
    icon: <Home className="w-8 h-8" />,
    title: "Residential Fabrication",
    description: "Custom gates, railings, staircases, and structural supports for homes.",
  },
  {
    icon: <Factory className="w-8 h-8" />,
    title: "Commercial & Industrial",
    description: "Heavy-duty steel structures, sheds, platforms, and safety barriers.",
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: "Custom Welding",
    description: "Precision TIG, MIG, and ARC welding for specialized custom projects.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Repair & Restoration",
    description: "Expert repair of damaged steel structures and rust treatment.",
  },
];

export function ServicesPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={sectionRef} className="py-24 bg-card relative overflow-hidden">
      {/* Background decoration */}
      <motion.div 
        style={{ y }} 
        className="absolute -right-64 top-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-primary font-medium tracking-wider uppercase text-sm mb-3">Our Expertise</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-bold mb-6">Comprehensive Steel Solutions</h3>
            <p className="text-muted-foreground text-lg">
              We combine traditional craftsmanship with modern technology to deliver steel structures that are both durable and aesthetically pleasing.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-background border border-border p-8 rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
              <h4 className="text-xl font-semibold mb-3 font-heading">{service.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
