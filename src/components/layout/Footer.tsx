'use client';

import React from 'react';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-neutral-900">
        
        {/* Brand */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-2xl text-white">Bismillah, Fruit Chaat</h3>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            Serving fresh, authentic, and hygienic Pakistani street delicacies.
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Contact & Inquiries</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="https://wa.me/923196790442"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500" /> +92 319 6790442
              </a>
            </li>
            <li>
              <a
                href="mailto:anwarkhann5074@gmail.com"
                className="flex items-center gap-2 hover:text-amber-400 transition"
              >
                <Mail className="w-3.5 h-3.5 text-amber-500" /> anwarkhann5074@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Visit Us</h4>
          <a
            href="https://maps.app.goo.gl/uuFb6zCxt3HypATS8?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 hover:text-amber-400 transition text-xs"
          >
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Click here to open our exact location on Google Maps</span>
          </a>
        </div>
      </div>

      {/* Centered Copyright & Back to Top */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col items-center justify-center gap-4 text-xs text-neutral-500 relative">
        <p className="text-center">
          © 2026 All rights reserved / © Designed with ♥ by M.BilalAbbasi
        </p>

        <button
          onClick={scrollToTop}
          className="sm:absolute sm:right-0 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md"
        >
          Back to Top <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}