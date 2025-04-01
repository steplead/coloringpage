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
  // Example coloring pages to showcase in hero section
  const examplePages = [
    {
      id: 1,
      title: 'Cartoon Elephant',
      image: '/examples/elephant.png',
    },
    {
      id: 2,
      title: 'Space Rocket',
      image: '/examples/rocket.png',
    },
    {
      id: 3,
      title: 'Friendly Dragon',
      image: '/examples/dragon.png',
    }
  ];

  // Creation methods to display
  const creationMethods = [
    {
      title: 'Describe It',
      description: 'Type what you want and our AI will create it',
      icon: '✏️',
      link: '/create',
    },
    {
      title: 'Choose a Style',
      description: 'Select from multiple artistic styles',
      icon: '🎨',
      link: '/create',
    },
    {
      title: 'Advanced Control',
      description: 'Fine-tune every aspect of your coloring page',
      icon: '⚙️',
      link: '/create',
    },
  ];

  // Testimonials
  const testimonials = [
    {
      text: "My kids love the coloring pages I create for them! So easy to use.",
      author: "Sarah T.",
    },
    {
      text: "I've been using this for my kindergarten class. The children are thrilled!",
      author: "Mark L., Teacher",
    },
    {
      text: "The advanced mode lets me create exactly what I need for my art therapy sessions.",
      author: "Dr. Jessica P.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Beautiful Coloring Pages with AI
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Turn your ideas into stunning coloring pages in seconds. Perfect for kids, teachers, and coloring enthusiasts.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/create" className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md">
                Create Now
              </Link>
              <a href="#how-it-works" className="px-8 py-3 bg-white text-blue-600 rounded-full font-medium border border-blue-200 hover:bg-blue-50 transition-colors">
                Learn More
              </a>
            </div>
            <div className="mt-4 text-gray-500">
              <span>Over 5,000 coloring pages created</span>
            </div>
          </div>

          {/* Example Coloring Pages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {examplePages.map((example) => (
              <div key={example.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-2 bg-gray-50">
                  <div className="bg-white border border-gray-100 rounded-lg overflow-hidden aspect-square relative">
                    <Image
                      src={example.image}
                      alt={example.title}
                      width={400}
                      height={400}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-gray-800">{example.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Create Coloring Pages Your Way
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creationMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{method.title}</h3>
                <p className="text-gray-600 mb-6">{method.description}</p>
                <Link href={method.link} className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full font-medium hover:bg-blue-200 transition-colors">
                  Try It
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Styles Preview */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
            Choose Your Style
          </h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Select from multiple artistic styles to create the perfect coloring page
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Simple', 'Medium', 'Complex', 'Cartoon', 'Realistic'].map((style, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-2">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">{['🐢', '🦁', '🐉', '🚀', '🏰'][index]}</span>
                  </div>
                </div>
                <div className="p-3 text-center border-t border-gray-100">
                  <h3 className="font-medium text-gray-800">{style}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md p-6 border border-gray-100">
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <p className="font-medium text-gray-800">- {testimonial.author}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/create" className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md inline-block">
              Start Creating Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-4 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our AI Coloring Page Generator?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🚀', title: 'Fast Generation', desc: 'Create coloring pages in seconds' },
              { icon: '🎨', title: 'Multiple Styles', desc: 'Choose from various artistic styles' },
              { icon: '📱', title: 'Works Everywhere', desc: 'Mobile, tablet, or desktop' },
              { icon: '🔄', title: 'Unlimited Pages', desc: 'Create as many as you need' },
              { icon: '🖨️', title: 'Print Ready', desc: 'Perfect for printing at any size' },
              { icon: '🎮', title: 'Easy to Use', desc: 'No design skills required' },
              { icon: '🔒', title: 'Private & Secure', desc: 'Your creations belong to you' },
              { icon: '✏️', title: 'Advanced Control', desc: 'Fine-tune every detail' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Coloring Pages?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Get started in seconds. No credit card required.
          </p>
          <Link href="/create" className="px-8 py-4 bg-white text-blue-600 rounded-full font-medium text-lg hover:bg-blue-50 transition-colors shadow-lg inline-block">
            Start Creating for Free
          </Link>
        </div>
      </section>
    </main>
  );
} 