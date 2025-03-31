import { Metadata } from 'next';
import { ImageGenerator } from '@/components/ImageGenerator';

export const metadata: Metadata = {
  title: 'Create Coloring Pages - AI Coloring Page Generator',
  description: 'Create your own custom black outline coloring pages with our AI-powered generator',
  keywords: 'create coloring pages, custom coloring pages, AI generator, black outline',
};

export default function GeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Coloring Page</h1>
        <p className="text-gray-600 mb-8 text-center">
          Describe what you'd like to color, select complexity and category, and our AI will create a custom coloring page for you.
        </p>
        <ImageGenerator />
      </div>
    </div>
  );
} 