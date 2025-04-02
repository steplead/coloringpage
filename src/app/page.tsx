import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { HomePage } from '@/components/HomePage';

export const metadata: Metadata = {
  title: 'AI Coloring Page Generator - Create Custom Coloring Pages',
  description: 'Create and print custom black outline coloring pages using AI. Generate unique coloring pages based on any description.',
  openGraph: {
    title: 'AI Coloring Page Generator',
    description: 'Create custom black outline coloring pages with AI',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Coloring Page Generator',
    description: 'Create custom black outline coloring pages with AI',
    images: ['/twitter-image.png'],
  },
};

export default function Home() {
  return <HomePage />;
} 