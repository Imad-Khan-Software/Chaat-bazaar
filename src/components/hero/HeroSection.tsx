'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-neutral-950 py-16 px-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Authentic Pakistani Flavors</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-serif leading-tight">
          Bismillah, Fruit Chaat <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-red-500">
            Authentic Street Flavor
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto font-sans leading-relaxed">
          From crunchy papdi chaat drenched in sweet tamarind chutney to chilled, spiced golgappay. Freshly made in Pakistan.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#menu"
            className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-8 py-3.5 rounded-full flex items-center gap-2 transition shadow-lg"
          >
            Explore Menu <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}