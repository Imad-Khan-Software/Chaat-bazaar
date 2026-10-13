'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

export default function PlacePhoto() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const loadPhoto = async () => {
      try {
        const response = await fetch('/api/store-settings', { cache: 'no-store' });
        if (!response.ok) throw new Error('Place photo could not be loaded.');
        const settings: { placePhotoUrl: string | null } = await response.json();
        if (active) setPhotoUrl(settings.placePhotoUrl);
      } catch (error) {
        if (active) {
          setPhotoUrl(null);
          setLoadError(error instanceof Error ? error.message : 'Place photo is unavailable.');
        }
      } finally {
        if (active) setHasLoaded(true);
      }
    };
    void loadPhoto();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="our-place" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Visit Us</span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-white">A peek at our place</h2>
        </div>
        <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-xl sm:min-h-96">
          {photoUrl && !imageUnavailable ? (
            <Image
              src={photoUrl}
              alt="Bismillah, Fruit Chaat shop"
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              onError={() => setImageUnavailable(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center text-neutral-500">
              <Camera className="h-10 w-10 text-amber-500/70" aria-hidden="true" />
              <p className="text-sm">
                {!hasLoaded
                  ? 'Loading our place photo…'
                  : loadError || (imageUnavailable ? 'The place photo could not be displayed.' : 'Our place photo will be added soon.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
