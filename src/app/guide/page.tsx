import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Create Coloring Pages - User Guide',
  description: 'Learn how to create, download, and print custom coloring pages with our AI-powered generator.',
};

export default function GuidePage() {
  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
          How to Create Perfect Coloring Pages
        </h1>
        <p className="text-lg text-center text-gray-600 mb-12">
          A simple guide to creating, downloading, and printing beautiful coloring pages
        </p>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-12">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Creating Your Coloring Page</h2>
            
            <ol className="space-y-8 mb-8">
              <li>
                <h2 className="text-xl font-semibold mb-2">Describe What You Want to Color</h2>
                <div className="flex items-start">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full font-bold mr-3 flex-shrink-0">1</span>
                  <div>
                    <p className="mb-3">
                      Start by describing what you'd like to see in your coloring page. 
                      The more details you provide, the better the result will be!
                    </p>
                    <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-400">
                      <p className="font-medium text-gray-900 mb-1">Examples of good descriptions:</p>
                      <ul className="list-disc pl-5 text-gray-700 mb-2 space-y-1">
                        <li>"A friendly cartoon dinosaur playing in a park with trees and a playground"</li>
                        <li>"A detailed underwater scene with a dolphin, colorful fish, and coral reef"</li>
                        <li>"A cute space rocket flying through stars and planets"</li>
                        <li>"A princess castle on a hill with a rainbow in the sky"</li>
                      </ul>
                      <p className="text-sm text-gray-600 italic">The more specific you are, the better!</p>
                    </div>
                  </div>
                </div>
              </li>
            
            
              <li>
                <h2 className="text-xl font-semibold mb-2">Choose a Category and Complexity Level</h2>
                <div className="flex items-start">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full font-bold mr-3 flex-shrink-0">2</span>
                  <div>
                    <p className="mb-3">
                      Selecting a category helps the AI understand the type of image you want. 
                      The complexity level determines how intricate the final coloring page will be:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 mb-3">
                      <li><span className="font-medium">Simple:</span> Fewer details, larger areas to color, perfect for young children (ages 2-5)</li>
                      <li><span className="font-medium">Medium:</span> Balanced detail level, suitable for most ages (ages 6-12)</li>
                      <li><span className="font-medium">Complex:</span> More intricate details, better for older children and adults</li>
                      <li><span className="font-medium">Cartoon:</span> Fun, stylized designs with bold outlines</li>
                      <li><span className="font-medium">Realistic:</span> More true-to-life proportions and details</li>
                    </ul>
                    <div className="bg-amber-50 p-4 rounded-md border-l-4 border-amber-400">
                      <p className="text-sm font-medium text-gray-900">Age-Appropriate Tip:</p>
                      <p className="text-sm text-gray-700">For toddlers and preschoolers, always choose "Simple" to create pages with larger areas to color and fewer details. This makes coloring easier and more enjoyable for small hands.</p>
                    </div>
                  </div>
                </div>
              </li>
              
              <li>
                <h2 className="text-xl font-semibold mb-2">Generate Your Coloring Page</h2>
                <div className="flex items-start">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full font-bold mr-3 flex-shrink-0">3</span>
                  <div>
                    <p className="mb-2">
                      Click the "Create My Coloring Page" button and wait a few seconds for the AI to create your image. 
                      This usually takes 5-10 seconds depending on the complexity.
                    </p>
                    <p className="mb-3">
                      If you're not happy with the result, you can:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 mb-3">
                      <li>Try adding more details to your description</li>
                      <li>Change the complexity level</li>
                      <li>Try a different category</li>
                      <li>Click "Try Again" to generate a new version</li>
                    </ul>
                  </div>
                </div>
              </li>
              
              <li>
                <h2 className="text-xl font-semibold mb-2">Download or Print Your Creation</h2>
                <div className="flex items-start">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full font-bold mr-3 flex-shrink-0">4</span>
                  <div>
                    <p className="mb-3">
                      Once your coloring page appears, you have several options:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 mb-4">
                      <li><span className="font-medium">Download:</span> Save the image to your device to print later</li>
                      <li><span className="font-medium">Print:</span> Send directly to your printer for immediate coloring</li>
                      <li><span className="font-medium">Save to Collection:</span> Store your creation in your personal gallery</li>
                      <li><span className="font-medium">Create Another:</span> Make more coloring pages!</li>
                    </ul>
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                      <p className="font-medium text-blue-800 mb-2">Printing Tips:</p>
                      <ul className="list-disc pl-5 text-gray-700 mt-2 space-y-1">
                        <li>Use standard letter size paper (8.5 × 11 inches) or A4 paper</li>
                        <li>Select "Fit to page" in your printer settings</li>
                        <li>Choose "High Quality" print setting for clearer lines</li>
                        <li>For best results, use plain white paper that's suitable for your coloring medium (markers, colored pencils, crayons, etc.)</li>
                        <li>To save ink, look for a "Draft" or "Eco" mode in your printer settings</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            </ol>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Tips for the Best Coloring Pages</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-3">For Birthday Parties</h3>
                <p className="mb-2">
                  Create themed coloring pages for birthday parties with these ideas:
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>The birthday child's name incorporated into the design</li>
                  <li>Their age number as a decorative element</li>
                  <li>Their favorite characters or animals</li>
                  <li>Birthday cake, presents, and party decorations</li>
                  <li>Create multiple designs and make a coloring book!</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-3">For Classrooms</h3>
                <p className="mb-2">
                  Teachers can use these ideas for educational coloring pages:
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>Alphabet letters with corresponding objects</li>
                  <li>Number scenes with countable items</li>
                  <li>Simple labeled diagrams of plants, animals, or objects</li>
                  <li>Historical scenes or famous landmarks</li>
                  <li>Scenes from books you're reading in class</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-3">For Toddlers (Ages 2-4)</h3>
                <p className="mb-2">
                  Create toddler-friendly pages with these tips:
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>Always select "Simple" complexity level</li>
                  <li>Request "very thick lines" in your description</li>
                  <li>Choose familiar objects and animals</li>
                  <li>Add "with large simple shapes" to your description</li>
                  <li>Focus on single subjects rather than complex scenes</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-3">For Adults</h3>
                <p className="mb-2">
                  Create sophisticated coloring pages for adults:
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>Select "Complex" or "Realistic" complexity level</li>
                  <li>Try intricate patterns, mandalas, and geometric designs</li>
                  <li>Request "detailed" or "intricate" in your description</li>
                  <li>Create themed sets around specific interests</li>
                  <li>Try abstract designs and patterns for stress relief</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-8">
              <h3 className="text-lg font-medium text-purple-800 mb-3">Expert Mode (Advanced Users)</h3>
              <p className="mb-3">
                For users who want complete control, our Expert Mode allows you to write custom instructions directly to the AI:
              </p>
              <ul className="list-disc pl-5 text-gray-700 mb-4">
                <li>Toggle "Expert Mode" on the generator page</li>
                <li>Write detailed instructions including style, elements, composition, and more</li>
                <li>Always include "black outline coloring page" in your instructions</li>
                <li>Specify line thickness, detail level, and style explicitly</li>
              </ul>
              <p className="text-sm text-gray-600">
                Example: "A black outline coloring page of a fairy garden with mushroom houses, fairies, and woodland creatures. Bold, clean lines suitable for children. Whimsical cartoon style with moderate detail level."
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/create" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Create Your Coloring Page Now
          </Link>
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>
              Have more questions? Check out our <Link href="/faq/">FAQ</Link> or <Link href="/contact/">Contact Us</Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 