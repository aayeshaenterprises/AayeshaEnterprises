"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { submitContactForm } from "@/lib/firestore";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    const result = await submitContactForm(formData);
    if (result.success) {
      setStatus("success");
      setFormData({ name: "", phone: "", message: "" });
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-heading font-bold mb-6 text-center">Contact Us</h1>
      <p className="text-muted-foreground text-lg max-w-3xl mx-auto text-center mb-16">
        Have a project in mind? Get in touch with us for a free consultation and quote.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold font-heading mb-6">Our Contact Details</h2>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-4 rounded-full text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Workshop Address</h3>
              <p className="text-muted-foreground">123 Industrial Area, Phase 1<br/>City Name, State 123456</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-4 rounded-full text-primary">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Phone</h3>
              <p className="text-muted-foreground">+91 98765 43210</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-4 rounded-full text-primary">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="text-muted-foreground">info@aayeshaenterprises.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-card border border-border p-8 rounded-2xl">
          <h2 className="text-2xl font-bold font-heading mb-6">Send us a message</h2>
          {status === "success" ? (
            <div className="p-4 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20 text-center">
              Thank you! Your message has been sent successfully. We will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  placeholder="+91 98765 43210" 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message / Requirements</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  placeholder="Tell us about your project..."
                />
              </div>
              
              {status === "error" && (
                <div className="text-red-500 text-sm">Failed to send message. Please try again.</div>
              )}
              
              <button 
                type="submit" 
                disabled={status === "submitting"}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-lg px-4 py-3 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {status === "submitting" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
