'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';

export default function Navbar() {
  const { cart, toggleCart } = useCartStore();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/owner.jpeg"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border border-amber-500/40 object-cover object-center"
          />
          <div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-serif">
              Bismillah, <span className="text-amber-500">Fruit Chaat</span>
            </span>
            <span className="block text-[10px] text-amber-400 font-medium tracking-widest uppercase">
              Street Food
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <a href="#hero" className="hover:text-amber-400 transition">Home</a>
          <a href="#menu" className="hover:text-amber-400 transition">Menu</a>
        </nav>

        <button
          onClick={toggleCart}
          className="relative bg-amber-500 hover:bg-amber-600 text-neutral-950 px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart</span>
          {totalItems > 0 && (
            <span className="bg-neutral-950 text-amber-400 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}