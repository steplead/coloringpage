'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Translation = {
  title: string;
  content: string;
  description: string;
};

type BlogPostContentProps = {
  slug: string;
  title: string;
  content: string;
  translations?: Record<string, Translation>;
  className?: string;
};

export default function BlogPostContent({
  slug,
  title,
  content,
  translations,
  className = '',
}: BlogPostContentProps) {
  // Get current language from cookie on client side
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [translatedTitle, setTranslatedTitle] = useState<string>(title);
  const [translatedContent, setTranslatedContent] = useState<string>(content);
  const router = useRouter();

  useEffect(() => {
    // Get language from cookie
    const langCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='));
    
    const lang = langCookie ? langCookie.split('=')[1] : 'en';
    setCurrentLang(lang);

    // If we have translations for this language, use them
    if (translations && translations[lang]) {
      setTranslatedTitle(translations[lang].title);
      setTranslatedContent(translations[lang].content);
    } else {
      // Otherwise fall back to original content
      setTranslatedTitle(title);
      setTranslatedContent(content);
    }
  }, [title, content, translations]);

  return (
    <div className={className}>
      <h1 className="text-3xl font-bold mb-4">{translatedTitle}</h1>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: translatedContent }}
      />
    </div>
  );
} 