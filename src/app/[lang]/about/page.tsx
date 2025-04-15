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
  const translations = await getTranslations(lang);
  
  const t = (key: string, fallback?: string): string => {
    const defaultFallback = fallback || key.split('.').pop() || key;
    return getTranslationSync(key, undefined, translations, defaultFallback);
  };
  
  const getLocalizedHref = (path: string): string => {
    return `/${lang}${path}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Dark Theme & Gradient */}
      <div className="w-full bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-l from-purple-600 to-pink-600 blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            {t('about.hero.title', 'About AI Coloring Page Generator')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('about.hero.description', 'Our mission is to unlock creativity for everyone by making unique, high-quality coloring pages accessible through the power of AI.')}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Our Story Section - Dark Card */}
          <section aria-labelledby="our-story-heading">
            <div className="card p-8 md:p-12">
              <h2 id="our-story-heading" className="text-2xl font-bold mb-6 text-gray-100">{t('about.our_story.title', 'Our Story')}</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  {t('about.our_story.p1', 'AI Coloring Page Generator started with a simple question: what if anyone could create the perfect coloring page, exactly as they imagined it, without needing complex drawing skills? We saw the joy coloring brings to both children and adults and wanted to combine that with the exciting possibilities of artificial intelligence.')}
                </p>
                <p>
                  {t('about.our_story.p2', 'Our team, led by developer JL, brought together expertise in AI, web development, and design. We set out to build an intuitive tool that could transform simple text descriptions or even existing images into beautiful, clean-lined illustrations ready for coloring.')}
                </p>
                <p>
                  {t('about.our_story.p3', 'We aim to empower parents seeking engaging activities for their kids, teachers needing custom classroom materials, and adults looking for a relaxing, creative outlet.')} <Link href={getLocalizedHref('/gallery')} className="text-indigo-400 hover:text-indigo-300 hover:underline">{t('about.gallery_link', 'Gallery')}</Link> {t('about.for_inspiration', 'for inspiration!')}
                </p>
              </div>
            </div>
          </section>

          {/* Meet the Team Section - Dark Card */}
          <section aria-labelledby="team-heading">
            <div className="card p-8 md:p-12">
              <h2 id="team-heading" className="text-2xl font-bold mb-6 text-gray-100">{t('about.team.title', 'Meet the Team')}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 relative mb-4 rounded-full overflow-hidden bg-gradient-to-br from-indigo-800 to-purple-800 flex items-center justify-center border-2 border-indigo-600 shadow-lg">
                    <span className="text-4xl text-white font-semibold">JL</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1 text-gray-100">JL</h3>
                  <p className="text-indigo-400 mb-3">{t('about.team.founder_title', 'Founder & Lead Developer')}</p>
                  <p className="text-gray-400 text-sm">
                    {t('about.team.founder_description', 'Combining a passion for AI technology with creative design to make beautiful coloring pages accessible to everyone.')}
                  </p>
                </div>
                <div className="flex flex-col md:mt-8 space-y-4 text-gray-300">
                  <p>
                    {t('about.team.description', 'Our small but dedicated team works remotely across different time zones, bringing together expertise in:')}
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-gray-400 text-sm">
                    <li>{t('about.team.skill_1', 'AI and machine learning optimization')}</li>
                    <li>{t('about.team.skill_2', 'Web application development')}</li>
                    <li>{t('about.team.skill_3', 'UX/UI design focused on simplicity')}</li>
                    <li>{t('about.team.skill_4', 'Educational content creation')}</li>
                    <li>{t('about.team.skill_5', 'Multilingual implementation')}</li>
                  </ul>
                  <p className="text-sm">
                    {t('about.team.united', 'We\'re united by a shared belief in the power of creativity and the positive impact of accessible art tools.')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Technology Section - Dark Card */}
          <section aria-labelledby="technology-heading">
            <div className="card p-8 md:p-12">
              <h2 id="technology-heading" className="text-2xl font-bold mb-8 text-gray-100">{t('about.tech.title', 'Our Technology')}</h2>
              <div className="space-y-10">
                {[ /* Technology Items */
                  {
                    titleKey: 'about.tech.ai_model_title', 
                    descKey: 'about.tech.ai_model_description', 
                    icon: <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />,
                    iconBg: 'bg-indigo-900/50', iconColor: 'text-indigo-400'
                  },
                  {
                    titleKey: 'about.tech.nextjs_title',
                    descKey: 'about.tech.nextjs_description',
                    icon: <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />,
                    iconBg: 'bg-teal-900/50', iconColor: 'text-teal-400'
                  },
                  {
                    titleKey: 'about.tech.multilingual_title',
                    descKey: 'about.tech.multilingual_description',
                    icon: <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />,
                    iconBg: 'bg-purple-900/50', iconColor: 'text-purple-400'
                  }
                ].map((item, index) => (
                  <div key={index} className={`flex flex-col md:flex-row gap-6 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`md:w-1/3 flex-shrink-0 ${item.iconBg} p-6 rounded-lg flex items-center justify-center border border-gray-700`}>
                      <svg className={`w-16 h-16 ${item.iconColor}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        {item.icon}
                      </svg>
                    </div>
                    <div className="md:w-2/3 space-y-3 text-gray-300">
                      <h3 className="text-xl font-semibold text-gray-100">{t(item.titleKey)}</h3>
                      <p className="text-sm text-gray-400">{t(item.descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* How It Works & Benefits Section - Dark Cards */}
          <section aria-labelledby="how-it-works-heading" className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <h2 id="how-it-works-heading" className="text-xl font-bold mb-4 text-gray-100">{t('about.how_it_works.title', 'How It Works')}</h2>
              <div className="space-y-4 text-gray-300 text-sm">
                <p>{t('about.how_it_works.p1', 'Creating your custom page is easy! Simply describe what you want to color (like "a friendly dragon reading a book") or use our advanced options for more control. Choose from various styles to match your vision.')}</p>
                <p>{t('about.how_it_works.p2', 'Our AI, powered by advanced models like SiliconFlow, analyzes your input. It\'s specifically trained on thousands of illustrations to generate images with clean, clear black outlines suitable for all ages and skill levels.')}</p>
                <p>{t('about.how_it_works.p3', 'The result is a unique, high-resolution coloring page ready for you to download, print, and enjoy.')}</p>
              </div>
              <div className="mt-6">
                <Link href={getLocalizedHref('/create')} className="button-secondary inline-flex items-center">
                  {t('about.try_generator', 'Try the Generator')}
                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </Link>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-xl font-bold mb-4 text-gray-100">{t('about.benefits.title', 'Why Coloring Matters')}</h2>
              <ul className="space-y-3 text-gray-300 text-sm">
                 {[ /* Benefits Items */
                   'about.benefits.item1', 'about.benefits.item2', 'about.benefits.item3', 'about.benefits.item4'
                 ].map((key, index) => (
                    <li key={index} className="flex items-start">
                       <svg className="flex-shrink-0 w-5 h-5 text-teal-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                       {t(key)}
                    </li>
                 ))}
                 <li className="flex items-start">
                   <svg className="flex-shrink-0 w-5 h-5 text-teal-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                   <span>{t('about.benefits.item5_part1', 'Learn more on our')} <Link href={getLocalizedHref('/blog')} className="text-indigo-400 hover:text-indigo-300 hover:underline">{t('about.blog_link', 'Blog')}</Link>.</span>
                 </li>
              </ul>
            </div>
          </section>

          {/* User Testimonials - Dark Card */}
          <section aria-labelledby="testimonials-heading">
            <div className="card p-8 md:p-12">
              <h2 id="testimonials-heading" className="text-2xl font-bold mb-10 text-gray-100 text-center">{t('about.testimonials.title', 'What Our Users Say')}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                 {[ /* Testimonial Items */
                    { textKey: 'about.testimonials.item1', nameKey: 'about.testimonials.item1_name', roleKey: 'about.testimonials.item1_role', initial: 'M', bg: 'bg-blue-800/50', quoteColor: 'text-blue-600' },
                    { textKey: 'about.testimonials.item2', nameKey: 'about.testimonials.item2_name', roleKey: 'about.testimonials.item2_role', initial: 'J', bg: 'bg-teal-800/50', quoteColor: 'text-teal-600' }
                 ].map((item, index) => (
                    <div key={index} className={`rounded-lg p-6 relative border border-gray-700 ${item.bg}`}>
                       <svg className={`absolute top-4 left-4 transform h-8 w-8 ${item.quoteColor} opacity-50`} fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" /></svg>
                       <p className="text-gray-300 mb-4 italic pt-8 text-sm">"{t(item.textKey)}"</p>
                       <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full ${item.bg} border border-gray-600 flex items-center justify-center text-white font-bold mr-3`}>{item.initial}</div>
                          <div>
                             <p className="font-semibold text-gray-200 text-sm">{t(item.nameKey)}</p>
                             <p className="text-xs text-gray-400">{t(item.roleKey)}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          </section>

          {/* Community Showcase - Dark Card */}
          <section aria-labelledby="community-heading">
            <div className="card p-8 md:p-12">
              <h2 id="community-heading" className="text-2xl font-bold mb-6 text-gray-100">{t('about.community.title', 'Community Showcase')}</h2>
              <p className="text-gray-400 mb-8 text-sm">
                {t('about.community.description', 'Our users create incredible artwork with our coloring pages. Here are some highlights from our community!')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="relative aspect-square overflow-hidden rounded-lg bg-gray-700 border border-gray-600">
                     <div className="w-full h-full animate-pulse"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-xs text-gray-500">{t('about.community.sample', 'Sample')} {num}</span>
                     </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                 <Link href={getLocalizedHref('/gallery')} className="button-secondary inline-flex items-center">
                   {t('about.community.view_all', 'View All Community Creations')}
                   <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                 </Link>
              </div>
            </div>
          </section>

          {/* FAQ Section - Dark Card */}
          <section aria-labelledby="faq-heading">
            <div className="card p-8 md:p-12">
              <h2 id="faq-heading" className="text-2xl font-bold mb-8 text-gray-100">{t('about.faq.title', 'Frequently Asked Questions')}</h2>
              <div className="divide-y divide-gray-700">
                 {[ /* FAQ Items */
                    { qKey: 'about.faq.item1_question', aKey: 'about.faq.item1_answer' },
                    { qKey: 'about.faq.item2_question', aKey: 'about.faq.item2_answer' },
                    { qKey: 'about.faq.item3_question', aKey: 'about.faq.item3_answer' },
                    { qKey: 'about.faq.item4_question', aKey: 'about.faq.item4_answer' },
                    { qKey: 'about.faq.item5_question', aKey: 'about.faq.item5_answer' }
                 ].map((item, index) => (
                    <div key={index} className="py-5">
                       <details className="group">
                          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                             <span className="text-lg text-gray-200 group-hover:text-indigo-400 transition-colors">{t(item.qKey)}</span>
                             <span className="transition group-open:rotate-180 ml-4">
                                <svg className="fill-current text-indigo-400 group-hover:text-indigo-300" width="20" height="20" viewBox="0 0 24 24"><path d="M12 15.586L6.707 10.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414L12 15.586z"></path></svg>
                             </span>
                          </summary>
                          <p className="text-gray-400 mt-3 group-open:animate-fadeIn text-sm">
                            {t(item.aKey)}
                          </p>
                       </details>
                    </div>
                 ))}
              </div>
            </div>
          </section>

          {/* Our Vision Section - Dark Card */}
          <section aria-labelledby="our-vision-heading">
             <div className="card p-8 md:p-12">
               <h2 id="our-vision-heading" className="text-2xl font-bold mb-6 text-gray-100">{t('about.vision.title', 'Our Vision')}</h2>
               <div className="space-y-4 text-gray-300 text-sm">
                  <p>{t('about.vision.p1', 'We believe in the continuous evolution of creativity. Our vision is to keep improving the AI\'s capabilities, offering more styles, features, and customization options.')}</p>
                  <p>
                     {t('about.vision.p2', 'We plan to expand our')} <Link href={getLocalizedHref('/gallery')} className="text-indigo-400 hover:text-indigo-300 hover:underline">{t('about.gallery_link', 'Gallery')}</Link> {t('about.and', 'and')} <Link href={getLocalizedHref('/blog')} className="text-indigo-400 hover:text-indigo-300 hover:underline">{t('about.blog_link', 'Blog')}</Link> {t('about.vision.p2_end', 'with more resources, tutorials, and community features. Our goal is to build a vibrant space for coloring enthusiasts.')}
                  </p>
                  <p>{t('about.vision.p3', 'Most importantly, we are committed to keeping the core coloring page generation tool free and accessible to everyone, fostering creativity worldwide.')}</p>
               </div>
             </div>
          </section>

          {/* CTA Section - Dark Theme & Gradient */}
          <section aria-labelledby="cta-heading" className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 rounded-2xl p-8 md:p-12 border border-indigo-600 shadow-2xl">
            <div className="text-center">
              <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold mb-4 text-white">{t('about.cta.title', 'Ready to Unleash Your Creativity?')}</h2>
              <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                {t('about.cta.description', 'Start generating unique, beautiful coloring pages with our AI tool today. It\'s free, fun, and easy to use!')}
              </p>
              <Link href={getLocalizedHref('/create')} className="button-primary bg-white text-indigo-600 hover:bg-gray-100 text-lg">
                {t('about.cta.get_started', 'Get Started Now')}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 