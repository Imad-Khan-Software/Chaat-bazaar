import type { Metadata } from 'next';
import CartHydrator from '@/src/components/cart/CartContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bismillah, Fruit Chaat | Authentic Pakistani Street Food',
  description:
    'Enjoy fresh Pakistani street food, tangy chaats, dahi bhallay, and gol gappay at Bismillah, Fruit Chaat.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body>
        <CartHydrator />
        {children}
      </body>
    </html>
  );
}