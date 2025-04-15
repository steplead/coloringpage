'use client';

import React from 'react';
import { BlogPost } from '@/lib/blog/blogService';

type BlogPostContentProps = {
  title: string;
  content: string;
  // translations?: Record<string, BlogPost>; // Removed unused prop
  className?: string;
};

export default function BlogPostContent({
  title,
  content,
  // translations, // Removed unused prop
  className = '',
}: BlogPostContentProps) {
  // Removed unused currentLang state
  // const [currentLang, setCurrentLang] = useState('en');

  // Removed useEffect related to currentLang
  // useEffect(() => {
  //   // Get language from cookie
  //   const langCookie = document.cookie
  //     .split('; ')
  //     .find(row => row.startsWith('NEXT_LOCALE='));
  //   
  //   const lang = langCookie ? langCookie.split('=')[1] : 'en';
  //   setCurrentLang(lang);
  //
  //   // If we have translations for this language, use them
  //   if (translations && translations[lang]) {
  //     setTranslatedTitle(translations[lang].title);
  //     setTranslatedContent(translations[lang].content);
  //   } else {
  //     // Otherwise fall back to original content
  //     setTranslatedTitle(title);
  //     setTranslatedContent(content);
  //   }
  // }, [title, content, translations]);

  return (
    <div className={className}>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
} 