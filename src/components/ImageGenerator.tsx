'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/context';
import { getTranslations, getTranslationSync } from '@/lib/i18n/translations';
import { ArrowDownTrayIcon, LightBulbIcon, ArrowPathIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/20/solid'; // For Generate button

// Style options with visual examples
const STYLE_OPTIONS = [
  { id: 'simple', labelKey: 'create.styleOptions.simple', descriptionKey: 'create.styleOptions.simple.desc', icon: '/icons/style-simple.svg' },
  { id: 'medium', labelKey: 'create.styleOptions.medium', descriptionKey: 'create.styleOptions.medium.desc', icon: '/icons/style-medium.svg' },
  { id: 'complex', labelKey: 'create.styleOptions.complex', descriptionKey: 'create.styleOptions.complex.desc', icon: '/icons/style-complex.svg' },
  { id: 'cartoon', labelKey: 'create.styleOptions.cartoon', descriptionKey: 'create.styleOptions.cartoon.desc', icon: '/icons/style-cartoon.svg' },
  { id: 'realistic', labelKey: 'create.styleOptions.realistic', descriptionKey: 'create.styleOptions.realistic.desc', icon: '/icons/style-realistic.svg' },
];

// Prompt suggestion categories
const CATEGORIES = [
  { 
    nameKey: 'create.categories.animals',
    examples: ['Cute cat', 'Dolphin', 'Lion', 'Elephant', 'Butterfly', 'Dinosaur', 'Owl', 'Turtle'],
    icon: '🐾'
  },
  { 
    nameKey: 'create.categories.nature',
    examples: ['Tree', 'Flower', 'Mountain landscape', 'Beach scene', 'Forest', 'Garden', 'Waterfall'],
    icon: '🌿'
  },
  { 
    nameKey: 'create.categories.fantasy',
    examples: ['Dragon', 'Unicorn', 'Fairy', 'Castle', 'Wizard', 'Mermaid', 'Superhero'],
    icon: '✨'
  },
  { 
    nameKey: 'create.categories.vehicles',
    examples: ['Car', 'Rocket ship', 'Train', 'Airplane', 'Submarine', 'Tractor', 'Helicopter'],
    icon: '🚗'
  },
  { 
    nameKey: 'create.categories.holidays',
    examples: ['Christmas tree', 'Halloween pumpkin', 'Easter bunny', 'Valentine heart', 'Birthday cake'],
    icon: '🎄'
  },
  { 
    nameKey: 'create.categories.patterns',
    examples: ['Mandala', 'Geometric pattern', 'Floral design', 'Kaleidoscope', 'Abstract shapes'],
    icon: '🔄'
  }
];

// Base prompt that defines a coloring page
const BASE_PROMPT = 'black outline coloring page, clean lines, white background';

const MAX_RETRIES = 3;

export const ImageGenerator = () => {
  const { locale: lang } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);
  const [style, setStyle] = useState<string>('medium');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState<string>('');
  const [generationHistory, setGenerationHistory] = useState<{prompt: string, imageUrl: string, id: string}[]>([]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(BASE_PROMPT);
  const [translations, setTranslations] = useState<any>(null);
  const [loadingTranslations, setLoadingTranslations] = useState(true);
  
  // Load generation history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('generationHistory');
    if (savedHistory) {
      try {
        setGenerationHistory(JSON.parse(savedHistory));
      } catch /* removed unused e */ {
        console.error('Failed to parse generation history');
      }
    }
  }, []);

  // Save generation history to localStorage
  useEffect(() => {
    if (generationHistory.length > 0) {
      localStorage.setItem('generationHistory', JSON.stringify(generationHistory));
    }
  }, [generationHistory]);

  // Update suggestions when category changes
  useEffect(() => {
    if (selectedCategoryKey) {
      const category = CATEGORIES.find(cat => cat.nameKey === selectedCategoryKey);
      if (category) {
        setSuggestions(category.examples);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }, [selectedCategoryKey]);

  // Reset custom prompt when toggling advanced mode
  useEffect(() => {
    if (isAdvancedMode) {
      setCustomPrompt(`${prompt ? prompt + ', ' : ''}${BASE_PROMPT}`);
    }
  }, [isAdvancedMode, prompt]);

  // Fetch translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      if (!lang) return;
      setLoadingTranslations(true);
      try {
        setTranslations(await getTranslations(lang));
      } catch (err) { console.error("Failed to load translations:", err); } 
      finally { setLoadingTranslations(false); }
    };
    loadTranslations();
  }, [lang]);

  // Safe translation helper
  const t = useCallback((key: string, fallback?: string): string => {
    if (loadingTranslations || !translations) {
      return fallback || key.split('.').pop() || key;
    }
    return getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  }, [translations, loadingTranslations]);

  const handleSelectCategory = useCallback((categoryKey: string) => {
    setSelectedCategoryKey(selectedCategoryKey === categoryKey ? null : categoryKey);
  }, [selectedCategoryKey]);

  const handleSelectSuggestion = useCallback((suggestion: string) => {
    setPrompt(suggestion);
  }, []);

  const handleStyleChange = useCallback((selectedStyle: string) => {
    setStyle(selectedStyle);
  }, []);

  const toggleAdvancedMode = useCallback(() => {
    setIsAdvancedMode(prev => !prev);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdvancedMode && !prompt.trim()) {
      setError(t('create.errors.promptRequired', 'Please describe the image you want.'));
      return;
    }
    if (isAdvancedMode && !customPrompt.trim()) {
      setError(t('create.errors.customPromptRequired', 'Please enter a custom generation prompt.'));
      return;
    }
    setLoading(true);
    setError(null);
    setImage(null);
    const currentPrompt = isAdvancedMode ? customPrompt : prompt;
    setLastGeneratedPrompt(currentPrompt);
    
    let retryCount = 0;
    let success = false;
    let finalImageUrl = null;
    let generationId = Date.now().toString();
    
    while (retryCount < MAX_RETRIES && !success) {
      try {
        if (retryCount > 0) console.log(`Retry attempt ${retryCount}...`);
        
        const categoryName = selectedCategoryKey ? selectedCategoryKey.split('.').pop() : 'general';

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            description: prompt,
            style: style,
            isAdvancedMode: isAdvancedMode,
            customPrompt: customPrompt,
            category: categoryName
          }),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `API error: ${response.status}`);
        if (!data.imageUrl) throw new Error('Failed to get image URL from server');
        
        finalImageUrl = data.imageUrl;
        generationId = data.id || generationId;
        success = true;
      } catch (err) {
        console.error(`Error in generation attempt ${retryCount + 1}:`, err);
        if (retryCount === MAX_RETRIES - 1) {
          setError(err instanceof Error ? err.message : 'Failed to generate image after retries');
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          retryCount++;
        }
      }
    }
    
    if (success && finalImageUrl) {
      setImage(finalImageUrl);
      setGenerationHistory(prev => [{ prompt: currentPrompt, imageUrl: finalImageUrl, id: generationId }, ...prev].slice(0, 10));
    }
    setLoading(false);
  }, [prompt, isAdvancedMode, customPrompt, style, selectedCategoryKey, t]);
  
  const handleDownload = useCallback(() => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = `coloring-page-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [image]);

  // Initial Loading state
  if (loadingTranslations) {
     return (
       <div className="p-6 md:p-8">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 animate-pulse">
           <div className="md:col-span-7 space-y-6">
             <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
             <div className="h-24 bg-gray-200 rounded-lg"></div>
             <div className="h-10 bg-gray-200 rounded-lg w-1/2"></div>
             <div className="h-12 bg-gray-200 rounded-lg"></div>
             <div className="h-12 bg-gray-300 rounded-lg w-1/3 ml-auto"></div>
           </div>
           <div className="md:col-span-5 space-y-4">
             <div className="aspect-square bg-gray-200 rounded-xl"></div>
             <div className="h-6 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
           </div>
         </div>
       </div>
     );
   }

  return (
    <div className="p-1">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
         {/* Left column - Form */}
         <div className="lg:col-span-7 space-y-8">
           <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category Selection - Improved Styling */}
              <section aria-labelledby="category-select-heading">
                 <h2 id="category-select-heading" className="text-lg font-semibold text-gray-800 mb-4">{t('create.categories.title', '1. Choose a Category (Optional)')}</h2>
                 <div className="flex flex-wrap gap-3">
                    {CATEGORIES.map(cat => (
                       <button
                          key={cat.nameKey}
                          type="button"
                          onClick={() => handleSelectCategory(cat.nameKey)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 flex items-center gap-2 ${selectedCategoryKey === cat.nameKey ? 'bg-indigo-100 text-indigo-700 border-indigo-300 ring-2 ring-indigo-200' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}
                       >
                          <span className="text-lg">{cat.icon}</span>
                          {t(cat.nameKey, cat.nameKey.split('.').pop())}
                       </button>
                    ))}
                 </div>
              </section>
              
              {/* Prompt Input / Suggestions - Improved Styling */}
              <section aria-labelledby="prompt-heading">
                  <label htmlFor="prompt-input" className="block text-lg font-semibold text-gray-800 mb-3">{t('create.prompt.title', '2. Describe Your Image')}</label>
                  <textarea
                      id="prompt-input"
                      rows={4}
                      className="block w-full px-4 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm rounded-xl shadow-sm transition-colors duration-200 placeholder-gray-400"
                      placeholder={t('create.prompt.placeholder', 'e.g., A friendly dragon reading a book under an oak tree, cartoon style')}
                      value={prompt}
                      onChange={(e) => { setPrompt(e.target.value); setError(null); }}
                      disabled={loading || isAdvancedMode}
                  />
                 {suggestions.length > 0 && !isAdvancedMode && (
                   <div className="mt-3">
                     <p className="text-sm text-gray-600 mb-2 flex items-center">
                       <LightBulbIcon className="h-4 w-4 mr-1 text-yellow-500" />
                       {t('create.suggestions.title', 'Suggestions based on category:')}
                     </p>
                     <div className="flex flex-wrap gap-2">
                       {suggestions.map(sugg => (
                         <button
                           key={sugg}
                           type="button"
                           onClick={() => handleSelectSuggestion(sugg)}
                           className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors"
                           disabled={loading}
                         >
                           {sugg}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
              </section>

              {/* Style Selection - Improved Visuals */}
              <section aria-labelledby="style-select-heading">
                  <h2 id="style-select-heading" className="text-lg font-semibold text-gray-800 mb-4">{t('create.style.title', '3. Choose a Style')}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {STYLE_OPTIONS.map(opt => (
                         <button
                             key={opt.id}
                             type="button"
                             onClick={() => handleStyleChange(opt.id)}
                             disabled={loading || isAdvancedMode}
                             title={t(opt.descriptionKey, opt.id)}
                             className={`p-3 rounded-lg border-2 text-center transition-all duration-200 group flex flex-col items-center ${style === opt.id ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 shadow-md' : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'} ${isAdvancedMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                         >
                             {opt.icon.startsWith('/') ? (
                                 <Image src={opt.icon} alt="" width={32} height={32} className="mb-2 opacity-80 group-hover:opacity-100" />
                             ) : (
                                 <span className="text-2xl mb-1.5">{opt.icon}</span> 
                             )}
                             <span className={`block text-xs font-medium ${style === opt.id ? 'text-indigo-700' : 'text-gray-700 group-hover:text-indigo-600'}`}>
                                 {t(opt.labelKey, opt.id.charAt(0).toUpperCase() + opt.id.slice(1))}
                             </span>
                         </button>
                      ))}
                  </div>
              </section>
              
              {/* Advanced Mode - Improved Toggle & Input */}
              <section aria-labelledby="advanced-mode-heading">
                 <div className="flex items-center justify-between mb-4">
                    <h2 id="advanced-mode-heading" className={`text-lg font-semibold ${isAdvancedMode ? 'text-indigo-700' : 'text-gray-800'}`}>{t('create.advanced.title', 'Advanced Mode')}</h2>
                    <button 
                      type="button" 
                      onClick={toggleAdvancedMode} 
                      disabled={loading}
                      className={`${isAdvancedMode ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50`}
                    >
                      <span className="sr-only">{t('create.advanced.toggle', 'Toggle Advanced Mode')}</span>
                      <span aria-hidden="true" className={`${isAdvancedMode ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                    </button>
                 </div>
                 {isAdvancedMode && (
                   <div className="mt-4 space-y-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                       <label htmlFor="custom-prompt-input" className="block text-sm font-medium text-indigo-800">{t('create.advanced.label', 'Custom Prompt (Overrides above selections)')}:</label>
                       <textarea
                           id="custom-prompt-input"
                           rows={5}
                           className="block w-full px-4 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm rounded-xl shadow-sm transition-colors duration-200 placeholder-gray-400 bg-white"
                           placeholder={t('create.advanced.placeholder', 'e.g., detailed coloring page, thick lines, zen garden with a cat, no shading')}
                           value={customPrompt}
                           onChange={(e) => setCustomPrompt(e.target.value)}
                           disabled={loading}
                       />
                       <p className="text-xs text-indigo-600">{t('create.advanced.hint', 'Tip: Include keywords like "coloring page", "outline", style details, and use commas.')}</p>
                   </div>
                 )}
              </section>

              {/* Submit Button - Enhanced Styling */}
              <div className="pt-5 border-t border-gray-200">
                 <button
                     type="submit"
                     disabled={loading || (!isAdvancedMode && !prompt.trim()) || (isAdvancedMode && !customPrompt.trim())}
                     className="w-full inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md"
                 >
                     {loading ? (
                         <>
                             <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                             {t('create.generating', 'Generating...')}
                         </>
                     ) : (
                         <>
                             <SparklesIcon className="-ml-1 mr-2 h-5 w-5" />
                             {t('create.generateButton', 'Generate Coloring Page')}
                         </>
                     )}
                 </button>
              </div>
           </form>
         </div>
         
         {/* Right column - Preview & History */}
         <div className="lg:col-span-5 space-y-6">
           {/* Image Preview Section */}
           <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 min-h-[300px] flex flex-col items-center justify-center">
             <h2 className="text-lg font-semibold text-gray-800 mb-4 w-full text-center">{t('create.result.title', 'Your Generated Page')}</h2>
              {loading && (
                 <div className="text-center">
                   <ArrowPathIcon className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-3" />
                   <p className="text-gray-600 text-sm">{t('create.generating', 'Generating your masterpiece...')}</p>
                 </div>
               )}
               {error && (
                 <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg w-full">
                    <XMarkIcon className="h-6 w-6 text-red-500 mx-auto mb-2"/>
                    <p className="text-sm font-medium text-red-700">{t('create.errors.generationFailed', 'Generation Failed')}</p>
                   <p className="text-xs text-red-600 mt-1">{error}</p>
                 </div>
               )}
               {!loading && image && (
                 <div className="w-full text-center">
                   <div className="aspect-square relative w-full max-w-md mx-auto mb-4 border rounded-lg overflow-hidden bg-gray-50 shadow-inner">
                     <Image src={image} alt={lastGeneratedPrompt || t('create.result.alt', 'Generated coloring page')} fill className="object-contain" sizes="(max-width: 1024px) 40vw, 500px" />
                   </div>
                   <button
                      onClick={handleDownload}
                      className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-105"
                    >
                     <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
                     {t('create.downloadButton', 'Download PNG')}
                   </button>
                 </div>
               )}
               {!loading && !image && !error && (
                 <div className="text-center text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                   <p>{t('create.result.placeholder', 'Your generated image will appear here.')}</p>
                 </div>
               )}
           </div>

           {/* Generation History */}
           {generationHistory.length > 0 && (
             <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
               <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('create.history.title', 'Recent Creations')}</h3>
               <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                 {generationHistory.map((item, index) => (
                   <li key={item.id || index} className="flex items-center gap-3 p-2 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                     <div className="flex-shrink-0 w-12 h-12 relative rounded-md overflow-hidden border border-gray-200 bg-white">
                       <Image src={item.imageUrl} alt="" fill className="object-contain" sizes="48px"/>
                     </div>
                     <p className="text-xs text-gray-600 flex-grow truncate" title={item.prompt}>{
                       item.prompt.length > 70 ? item.prompt.substring(0, 70) + '...' : item.prompt
                     }</p>
                     <button onClick={() => setImage(item.imageUrl)} className="text-indigo-500 hover:text-indigo-700 p-1 rounded-full hover:bg-indigo-100 transition-colors" title={t('create.history.view', 'View this image')}>
                        <ChevronUpIcon className="h-4 w-4" />
                     </button>
                   </li>
                 ))}
               </ul>
             </div>
           )}
         </div>
       </div>
     </div>
  );
}; 