import GhibliBackground from '../ghibli/background';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../contexts/auth-context';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

/**
 * Main Layout Component
 * 提供网站的主要布局结构
 */
const MainLayout = ({ children, title = 'Magic Coloring World', backgroundImage = null }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Create beautiful coloring pages in Ghibli style with AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div 
        className="min-h-screen bg-gradient-to-b from-ghibli-sky-start to-ghibli-sky-end relative overflow-hidden"
        style={backgroundImage && typeof backgroundImage === 'string' ? { 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {}}
      >
        {/* Navigation Bar */}
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-md shadow-ghibli-sm border-b border-white/30"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-ghibli text-gradient-primary font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-ghibli-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Magic Coloring
              </Link>
              
              <div className="flex space-x-4 items-center">
                <div className="flex items-center space-x-8">
                  <Link 
                    href="/" 
                    className={`text-ghibli-dark-brown hover:text-gradient-primary transition-all duration-300 ${router.pathname === '/' ? 'font-semibold text-gradient-primary' : ''}`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-7m-6 0l2 2" />
                      </svg>
                      Home
                    </span>
                  </Link>
                  <Link 
                    href="/coloring" 
                    className={`text-ghibli-dark-brown hover:text-gradient-primary transition-all duration-300 ${router.pathname === '/coloring' ? 'font-semibold text-gradient-primary' : ''}`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Create Art
                    </span>
                  </Link>
                  <Link 
                    href="/gallery" 
                    className={`text-ghibli-dark-brown hover:text-gradient-primary transition-all duration-300 ${router.pathname.startsWith('/gallery') ? 'font-semibold text-gradient-primary' : ''}`}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Gallery
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.nav>
        
        {/* Main Content */}
        <main className="pb-20">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-ghibli-primary/10 backdrop-blur-md py-5 text-center text-white/90 text-sm absolute bottom-0 w-full border-t border-white/20 shadow-ghibli-inner">
          <div className="container mx-auto px-4">
            <p className="flex justify-center items-center">
              <span className="mr-2">Magic Coloring World</span>
              <span className="mx-2">•</span>
              <span className="text-ghibli-accent">Created with 💫 and AI</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MainLayout; 