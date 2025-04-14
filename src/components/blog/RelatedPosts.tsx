'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface RelatedPost {
  title: string;
  slug: string;
  imageUrl?: string;
  description?: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  title?: string;
  locale?: string;
}

/**
 * Component to display related blog posts with images and titles
 */
export default function RelatedPosts({ 
  posts = [], 
  title = 'Related Posts',
  locale = 'en'
}: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="w-full py-6 mt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <div key={index} className="flex flex-col border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {post.imageUrl && (
              <div className="relative h-40 w-full">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
              {post.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.description}
                </p>
              )}
              <div className="mt-auto">
                <Link href={`/${locale}/blog/${post.slug}`} className="text-primary flex items-center gap-1 hover:underline text-sm font-medium">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 