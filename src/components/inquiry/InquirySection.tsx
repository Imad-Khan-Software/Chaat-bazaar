'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function InquirySection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In-place confirmation without intrusive browser alert popups
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Info Side */}
          <div className="space-y-6">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Catering, Events & Special Orders
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Hosting a gathering, wedding, or party? Let us handle the street food stalls with fresh live preparation and dedicated service.
            </p>

            <div className="space-y-4 pt-4">
              <a
                href="https://wa.me/923196790442"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-neutral-300 hover:border-emerald-500/40 hover:text-white transition group"
              >
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-neutral-950 transition">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500">Call / WhatsApp</div>
                  <div className="text-xs font-bold text-white">+92 319 6790442</div>
                </div>
              </a>

              <a
                href="mailto:anwarkhann5074@gmail.com"
                className="flex items-center gap-3 p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-neutral-300 hover:border-amber-500/40 hover:text-white transition group"
              >
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-neutral-950 transition">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500">Email Address</div>
                  <div className="text-xs font-bold text-white">anwarkhann5074@gmail.com</div>
                </div>
              </a>

              <a
                href="https://maps.app.goo.gl/uuFb6zCxt3HypATS8?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-neutral-300 hover:border-amber-500/40 hover:text-white transition group"
              >
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-neutral-950 transition">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500">Our Location</div>
                  <div className="text-xs font-bold text-white">Open in Google Maps</div>
                </div>
              </a>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-neutral-950/80 border border-neutral-800 p-6 sm:p-8 rounded-3xl relative">
            <h3 className="font-serif font-bold text-lg text-white mb-2">Send an Inquiry</h3>
            <p className="text-neutral-400 text-xs mb-6">
              Fill out the details below and we will get back to you promptly.
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white font-serif">Message Received!</h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Thank you for reaching out. We will respond shortly via phone or email.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-amber-400 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Your Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Tariq Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Email</label>
                    <input
                      required
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="03xx xxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Message / Event Details</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the event date, number of guests, or dish requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg mt-2"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}