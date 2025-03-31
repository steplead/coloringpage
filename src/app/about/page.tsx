import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - AI Coloring Page Generator',
  description: 'Learn about our AI-powered coloring page generator and how it works',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            About Coloring AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our mission is to bring joy and creativity to everyone through AI-powered coloring pages.
          </p>
        </div>

        <div className="mb-16">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Coloring AI was born from a simple idea: everyone should have access to high-quality, customizable coloring pages regardless of their artistic ability.
                </p>
                <p>
                  Our team of developers and artists combined their expertise to create an innovative AI tool that transforms text descriptions into beautiful black outline drawings perfect for coloring.
                </p>
                <p>
                  Whether you're a parent looking for educational activities, a teacher preparing classroom materials, or an adult enjoying the therapeutic benefits of coloring, our tool makes it easy to generate exactly what you need.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800">How It Works</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our AI has been trained on thousands of illustrations and coloring pages to understand what makes a great coloring experience.
                </p>
                <p>
                  When you enter a description, our system analyzes your text and generates a black outline illustration specifically designed for coloring.
                </p>
                <p>
                  You can adjust complexity and style to match your preferences, then download and print your custom creation.
                </p>
              </div>
              <div className="mt-6">
                <Link 
                  href="/create" 
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  Try it yourself
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Benefits of Coloring</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Reduces stress and anxiety
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Improves focus and concentration
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Enhances fine motor skills in children
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Stimulates creativity and imagination
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Provides a screen-free activity
                </li>
                <li className="flex">
                  <svg className="flex-shrink-0 w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Offers a sense of accomplishment
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to create your own coloring pages?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Start generating custom coloring pages with our AI tool today!
            </p>
            <Link
              href="/create"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              Get Started
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 