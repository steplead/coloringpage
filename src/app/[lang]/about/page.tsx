import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations, getTranslationSync } from '@/lib/i18n/translations';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
}

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const translations = await getTranslations(lang);
  
  return {
    title: getTranslationSync('about.meta.title', undefined, translations, 'About Us - AI Coloring Page Generator'),
    description: getTranslationSync('about.meta.description', undefined, translations, 'Learn about our mission, the creative team, technology, and community behind our AI-powered coloring page generator.'),
    keywords: ['AI coloring pages', 'coloring page creator', 'about us', 'AI technology', 'educational coloring', 'creative team'],
  };
}

export default async function AboutPage({ params: { lang } }: { params: { lang: string } }) {
  // Fetch all translations for the current language
  const translations = await getTranslations(lang);
  
  // Helper to get translation safely
  const t = (key: string, fallback?: string): string => {
    if (!translations) {
      console.warn(`[AboutPage] Translations not loaded when trying to access key: ${key}`);
      return fallback || key.split('.').pop() || key;
    }
    return getTranslationSync(key, undefined, translations, fallback);
  };
  
  // Helper function to get localized href
  const getLocalizedHref = (path: string): string => {
    return `/${lang}${path}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {t('about.hero.title', 'About AI Coloring Page Generator')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('about.hero.description', 'Our mission is to unlock creativity for everyone by making unique, high-quality coloring pages accessible through the power of AI.')}
          </p>
        </div>

        {/* Our Story Section */}
        <section aria-labelledby="our-story-heading" className="mb-16">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 id="our-story-heading" className="text-2xl font-bold mb-6 text-gray-800">{t('about.our_story.title', 'Our Story')}</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {t('about.our_story.p1', 'AI Coloring Page Generator started with a simple question: what if anyone could create the perfect coloring page, exactly as they imagined it, without needing complex drawing skills? We saw the joy coloring brings to both children and adults and wanted to combine that with the exciting possibilities of artificial intelligence.')}
                </p>
                <p>
                  {t('about.our_story.p2', 'Our team, led by developer JL, brought together expertise in AI, web development, and design. We set out to build an intuitive tool that could transform simple text descriptions or even existing images into beautiful, clean-lined illustrations ready for coloring.')}
                </p>
                <p>
                  {t('about.our_story.p3', 'We aim to empower parents seeking engaging activities for their kids, teachers needing custom classroom materials, and adults looking for a relaxing, creative outlet.')} <Link href={getLocalizedHref('/gallery')} className="text-blue-600 hover:underline">{t('about.gallery_link', 'Gallery')}</Link> {t('about.for_inspiration', 'for inspiration!')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section aria-labelledby="team-heading" className="mb-16">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 id="team-heading" className="text-2xl font-bold mb-6 text-gray-800">{t('about.team.title', 'Meet the Team')}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 relative mb-4 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                    <span className="text-4xl text-blue-500">JL</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">JL</h3>
                  <p className="text-blue-600 mb-3">{t('about.team.founder_title', 'Founder & Lead Developer')}</p>
                  <p className="text-gray-600">
                    {t('about.team.founder_description', 'Combining a passion for AI technology with creative design to make beautiful coloring pages accessible to everyone.')}
                  </p>
                </div>
                <div className="flex flex-col md:mt-8 space-y-4 text-gray-600">
                  <p>
                    {t('about.team.description', 'Our small but dedicated team works remotely across different time zones, bringing together expertise in:')}
                  </p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>{t('about.team.skill_1', 'AI and machine learning optimization')}</li>
                    <li>{t('about.team.skill_2', 'Web application development')}</li>
                    <li>{t('about.team.skill_3', 'UX/UI design focused on simplicity')}</li>
                    <li>{t('about.team.skill_4', 'Educational content creation')}</li>
                    <li>{t('about.team.skill_5', 'Multilingual implementation')}</li>
                  </ul>
                  <p>
                    {t('about.team.united', 'We\'re united by a shared belief in the power of creativity and the positive impact of accessible art tools.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Technology Section */}
        <section aria-labelledby="technology-heading" className="mb-16">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 id="technology-heading" className="text-2xl font-bold mb-6 text-gray-800">{t('about.tech.title', 'Our Technology')}</h2>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/3 flex-shrink-0 bg-blue-50 p-6 rounded-lg flex items-center justify-center">
                    <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="md:w-2/3 space-y-4 text-gray-600">
                    <h3 className="text-xl font-semibold text-gray-800">{t('about.tech.ai_model_title', 'Advanced AI Model')}</h3>
                    <p>
                      {t('about.tech.ai_model_description', 'Our system is powered by SiliconFlow\'s sophisticated AI models, specifically optimized for generating clean, black outline illustrations perfect for coloring. We\'ve fine-tuned the AI to understand coloring page aesthetics and produce images with well-defined lines and appropriate spacing.')}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/3 md:order-2 flex-shrink-0 bg-green-50 p-6 rounded-lg flex items-center justify-center">
                    <svg className="w-24 h-24 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="md:w-2/3 md:order-1 space-y-4 text-gray-600">
                    <h3 className="text-xl font-semibold text-gray-800">{t('about.tech.nextjs_title', 'Next.js Application')}</h3>
                    <p>
                      {t('about.tech.nextjs_description', 'Built on Next.js 14, our application leverages the latest web technologies for optimal performance. Server-side rendering ensures fast page loads while our responsive design works seamlessly across all devices, from desktop computers to tablets and mobile phones.')}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="md:w-1/3 flex-shrink-0 bg-purple-50 p-6 rounded-lg flex items-center justify-center">
                    <svg className="w-24 h-24 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div className="md:w-2/3 space-y-4 text-gray-600">
                    <h3 className="text-xl font-semibold text-gray-800">{t('about.tech.multilingual_title', 'Multilingual Support')}</h3>
                    <p>
                      {t('about.tech.multilingual_description', 'Our platform supports 8 languages including English, Chinese, Spanish, French, German, Japanese, Korean, and Russian. With automatic language detection based on browser settings and URL-based routing, we\'re committed to making our tool accessible worldwide.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works & Benefits Section */}
        <section aria-labelledby="how-it-works-heading" className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
              <h2 id="how-it-works-heading" className="text-xl font-bold mb-4 text-gray-800">{t('about.how_it_works.title', 'How It Works')}</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {t('about.how_it_works.p1', 'Creating your custom page is easy! Simply describe what you want to color (like "a friendly dragon reading a book") or use our advanced options for more control. Choose from various styles to match your vision.')}
                </p>
                <p>
                  {t('about.how_it_works.p2', 'Our AI, powered by advanced models like SiliconFlow, analyzes your input. It\'s specifically trained on thousands of illustrations to generate images with clean, clear black outlines suitable for all ages and skill levels.')}
                </p>
                <p>
                  {t('about.how_it_works.p3', 'The result is a unique, high-resolution coloring page ready for you to download, print, and enjoy.')}
                </p>
              </div>
              <div className="mt-6">
                <Link 
                  href={getLocalizedHref('/create')}
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                >
                  {t('about.try_generator', 'Try the Generator')}
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Benefits of Coloring Section */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800">{t('about.benefits.title', 'Why Coloring Matters')}</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  {t('about.benefits.item1', 'Reduces stress and promotes mindfulness.')}
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  {t('about.benefits.item2', 'Improves focus, concentration, and fine motor skills.')}
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  {t('about.benefits.item3', 'Stimulates creativity and provides a sense of accomplishment.')}
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  {t('about.benefits.item4', 'Offers a wonderful screen-free activity for all ages.')}
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  {t('about.benefits.item5', 'Learn more about coloring techniques and ideas on our')} <Link href={getLocalizedHref('/blog')} className="text-blue-600 hover:underline">{t('about.blog_link', 'Blog')}</Link>.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* User Testimonials */}
        <section aria-labelledby="testimonials-heading" className="mb-16">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 id="testimonials-heading" className="text-2xl font-bold mb-8 text-gray-800 text-center">{t('about.testimonials.title', 'What Our Users Say')}</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 rounded-lg p-6 relative">
                  <svg className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3 h-8 w-8 text-blue-400 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  
                  <p className="text-gray-700 mb-4 italic">
                    {t('about.testimonials.item1', '"I was amazed by how easy it was to create custom coloring pages for my classroom. My students love them, and I save so much time compared to searching for the perfect pages online!"')}
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold mr-3">
                      M
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{t('about.testimonials.item1_name', 'Maria T.')}</p>
                      <p className="text-sm text-gray-600">{t('about.testimonials.item1_role', 'Elementary School Teacher')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 relative">
                  <svg className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3 h-8 w-8 text-green-400 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  
                  <p className="text-gray-700 mb-4 italic">
                    {t('about.testimonials.item2', '"I\'ve rediscovered my love for coloring as an adult. Being able to generate exactly what I want to color is fantastic. The clean lines make it easy to get great results every time."')}
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold mr-3">
                      J
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{t('about.testimonials.item2_name', 'James K.')}</p>
                      <p className="text-sm text-gray-600">{t('about.testimonials.item2_role', 'Adult Coloring Enthusiast')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Showcase */}
        <section aria-labelledby="community-heading" className="mb-16">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 id="community-heading" className="text-2xl font-bold mb-6 text-gray-800">{t('about.community.title', 'Community Showcase')}</h2>
              <p className="text-gray-600 mb-8">
                {t('about.community.description', 'Our users create incredible artwork with our coloring pages. Here are some highlights from our community!')}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="relative aspect-square overflow-hidden rounded-lg">
                    <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500">{t('about.community.sample', 'Sample')} {num}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Link href={getLocalizedHref('/gallery')} className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                  {t('about.community.view_all', 'View All Community Creations')}
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section aria-labelledby="faq-heading" className="mb-16">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 id="faq-heading" className="text-2xl font-bold mb-8 text-gray-800">{t('about.faq.title', 'Frequently Asked Questions')}</h2>
              
              <div className="divide-y divide-gray-200">
                <div className="py-5">
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer">
                      <span className="text-lg text-gray-800">{t('about.faq.item1_question', 'Is the service really free to use?')}</span>
                      <span className="transition group-open:rotate-180">
                        <svg className="fill-current text-blue-500" width="20" height="20" viewBox="0 0 24 24">
                          <path d="M6.99 11L6.99 13L17.01 13L17.01 11L6.99 11Z" transform="rotate(90 12 12)"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                      {t('about.faq.item1_answer', 'Yes, our core coloring page generation tool is completely free to use. We believe in making creativity accessible to everyone. There are no hidden fees or limits on the number of coloring pages you can create.')}
                    </p>
                  </details>
                </div>

                <div className="py-5">
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer">
                      <span className="text-lg text-gray-800">{t('about.faq.item2_question', 'How high-quality are the generated images?')}</span>
                      <span className="transition group-open:rotate-180">
                        <svg className="fill-current text-blue-500" width="20" height="20" viewBox="0 0 24 24">
                          <path d="M6.99 11L6.99 13L17.01 13L17.01 11L6.99 11Z" transform="rotate(90 12 12)"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                      {t('about.faq.item2_answer', 'We generate high-resolution coloring pages (1024x1024 pixels by default) that are perfect for printing. Our AI is specifically trained to create clean, well-defined black outlines with appropriate spacing for coloring. The images are optimized for both screen viewing and printing.')}
                    </p>
                  </details>
                </div>

                <div className="py-5">
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer">
                      <span className="text-lg text-gray-800">{t('about.faq.item3_question', 'Can I request specific coloring page styles?')}</span>
                      <span className="transition group-open:rotate-180">
                        <svg className="fill-current text-blue-500" width="20" height="20" viewBox="0 0 24 24">
                          <path d="M6.99 11L6.99 13L17.01 13L17.01 11L6.99 11Z" transform="rotate(90 12 12)"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                      {t('about.faq.item3_answer', 'Absolutely! Our generator offers multiple style options: Simple, Medium, Complex, Cartoon, and Realistic. You can choose the style that best fits your needs. For even more control, try the Advanced Mode where you can specify exactly what you want with detailed prompts.')}
                    </p>
                  </details>
                </div>

                <div className="py-5">
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer">
                      <span className="text-lg text-gray-800">{t('about.faq.item4_question', 'What makes this different from other coloring page sites?')}</span>
                      <span className="transition group-open:rotate-180">
                        <svg className="fill-current text-blue-500" width="20" height="20" viewBox="0 0 24 24">
                          <path d="M6.99 11L6.99 13L17.01 13L17.01 11L6.99 11Z" transform="rotate(90 12 12)"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                      {t('about.faq.item4_answer', 'Unlike traditional coloring page websites that offer a fixed library of designs, our AI generator creates unique, custom coloring pages based on your specific descriptions. You can literally describe anything you can imagine, and our AI will create it as a coloring page. Each creation is one-of-a-kind!')}
                    </p>
                  </details>
                </div>

                <div className="py-5">
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer">
                      <span className="text-lg text-gray-800">{t('about.faq.item5_question', 'Is my data private?')}</span>
                      <span className="transition group-open:rotate-180">
                        <svg className="fill-current text-blue-500" width="20" height="20" viewBox="0 0 24 24">
                          <path d="M6.99 11L6.99 13L17.01 13L17.01 11L6.99 11Z" transform="rotate(90 12 12)"></path>
                        </svg>
                      </span>
                    </summary>
                    <p className="text-gray-600 mt-3 group-open:animate-fadeIn">
                      {t('about.faq.item5_answer', 'We take privacy seriously. When you generate a coloring page, your prompt and the resulting image may be stored to improve our service and populate the community gallery (if you opt to make it public). However, we don\'t collect personal information without your consent, and you can always choose to keep your creations private.')}
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Vision Section */}
        <section aria-labelledby="our-vision-heading" className="mb-16">
           <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 id="our-vision-heading" className="text-2xl font-bold mb-6 text-gray-800">{t('about.vision.title', 'Our Vision')}</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {t('about.vision.p1', 'We believe in the continuous evolution of creativity. Our vision is to keep improving the AI\'s capabilities, offering more styles, features, and customization options.')}
                </p>
                <p>
                  {t('about.vision.p2', 'We plan to expand our')} <Link href={getLocalizedHref('/gallery')} className="text-blue-600 hover:underline">{t('about.gallery_link', 'Gallery')}</Link> {t('about.vision.p2_end', 'with more resources, tutorials, and community features. Our goal is to build a vibrant space for coloring enthusiasts.')}
                </p>
                 <p>
                  {t('about.vision.p3', 'Most importantly, we are committed to keeping the core coloring page generation tool free and accessible to everyone, fostering creativity worldwide.')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section aria-labelledby="cta-heading" className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 md:p-12 mb-12">
          <div className="text-center">
            <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold mb-4 text-white">{t('about.cta.title', 'Ready to Unleash Your Creativity?')}</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('about.cta.description', 'Start generating unique, beautiful coloring pages with our AI tool today. It\'s free, fun, and easy to use!')}
            </p>
            <Link
              href={getLocalizedHref('/create')}
              className="inline-flex items-center bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-8 rounded-md shadow-md transition-colors text-lg"
            >
              {t('about.cta.get_started', 'Get Started Now')}
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 