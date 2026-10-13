'use client';

import React, { useState } from 'react';
import { RotateCw, Flame, Clock, Zap, Plus } from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  prepTime?: string;
  kcal?: number;
  serves?: number;
  image?: string;
  isAvailable?: boolean;
  ingredients?: string[];
}

interface FlipCardProps {
  item: MenuItemData;
}

export default function FlipCard({ item }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Extra'>('Medium');
  const { addToCart, toggleCart } = useCartStore();

  const fallbackImage =
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: `${item.id}-${spiceLevel}`,
      name: item.name,
      price: item.price,
      spiceLevel,
      quantity: 1,
    });
    toggleCart();
  };

  return (
    <div className="group h-[420px] [perspective:1000px] select-none">
      <div
        className={`relative w-full h-full duration-500 [transform-style:preserve-3d] transition-transform ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* FRONT SIDE */}
        <div
          onClick={() => setIsFlipped(true)}
          className="absolute inset-0 w-full h-full bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex flex-col justify-between [backface-visibility:hidden] shadow-xl hover:border-amber-500/40 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
              {item.category || 'Chaat'}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition">
              Customize <RotateCw className="w-3 h-3 text-amber-500" />
            </span>
          </div>

          <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800/80 my-2">
            <img
              src={item.image && item.image.trim() !== '' ? item.image : fallbackImage}
              alt={item.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-serif font-bold text-lg text-white leading-tight drop-shadow-md">
                {item.name}
              </h3>
              <p className="text-[10px] text-amber-300/90 mt-0.5">Tap card to customize spices</p>
            </div>
          </div>

          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="pt-3 border-t border-neutral-800/80">
            <div className="flex items-center gap-3 text-[11px] text-neutral-400 mb-2">
              <span className="flex items-center gap-1 text-amber-400">
                <Clock className="w-3 h-3" /> {item.prepTime || '10-15 mins'}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" /> {item.kcal || 250} kcal
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 block">Price</span>
                <span className="text-base font-bold text-emerald-400">Rs. {item.price}</span>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          onClick={() => setIsFlipped(false)}
          className="absolute inset-0 w-full h-full bg-neutral-900 border border-amber-500/30 rounded-3xl p-5 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl cursor-pointer"
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <h4 className="font-serif font-bold text-base text-white">{item.name}</h4>
              <span className="text-[10px] text-neutral-400">Customize spice level</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <RotateCw className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          <div className="space-y-2 py-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Spice Level
            </span>
            <div className="grid grid-cols-3 gap-1.5 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
              {(['Mild', 'Medium', 'Extra'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSpiceLevel(level)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    spiceLevel === level
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-neutral-400 block">Ingredients:</span>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {item.ingredients && item.ingredients.length > 0 ? (
                item.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="bg-neutral-800/80 border border-neutral-700/60 text-neutral-300 text-[10px] px-2 py-0.5 rounded-md"
                  >
                    {ing}
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-neutral-500 italic">Fresh traditional spices</span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
            >
              <Plus className="w-4 h-4" /> Add to Order (Rs. {item.price})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}