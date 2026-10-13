'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserRound } from 'lucide-react';

export default function OwnerStory() {
  const [imageUnavailable, setImageUnavailable] = useState(false);

  return (
    <section
      id="our-story"
      className="py-20 px-4 sm:px-6 lg:px-8 border-y border-neutral-900 bg-neutral-900/20"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-3 rounded-3xl border border-amber-500/20 rotate-2" />
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-900 shadow-2xl shadow-amber-950/20">
            {!imageUnavailable ? (
              <Image
                src="/owner.jpeg"
                alt="The owner of Bismillah, Fruit Chaat"
                fill
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover object-center"
                onError={() => setImageUnavailable(true)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-500">
                <UserRound className="h-16 w-16 text-amber-500/70" aria-hidden="true" />
                <span className="text-sm">Owner photo coming soon</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Our Story
          </span>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            A little taste of home, made with heart.
          </h2>
          <p className="text-sm leading-relaxed text-neutral-300">
            At Bismillah, Fruit Chaat, every plate is prepared with care, fresh ingredients,
            and the bold, tangy flavors that make Pakistani street food unforgettable.
          </p>
          <p className="text-sm leading-relaxed text-neutral-400">
            Our owner brings a personal touch to every order, sharing a love of traditional
            chaat and warm hospitality with our community.
          </p>
          <p className="border-l-2 border-amber-500 pl-4 font-serif text-sm italic text-amber-300">
            Freshly prepared. Generously served. Always full of flavor.
          </p>
        </div>
      </div>
    </section>
  );
}