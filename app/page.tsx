import { Suspense } from 'react';
import Navbar from '../src/components/layout/Navbar';
import HeroSection from '../src/components/hero/HeroSection';
import FlipCard from '../src/components/menu/FlipCard';
import OrderTray from '../src/components/cart/OrderTray';
import OwnerStory from '../src/components/story/OwnerStory';
import ReviewsSection from '../src/components/reviews/ReviewsSection';
import InquirySection from '../src/components/inquiry/InquirySection';
import PlacePhoto from '../src/components/story/PlacePhoto';
import Footer from '../src/components/layout/Footer';
import { supabase } from '../src/lib/supabase';
import { Sparkles, Utensils } from 'lucide-react';
import Link from 'next/link';

async function MenuList() {
  const { data: menuItems, error } = await supabase
    .from('MenuItem')
    .select('*')
    .eq('isAvailable', true)
    .order('name', { ascending: true });

  if (error || !menuItems || menuItems.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-neutral-900/40 rounded-3xl border border-neutral-800 max-w-lg mx-auto shadow-xl">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-bold text-xl text-white mb-2">
          Menu Coming Soon
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed mb-6">
          Our kitchen is preparing fresh batches. Head over to the admin dashboard to add dishes, or reach out to us directly on WhatsApp!
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-5 py-2.5 rounded-xl text-xs transition"
        >
          <Sparkles className="w-4 h-4" /> Go to Admin Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {menuItems.map((item) => (
        <FlipCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function MenuLoadingFallback() {
  return (
    <div className="text-center py-16 text-neutral-500 text-xs">
      Loading fresh menu items...
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-amber-500 selection:text-neutral-950">
      <Navbar />
      <HeroSection />

      {/* 1. Menu Section */}
      <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
            Fresh & Tangy
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-1">
            Our Interactive Menu
          </h2>
        </div>

        <Suspense fallback={<MenuLoadingFallback />}>
          <MenuList />
        </Suspense>
      </section>

      {/* 2. Story Section */}
      <OwnerStory />

      {/* 3. Public photo of the shop */}
      <PlacePhoto />

      {/* 4. Customer Reviews Section */}
      <ReviewsSection />

      {/* 5. Inquiry / Contact Section */}
      <InquirySection />

      {/* Slide-out Order Drawer */}
      <OrderTray />

      {/* Footer is rendered once, as the final page section. */}
      <Footer />
    </div>
  );
}