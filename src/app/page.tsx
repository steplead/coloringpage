import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { headers } from 'next/headers';
import TranslatedText from '@/components/TranslatedText';
import { redirect } from 'next/navigation';

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
  // 直接重定向到默认语言路径
  // 注意：实际重定向会由中间件处理，但我们这里添加第二层保护
  redirect('/en');
  return null;
} 