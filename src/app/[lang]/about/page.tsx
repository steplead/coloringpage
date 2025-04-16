import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations, getTranslationSync } from '@/lib/i18n/translations';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/locales';
import FAQSection from '@/components/blog/FAQSection';

// Define FaqItem type here
interface FaqItem {
  question: string;
  answer: string;
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({
    lang: lang.code,
  }));
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === params.lang)?.code || 'en';
  const translations = await getTranslations(lang);
  const t = (key: string, fallback?: string) => getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-coloringpage.com';

  return {
    title: t('about.meta.title', 'About Us | AI Coloring Page Generator'),
    description: t('about.meta.description', 'Learn about the mission, technology, and team behind the AI Coloring Page generator.'),
    keywords: t('about.meta.keywords', 'about ai coloring page, ai image generation, coloring technology, creative tools'),
    alternates: {
      canonical: `${siteUrl}/about`,
      languages: SUPPORTED_LANGUAGES.reduce((acc, cur) => {
        acc[cur.code] = `${siteUrl}/${cur.code}/about`;
        return acc;
      }, {} as Record<string, string>)
    },
    openGraph: {
      title: t('about.og.title', 'About AI Coloring Page Generator'),
      description: t('about.og.description', 'Discover the story and technology behind our innovative coloring page tool.'),
      url: `${siteUrl}/${lang}/about`,
      images: [
        {
          url: `${siteUrl}/images/about-og.png`, // Consider creating a specific OG image
          width: 1200,
          height: 630,
          alt: t('about.og.imageAlt', 'Illustration representing AI and creativity for coloring pages')
        }
      ]
    }
  };
}

// Helper function to get localized href (moved before usage)
const getLocalizedHref = (path: string, lang: string): string => {
  // Ensure leading slash for the path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${normalizedPath}`;
};

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const translations = await getTranslations(lang);
  const t = (key: string, fallback?: string): string => {
    return getTranslationSync(key, undefined, translations, fallback || key.split('.').pop());
  };

  // --- Realistic Placeholder Content --- 
  const teamMembers = [
    { name: t('about.team.member1.name', 'Dr. Evelyn Reed'), role: t('about.team.member1.role', 'Lead AI Researcher'), image: '/images/team/member1.jpg', bio: t('about.team.member1.bio', 'Passionate about generative models and bringing creative AI tools to everyone.') },
    { name: t('about.team.member2.name', 'David Chen'), role: t('about.team.member2.role', 'Senior Software Engineer'), image: '/images/team/member2.jpg', bio: t('about.team.member2.bio', 'Expert in cloud infrastructure and building scalable web applications.') },
    { name: t('about.team.member3.name', 'Aisha Khan'), role: t('about.team.member3.role', 'UX/UI Designer'), image: '/images/team/member3.jpg', bio: t('about.team.member3.bio', 'Dedicated to creating intuitive and delightful user experiences.') },
  ];

  const testimonials = [
    { quote: t('about.testimonials.1.quote', "My kids absolutely love the coloring pages! It's amazing how it creates exactly what they ask for."), author: t('about.testimonials.1.author', 'Sarah P., Parent') },
    { quote: t('about.testimonials.2.quote', "As a teacher, this tool is a lifesaver for creating custom worksheets and activities. Highly recommended!"), author: t('about.testimonials.2.author', 'Mr. Jones, Elementary Teacher') },
    { quote: t('about.testimonials.3.quote', "I use it for mindfulness coloring. The intricate designs it generates are perfect for unwinding."), author: t('about.testimonials.3.author', 'Alex R., Hobbyist') },
  ];

  const faqs: FaqItem[] = [
    { question: t('about.faq.q1', 'How does the AI generate coloring pages?'), answer: t('about.faq.a1', "Our system uses advanced generative adversarial networks (GANs) trained on vast datasets of images and artistic styles. You provide a prompt, and the AI interprets it to create a unique line drawing suitable for coloring.") },
    { question: t('about.faq.q2', 'Is it free to use?'), answer: t('about.faq.a2', "Yes, generating coloring pages is completely free for personal and educational use. We offer optional premium features for advanced users and commercial licenses.") },
    { question: t('about.faq.q3', 'What image styles can it create?'), answer: t('about.faq.a3', "The AI can generate various styles, including cartoon, realistic, fantasy, abstract, and more. You can specify the desired style in your prompt or select from predefined options.") },
    { question: t('about.faq.q4', 'Can I use the generated images commercially?'), answer: t('about.faq.a4', "The free plan allows personal and educational use only. For commercial use, please check out our affordable licensing options or contact us for details.") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
       {/* --- New Header Section --- */}
       <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-700 py-20 px-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <div className="absolute -top-16 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl"></div>
             <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-blue-300 blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t('about.title', 'About AI Coloring Page Generator')}
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              {t('about.subtitle', 'Fueling creativity, one coloring page at a time.')}
            </p>
          </div>
       </div>

      <div className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        
        {/* --- Our Story Section --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.story.title', 'Our Story')}</h2>
            <p className="text-lg text-gray-700 mb-4">
              {t('about.story.p1', 'Born from a passion for art and technology, AI Coloring Page Generator started as a small project to explore the creative potential of artificial intelligence. We saw an opportunity to make personalized art accessible to everyone, transforming simple ideas into beautiful, ready-to-color designs.')}
            </p>
            <p className="text-lg text-gray-600">
              {t('about.story.p2', 'Our mission is to provide a fun, easy-to-use platform that sparks imagination for kids, aids relaxation for adults, and offers a valuable resource for educators and creators.')}
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-gray-100">
             <Image src="/images/about-story.jpg" alt={t('about.story.imageAlt', 'AI creating artistic patterns')} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </section>

        {/* --- Our Technology Section --- */}
        <section className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">{t('about.tech.title', 'Powered by Innovation')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="border border-gray-100 p-6 rounded-xl bg-gray-50">
              <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
                 <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.567L16.5 21.75l-.398-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.398a2.25 2.25 0 00-1.423 1.423z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('about.tech.ai.title', 'Advanced AI Model')}</h3>
              <p className="text-gray-600">{t('about.tech.ai.desc', 'Utilizing state-of-the-art generative models (GANs & Diffusion) fine-tuned for line art creation.')}</p>
            </div>
            <div className="border border-gray-100 p-6 rounded-xl bg-gray-50">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                 <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('about.tech.platform.title', 'Modern Web Platform')}</h3>
              <p className="text-gray-600">{t('about.tech.platform.desc', 'Built with Next.js 14, React, and Tailwind CSS for a fast, responsive, and scalable experience.')}</p>
            </div>
          </div>
        </section>

        {/* --- Meet the Team Section --- */}
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('about.team.title', 'Meet the Team')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <Image src={member.image} alt={member.name} width={120} height={120} className="rounded-full mx-auto mb-4 border-4 border-indigo-100" />
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Testimonials Section --- */}
        <section className="bg-gradient-to-br from-indigo-50 to-blue-50 py-16 sm:py-20 rounded-2xl px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('about.testimonials.title', 'What Our Users Say')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col">
                <svg className="w-10 h-10 text-blue-400 mb-4 flex-shrink-0" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"></path>
                </svg>
                <p className="text-gray-600 italic mb-5 flex-grow">"{testimonial.quote}"</p>
                <p className="font-semibold text-gray-800 text-right">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- FAQ Section --- */}
        <section>
           <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('about.faq.title', 'Frequently Asked Questions')}</h2>
           <FAQSection faqs={faqs} />
        </section>

        {/* --- Call to Action Section --- */}
        <section className="text-center bg-white py-16 px-6 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('about.cta.title', 'Ready to Start Coloring?')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {t('about.cta.subtitle', 'Bring your imagination to life! Generate your first unique coloring page in seconds.')}
          </p>
          <Link 
            href={getLocalizedHref('/create', lang)}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
          >
            {t('about.cta.button', 'Create a Coloring Page Now')}
          </Link>
        </section>

      </div>
    </div>
  );
} 