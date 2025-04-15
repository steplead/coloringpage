'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Remove unused Translation import
// import { Translation } from '@/lib/i18n/locales';
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

  // State is no longer needed as we directly use post.title and post.content
  // const [translatedTitle, setTranslatedTitle] = useState<string>(post.title);
  // const [translatedContent, setTranslatedContent] = useState<string>(post.content);

  // useEffect is no longer needed as translation logic is removed
  /*
  useEffect(() => {
    // Get language from cookie
    const langCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='));
    
    const lang = langCookie ? langCookie.split('=')[1] : 'en';

    // If we have translations for this language, use them
    // This logic is removed as post.translations no longer exists
    // if (post.translations && post.translations[lang]) {
    //   setTranslatedTitle(post.translations[lang].title);
    //   setTranslatedContent(post.translations[lang].content);
    // } else {
      // Otherwise fall back to original content
      setTranslatedTitle(post.title);
      setTranslatedContent(post.content);
    // }
  }, [post.title, post.content]); // Removed post.translations from dependencies
  */

  return (
    <div className="prose prose-lg max-w-none">
      {/* Use post.title directly */}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {/* Use post.content directly */}
      <div 
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
} 