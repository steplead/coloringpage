import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '../components/layouts/main-layout';
import { useAuth } from '../contexts/auth-context';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const backgroundImagePath = '/ghibli-assets/backgrounds/referenceuistyle.jpeg';

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 获取用户资料和作品
  useEffect(() => {
    if (user) {
      console.log("Current user ID:", user.id);
      
      const fetchProfileData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          // 直接从客户端调用Supabase
          const { supabase } = await import('../lib/supabase');
          
          // 1. 检查资料是否存在
          const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (checkError && checkError.code === 'PGRST116') {
            console.log('Profile does not exist, creating new profile');
            // 2. 不存在则创建
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: user.id, 
                  username: user.email.split('@')[0],
                  updated_at: new Date().toISOString()
                }
              ])
              .select('*')
              .single();
            
            if (createError) {
              console.error('Failed to create profile directly:', createError);
              throw new Error(`Failed to create profile: ${createError.message}`);
            }
            
            setProfile(newProfile);
          } else if (checkError) {
            console.error('Failed to check profile:', checkError);
            throw new Error(`Failed to check profile: ${checkError.message}`);
          } else {
            console.log('Found existing profile');
            setProfile(existingProfile);
          }
          
          // 获取用户作品
          try {
            const { data: artworks, error: artworksError } = await supabase
              .from('artworks')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });
            
            if (artworksError) {
              console.warn('Failed to get artworks:', artworksError);
              setArtworks([]);
            } else {
              setArtworks(artworks || []);
            }
          } catch (artErr) {
            console.warn('Error getting artworks:', artErr);
            setArtworks([]);
          }
        } catch (err) {
          console.error('Error getting user data:', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProfileData();
    }
  }, [user]);

  // 处理登出
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading || isLoading) {
    return (
      <MainLayout 
        title="Profile | Ghibli Style Coloring App"
        backgroundImage={backgroundImagePath}
      >
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-white text-lg">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Profile | Ghibli Style Coloring App"
      backgroundImage={backgroundImagePath}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Profile
            </h1>
            {profile && (
              <p className="text-white/90 mt-2">
                Welcome back, <span className="font-bold">{profile.username || user.email}</span>
              </p>
            )}
          </motion.div>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/coloring" className="px-4 py-2 rounded-full bg-white/80 hover:bg-white text-ghibli-dark-brown border border-ghibli-light-brown/30 shadow-ghibli-sm transition-all duration-300">
              Back to Drawing Tool
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-ghibli-primary/80 hover:bg-ghibli-primary text-white border border-white/20 shadow-ghibli-sm transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* 用户资料卡片 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-ghibli-light-brown/20 mb-8">
          <h2 className="text-xl font-bold mb-4 text-ghibli-dark-brown">Account Information</h2>
          
          <div className="space-y-2">
            <p><span className="font-medium text-ghibli-dark-brown/80">Email:</span> {user?.email}</p>
            <p>
              <span className="font-medium text-ghibli-dark-brown/80">Username:</span> {profile?.username || 'Not set'}
            </p>
            <p>
              <span className="font-medium text-ghibli-dark-brown/80">Registered:</span> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
          
          <div className="mt-4">
            <Link 
              href="/profile/edit" 
              className="inline-block px-4 py-2 bg-ghibli-secondary/80 hover:bg-ghibli-secondary text-white rounded-full text-sm border border-white/20 shadow-sm"
            >
              Edit Profile
            </Link>
          </div>
        </div>
        
        {/* 用户作品 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-ghibli-light-brown/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ghibli-dark-brown">My Artworks</h2>
            <Link 
              href="/gallery/my-artworks" 
              className="text-ghibli-primary hover:text-ghibli-primary/80 text-sm"
            >
              View All
            </Link>
          </div>
          
          {artworks.length === 0 ? (
            <div className="text-center py-10 bg-white/50 rounded-xl">
              <p className="text-ghibli-dark-brown/80 mb-4">You haven't saved any artworks yet</p>
              <Link 
                href="/coloring" 
                className="inline-block px-6 py-2 bg-ghibli-primary text-white rounded-full border border-white/20 shadow-sm"
              >
                Start Creating
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {artworks.slice(0, 4).map((artwork) => (
                <motion.div 
                  key={artwork.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={artwork.thumbnail_url || artwork.image_url} 
                      alt={artwork.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-ghibli-dark-brown truncate">{artwork.title}</h3>
                    <p className="text-xs text-ghibli-dark-brown/60">
                      {new Date(artwork.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 