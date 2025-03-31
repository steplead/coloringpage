import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Use Our Coloring Page Generator | Step by Step Guide',
  description: 'Learn how to create, customize and print your own black outline coloring pages using our free AI generator. Step by step instructions for beginners.',
  keywords: 'coloring page guide, how to create coloring pages, free coloring generator tutorial, printing coloring pages',
};

export default function GuidePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-4xl w-full">
        <div className="flex items-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mr-3">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold">How to Use Our Coloring Page Generator</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="mb-6">
            Creating your own custom coloring pages is easy with our AI-powered generator. 
            Follow this simple guide to get started and make the most of our tool.
          </p>
          
          <ol className="list-decimal pl-6 space-y-6">
            <li>
              <h2 className="text-xl font-semibold mb-2">Start with a Clear Description</h2>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-3">
                <p className="font-medium">Example descriptions:</p>
                <ul className="list-disc pl-5 text-gray-700 mt-2 space-y-1">
                  <li>"A friendly elephant wearing a party hat"</li>
                  <li>"A magical castle with towers and a dragon flying above it"</li>
                  <li>"A bouquet of sunflowers in a vase"</li>
                  <li>"A spaceship traveling between planets"</li>
                </ul>
              </div>
              <p>
                The more specific your description, the better the results. Think about the main subject, 
                any specific features or details, and the overall scene or composition.
              </p>
            </li>
            
            <li>
              <h2 className="text-xl font-semibold mb-2">Choose a Category and Detail Level</h2>
              <p className="mb-3">
                Selecting a category helps the AI understand the type of image you want. 
                The detail level determines how intricate the final coloring page will be:
              </p>
              <ul className="list-disc pl-5 text-gray-700 mb-3">
                <li><span className="font-medium">Simple:</span> Fewer details, larger areas to color, perfect for young children (ages 2-5)</li>
                <li><span className="font-medium">Medium:</span> Balanced detail level, suitable for most ages (ages 6-12)</li>
                <li><span className="font-medium">Complex:</span> More intricate details, better for older children and adults</li>
              </ul>
            </li>
            
            <li>
              <h2 className="text-xl font-semibold mb-2">Review Tips for Better Results</h2>
              <p>
                Based on your selected category, the generator will offer specific tips to improve your results. 
                These suggestions can help you get cleaner outlines and more coloring-friendly images.
              </p>
            </li>
            
            <li>
              <h2 className="text-xl font-semibold mb-2">Generate Your Coloring Page</h2>
              <p>
                Click the "Generate Coloring Page" button and wait a few seconds for the AI to create your image. 
                This usually takes 5-10 seconds depending on the complexity.
              </p>
            </li>
            
            <li>
              <h2 className="text-xl font-semibold mb-2">Download Your Creation</h2>
              <p className="mb-3">
                Once your coloring page appears, click the "Download" button to save it to your device. 
                The image will be saved in PNG format, which is perfect for printing.
              </p>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <p className="font-medium text-blue-800">Printing Tips:</p>
                <ul className="list-disc pl-5 text-gray-700 mt-2 space-y-1">
                  <li>Use standard letter size paper (8.5 × 11 inches) or A4 paper</li>
                  <li>Select "Fit to page" in your printer settings</li>
                  <li>Choose "High Quality" print setting for clearer lines</li>
                  <li>For best results, use plain white paper that's suitable for your coloring medium (markers, colored pencils, crayons, etc.)</li>
                </ul>
              </div>
            </li>
            
            <li>
              <h2 className="text-xl font-semibold mb-2">Create Multiple Variations</h2>
              <p>
                Don't hesitate to generate multiple versions with slight variations in your description. 
                Each generation will be unique, giving you different options to choose from.
              </p>
            </li>
            
            <li>
              <h2 className="text-xl font-semibold mb-2">Browse Your Creation History</h2>
              <p>
                Your recent creations are saved in the "Your Recent Creations" section. 
                You can download any of these again if needed, or use them as inspiration for new prompts.
              </p>
            </li>
          </ol>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Advanced Tips</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Crafting Better Prompts</h3>
              <p className="mb-2">To get more specific results, try including these details in your prompts:</p>
              <ul className="list-disc pl-5 text-gray-700">
                <li><span className="font-medium">Style references:</span> "in the style of a coloring book" or "simple line drawing"</li>
                <li><span className="font-medium">Age appropriateness:</span> "suitable for 5-year-olds" or "for teenagers"</li>
                <li><span className="font-medium">Composition:</span> "centered composition" or "side view"</li>
                <li><span className="font-medium">Line quality:</span> "thick outlines" or "clean lines"</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Creating Themed Collections</h3>
              <p>
                Generate a series of related coloring pages for a complete themed collection. 
                For example, create a set of different dinosaurs, sea creatures, or seasonal images.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Educational Coloring Pages</h3>
              <p>
                Create educational coloring pages by including learning elements in your prompts, such as:
              </p>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Alphabet letters with corresponding objects (e.g., "letter A with apple")</li>
                <li>Numbers with counting objects</li>
                <li>Simple labeled diagrams of plants, animals, or objects</li>
                <li>Scenes from history or famous landmarks</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/generator" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Create Your Coloring Page Now
          </Link>
        </div>
      </div>
    </main>
  );
} 