import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';

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
  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-blue-50 to-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            AI Coloring Page Generator
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-600">
            Create custom black outline coloring pages from any description using AI. Perfect for kids, art therapy, and creative fun.
          </p>
          <Link href="/create" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-300">
            Create Your Coloring Page
          </Link>
        </div>
      </section>

      {/* Example Coloring Pages */}
      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Example Coloring Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample items would be dynamically loaded here */}
            <div className="rounded-lg overflow-hidden shadow-md bg-gray-50 transition-transform hover:scale-105">
              <div className="aspect-square relative bg-white p-4">
                <div className="w-full h-full flex items-center justify-center border border-gray-200 rounded-lg">
                  <h3 className="text-lg text-gray-500 font-medium">Magic Castle</h3>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">Magic Castle</h3>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md bg-gray-50 transition-transform hover:scale-105">
              <div className="aspect-square relative bg-white p-4">
                <div className="w-full h-full flex items-center justify-center border border-gray-200 rounded-lg">
                  <h3 className="text-lg text-gray-500 font-medium">Friendly Dragon</h3>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">Friendly Dragon</h3>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-md bg-gray-50 transition-transform hover:scale-105">
              <div className="aspect-square relative bg-white p-4">
                <div className="w-full h-full flex items-center justify-center border border-gray-200 rounded-lg">
                  <h3 className="text-lg text-gray-500 font-medium">Underwater Adventure</h3>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">Underwater Adventure</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Describe Your Image</h3>
              <p className="text-gray-600">Enter a description of what you want your coloring page to look like.</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">AI Generation</h3>
              <p className="text-gray-600">Our AI creates a custom black outline drawing based on your description.</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Print & Color</h3>
              <p className="text-gray-600">Download your coloring page, print it out, and start coloring!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Features</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Unlimited Creativity</h3>
              <p className="text-gray-600">Generate any kind of coloring page you can imagine, from animals to fantasy worlds.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Print-Ready PDF</h3>
              <p className="text-gray-600">Download your coloring pages as high-quality PDFs ready for printing.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Child-Friendly</h3>
              <p className="text-gray-600">All generated content is appropriate for children of all ages.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Customizable</h3>
              <p className="text-gray-600">Adjust settings like line thickness and detail level to suit your preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start making your own custom coloring pages today!
          </p>
          <Link href="/create" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg text-lg transition-colors duration-300">
            Create Your Coloring Page
          </Link>
        </div>
      </section>
    </>
  );
} 