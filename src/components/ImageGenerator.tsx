'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { getTranslations, getTranslationSync } from '@/lib/i18n/translations';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// Style options with visual examples
const STYLE_OPTIONS = [
  { id: 'simple', labelKey: 'create.styleOptions.simple', descriptionKey: 'create.styleOptions.simple.desc', icon: '🐢' },
  { id: 'medium', labelKey: 'create.styleOptions.medium', descriptionKey: 'create.styleOptions.medium.desc', icon: '🦁' },
  { id: 'complex', labelKey: 'create.styleOptions.complex', descriptionKey: 'create.styleOptions.complex.desc', icon: '🐉' },
  { id: 'cartoon', labelKey: 'create.styleOptions.cartoon', descriptionKey: 'create.styleOptions.cartoon.desc', icon: '🚀' },
  { id: 'realistic', labelKey: 'create.styleOptions.realistic', descriptionKey: 'create.styleOptions.realistic.desc', icon: '🏰' },
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

// Helper function to truncate prompt text
const truncatePrompt = (prompt: string, maxLength: number = 50): string => {
  if (!prompt) return '';
  return prompt.length > maxLength 
    ? `${prompt.substring(0, maxLength)}...` 
    : prompt;
};

// Base prompt that defines a coloring page
const BASE_PROMPT = 'black outline coloring page, clean lines';

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
  const [generationHistory, setGenerationHistory] = useState<{prompt: string, imageUrl: string}[]>([]);
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
        const fetchedTranslations = await getTranslations(lang);
        setTranslations(fetchedTranslations);
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
      setError(t('create.errors.promptRequired', 'Please enter a description'));
      return;
    }
    if (isAdvancedMode && !customPrompt.trim()) {
      setError(t('create.errors.customPromptRequired', 'Please enter a custom prompt'));
      return;
    }
    setLoading(true);
    setError(null);
    const currentPrompt = isAdvancedMode ? customPrompt : prompt;
    setLastGeneratedPrompt(currentPrompt);
    
    let retryCount = 0;
    let success = false;
    let finalImageUrl = null;
    
    while (retryCount < MAX_RETRIES && !success) {
      try {
        if (retryCount > 0) console.log(`Retry attempt ${retryCount}...`);
        
        const categoryName = selectedCategoryKey ? selectedCategoryKey.split('.').pop() : 'default';

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
      setGenerationHistory(prev => [{ prompt: currentPrompt, imageUrl: finalImageUrl }, ...prev].slice(0, 10));
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
         {/* Placeholder for loading state */}
         <div className="md:col-span-7 bg-gray-100 rounded-lg shadow-sm h-96 animate-pulse"></div>
         <div className="md:col-span-5 bg-gray-100 rounded-lg shadow-sm h-96 animate-pulse"></div>
       </div>
     );
   }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
      {/* Left column - Form */}
      <div className="md:col-span-7 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Use H2 for major form sections */}
            <section aria-labelledby="category-select-heading" className="mb-6">
              <h2 id="category-select-heading" className="block text-xl font-semibold text-gray-800 mb-3">
                {t('create.sections.category.title', '1. Choose a Category (Optional)')}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                 {t('create.sections.category.desc', 'Selecting a category helps the AI focus. Click again to deselect.')}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category.nameKey}
                    type="button"
                    onClick={() => handleSelectCategory(category.nameKey)}
                    className={`p-2 rounded-lg text-center transition-colors flex flex-col items-center justify-center border ${ selectedCategoryKey === category.nameKey ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200' }`}
                    aria-pressed={selectedCategoryKey === category.nameKey}
                  >
                    <span className="text-3xl mb-1" role="img" aria-label={t(category.nameKey)}>{category.icon}</span>
                    <span className="text-xs font-medium">{t(category.nameKey)}</span>
                  </button>
                ))}
              </div>
            </section>

            <section aria-labelledby="description-heading" className="mb-6">
              <h2 id="description-heading" className="block text-xl font-semibold text-gray-800 mb-3">
                {t('create.sections.description.title', '2. Describe Your Image')}
              </h2>
              <textarea
                id="prompt-input"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('create.sections.description.placeholder', 'e.g., A happy cartoon elephant playing with a ball in a sunny park')}
                aria-label={t('create.sections.description.ariaLabel', 'Image description input')}
              />
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {t('create.sections.suggestions.title', `Ideas for ${selectedCategoryKey ? t(selectedCategoryKey) : 'category'}:`)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-800 border border-gray-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section aria-labelledby="style-select-heading" className="mb-6">
              <h2 id="style-select-heading" className="block text-xl font-semibold text-gray-800 mb-3">
                {t('create.sections.style.title', '3. Choose a Complexity Style')}
              </h2>
               <p className="text-sm text-gray-500 mb-4">
                 {t('create.sections.style.desc', 'Style affects image complexity and overall appearance. Choose based on the desired age group or detail level.')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {STYLE_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleStyleChange(option.id)}
                    className={`p-3 rounded-lg text-center transition-colors border flex flex-col items-center justify-start ${ style === option.id ? 'bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-200' : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-200' }`}
                    aria-pressed={style === option.id}
                  >
                    <span className="text-3xl mb-2" role="img" aria-label={t(option.labelKey)}>{option.icon}</span>
                    <span className="text-sm font-medium">{t(option.labelKey)}</span>
                    <span className="text-xs text-gray-500 mt-1 hidden sm:block text-center">{t(option.descriptionKey)}</span>
                  </button>
                ))}
              </div>
            </section>

            <section aria-labelledby="advanced-toggle-heading" className="mb-6 pb-4 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <div>
                   <h2 id="advanced-toggle-heading" className="text-lg font-medium text-gray-700">
                     {t('create.sections.advanced.toggleLabel', 'Expert Mode')}
                   </h2>
                   <p className="text-sm text-gray-500">
                     {t('create.sections.advanced.toggleDesc', 'For precise control over the AI prompt.')}
                   </p>
                 </div>
                 <div className="relative inline-block w-10 align-middle select-none">
                   <input id="advanced-mode" type="checkbox" checked={isAdvancedMode} onChange={toggleAdvancedMode} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                   <label htmlFor="advanced-mode" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                 </div>
               </div>
            </section>

            {isAdvancedMode && (
              <section aria-labelledby="custom-prompt-heading" className="mb-6">
                <h2 id="custom-prompt-heading" className="block text-xl font-semibold text-gray-800 mb-3">
                  {t('create.sections.advanced.promptTitle', 'Custom Prompt (Advanced)')}
                </h2>
                <textarea
                  id="custom-prompt"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={t('create.sections.advanced.promptPlaceholder', 'Enter your full prompt here, e.g., detailed castle coloring page, black outline, clean lines')}
                  aria-label={t('create.sections.advanced.promptAriaLabel', 'Custom prompt input')}
                />
                <p className="mt-2 text-xs text-gray-500">
                   {t('create.sections.advanced.promptTip', 'Tip: Always include terms like "black outline coloring page" and "clean lines" for best results.')}
                </p>
              </section>
            )}

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading || loadingTranslations}
                className={`w-full py-3 px-4 rounded-md text-white font-semibold text-lg transition-colors duration-200 flex items-center justify-center ${ (loading || loadingTranslations) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700' }`}
              >
                {(loading || loadingTranslations) ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {t('create.buttons.generating', 'Generating...')}
                  </>
                ) : (
                  t('create.buttons.generate', 'Generate Coloring Page')
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                {error} 
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right column - Preview & History */}
      <div className="md:col-span-5">
        {/* Image Preview Section */}
        <section aria-labelledby="preview-heading" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
           <h2 id="preview-heading" className="text-xl font-semibold text-gray-800 mb-4">
              {t('create.sections.preview.title', 'Preview')}
           </h2>
           <div className="aspect-square w-full bg-gray-100 rounded-md flex items-center justify-center border border-gray-200 overflow-hidden">
             {image ? (
               <Image
                 src={image}
                 alt={t('create.sections.preview.altGenerated', `Generated coloring page based on prompt: ${lastGeneratedPrompt}`)}
                 width={512} 
                 height={512}
                 className="object-contain max-w-full max-h-full"
               />
             ) : (
               <div className="text-center text-gray-500 p-8">
                 <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                 <p className="mt-2 text-sm">
                    {t('create.sections.preview.placeholder', 'Your generated coloring page will appear here')}
                 </p>
                 <p className="text-xs mt-1">
                    {t('create.sections.preview.tip', 'Fill out the form and click generate!')}
                 </p>
               </div>
             )}
           </div>
           {image && (
             <div className="mt-4 flex flex-wrap justify-center gap-3">
               <button onClick={handleDownload} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium inline-flex items-center">
                 <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                 {t('create.buttons.download', 'Download PNG')}
               </button>
                <Link href={`/${lang}/gallery/${generationHistory[0]?.imageUrl?.split('/').pop()?.split('.')[0] || ''}`} 
                      className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium inline-flex items-center ${!generationHistory[0]?.imageUrl ? 'hidden' : ''}`}>
                   {t('create.buttons.viewInGallery', 'View in Gallery')}
                </Link>
             </div>
           )}
           {lastGeneratedPrompt && (
             <p className="mt-4 text-xs text-gray-500 text-center italic">
               {t('create.sections.preview.lastPrompt', `Based on prompt: ${truncatePrompt(lastGeneratedPrompt, 60)}`)}
             </p>
           )}
        </section>

        {/* Generation History Section */}
        {generationHistory.length > 0 && (
          <section aria-labelledby="history-heading" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 id="history-heading" className="text-xl font-semibold text-gray-800 mb-4">
               {t('create.sections.history.title', 'Recent Creations')}
            </h2>
            <ul className="space-y-3">
              {generationHistory.map((item, index) => (
                <li key={index} className="flex items-center gap-3 p-2 border rounded-md bg-gray-50 hover:bg-gray-100">
                  <Image 
                    src={item.imageUrl} 
                    alt={t('create.sections.history.alt', `Previously generated image for: ${item.prompt}`)}
                    width={48} 
                    height={48} 
                    className="rounded border border-gray-200 bg-white"
                  />
                  <p className="text-xs text-gray-600 flex-1 truncate" title={item.prompt}>{item.prompt}</p>
                  <button 
                    onClick={() => setPrompt(item.prompt)} 
                    className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                    title={t('create.sections.history.reusePromptTooltip', 'Reuse this prompt')}
                   >
                    {t('create.sections.history.reuseButton', 'Reuse')}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}; 