import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '../components/layouts/main-layout';
import AuthForm from '../components/ui/auth-form';
import { useAuth } from '../contexts/auth-context';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const backgroundImagePath = '/ghibli-assets/backgrounds/referenceuistyle.jpeg';

  // Redirect to profile page if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/profile');
    }
  }, [user, loading, router]);

  const handleAuthSuccess = (user) => {
    // Redirect to profile page after successful login
    router.push('/profile');
  };

  return (
    <MainLayout
      title="Login | AI Coloring Page"
      backgroundImage={backgroundImagePath}
    >
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Welcome to the Magic Coloring World
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Login or register to save your artworks, join community sharing, and experience more magical features
          </p>
        </motion.div>

        <AuthForm onSuccess={handleAuthSuccess} />

        <div className="mt-8 text-center">
          <Link href="/" className="inline-block px-6 py-2 rounded-full bg-white/80 hover:bg-white text-ghibli-dark-brown border border-ghibli-light-brown/30 shadow-ghibli-sm transition-all duration-300">
            Back to Home
          </Link>
        </div>
      </div>
    </MainLayout>
  );
} 