'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Translation } from '@/lib/i18n/locales';
import { BlogPost } from '@/lib/blog/blogService';

// Removed unused slug
interface BlogPostContentProps {
  post: BlogPost;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  // Removed unused currentLang and router

  if (!post) {
    return <p>Post data not found.</p>;
  }

  const [translatedTitle, setTranslatedTitle] = useState<string>(post.title);
  const [translatedContent, setTranslatedContent] = useState<string>(post.content);

  useEffect(() => {
    // Get language from cookie
    const langCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='));
    
    const lang = langCookie ? langCookie.split('=')[1] : 'en';

    // If we have translations for this language, use them
    if (post.translations && post.translations[lang]) {
      setTranslatedTitle(post.translations[lang].title);
      setTranslatedContent(post.translations[lang].content);
    } else {
      // Otherwise fall back to original content
      setTranslatedTitle(post.title);
      setTranslatedContent(post.content);
    }
  }, [post.title, post.content, post.translations]);

  return (
    <div className="prose prose-lg max-w-none">
      <h1 className="text-3xl font-bold mb-4">{translatedTitle}</h1>
      <div 
        dangerouslySetInnerHTML={{ __html: translatedContent }}
      />
    </div>
  );
} 