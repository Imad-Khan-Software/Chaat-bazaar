'use client';

import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Send,
  MapPin,
  User,
  Phone,
  ShoppingCart,
} from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';

export default function OrderTray() {
  const {
    cart: items,
    isOpen,
    toggleCart,
    updateQuantity,
    removeFromCart: removeItem,
    clearCart,
  } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setFormError('Please fill in your name, contact phone, and delivery address.');
      return;
    }

    setFormError('');

    // Business WhatsApp contact
    const storeWhatsAppNumber = '923196790442';

    // Format individual cart lines
    const itemLines = items
      .map(
        (item) =>
          `• ${item.name} (x${item.quantity}) - Rs. ${item.price * item.quantity}${
            item.spiceLevel ? ` [${item.spiceLevel} Spice]` : ''
          }`
      )
      .join('\n');

    // Build WhatsApp message
    const orderMessage = 
`*--- NEW ORDER: BISMILLAH CHAAT BAZAAR ---*

*Customer Details:*
👤 *Name:* ${name.trim()}
📞 *Phone:* ${phone.trim()}
📍 *Address:* ${address.trim()}

*Order Details:*
${itemLines}

-----------------------------
*Subtotal:* Rs. ${subtotal}
*Delivery Charges:* (To be calculated & confirmed by owner)
-----------------------------

_Please confirm my order and share the final total._`;

    const encodedMessage = encodeURIComponent(orderMessage);
    const whatsappUrl = `https://wa.me/${storeWhatsAppNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-500" /> Your Order Tray
            </h2>
            <button
              onClick={toggleCart}
              className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition"
              aria-label="Close Tray"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 text-neutral-500 space-y-2">
                <p className="text-sm">Your order tray is empty.</p>
                <p className="text-xs text-neutral-600">Select dishes from the menu to start ordering.</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                    {item.spiceLevel && (
                      <p className="text-[11px] text-amber-400">{item.spiceLevel} Spice</p>
                    )}
                    <p className="text-xs font-semibold text-emerald-400 mt-1">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:text-amber-400 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-white px-1.5">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:text-amber-400 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Form and Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-950/90 space-y-4">
              <form onSubmit={handleWhatsAppCheckout} className="space-y-3">
                {formError && (
                  <div className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                    {formError}
                  </div>
                )}

                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g. 03xx xxxxxxx)"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Delivery Location / Street Address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Subtotal & Delivery Details */}
                <div className="pt-2 border-t border-neutral-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Delivery Charges (owner-set)</span>
                    <span className="text-amber-400 text-[11px] font-medium">Calculated on WhatsApp</span>
                  </div>
                  <p className="text-[10px] text-neutral-500">
                    Final delivery charge is confirmed by the owner based on your location.
                  </p>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                    <span>Estimated Total</span>
                    <span className="text-emerald-400">Rs. {subtotal} + delivery</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="w-1/3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-3 rounded-xl text-xs transition"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Order via WhatsApp
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}