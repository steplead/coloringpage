import { useState } from 'react';
import { motion } from 'framer-motion';
import { signIn, signUp } from '../../lib/supabase';

export default function AuthForm({ onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        if (onSuccess) onSuccess(data.user);
      } else {
        // Register
        const { data, error } = await signUp(email, password);
        if (error) throw error;
        if (onSuccess) onSuccess(data.user);
        // Show verification email notification
        setError({ message: 'Registration successful! Please check your email to complete verification.', type: 'success' });
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError({ message: err.message || 'An error occurred during authentication', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-ghibli-light-brown/20">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-ghibli-dark-brown font-ghibli text-center">
          {isLogin ? 'Welcome Back' : 'Create New Account'}
        </h2>
        
        {error && (
          <div className={`mb-4 p-3 rounded-lg ${error.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {error.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="email" 
              className="block text-ghibli-dark-brown/80 mb-1 font-medium"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border-2 border-ghibli-light-brown/30 bg-ghibli-warm-white/90 focus:ring-2 focus:ring-ghibli-accent/50 focus:border-ghibli-accent"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-ghibli-dark-brown/80 mb-1 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl border-2 border-ghibli-light-brown/30 bg-ghibli-warm-white/90 focus:ring-2 focus:ring-ghibli-accent/50 focus:border-ghibli-accent"
              placeholder="Your password"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-ghibli-primary hover:bg-ghibli-primary/90 text-white border-2 border-white/20 shadow-md transition-all duration-300 transform hover:scale-102 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isLogin ? 'Log In' : 'Register'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-ghibli-primary hover:text-ghibli-primary/80 font-medium"
          >
            {isLogin ? 'No account? Create one' : 'Already have an account? Log in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
} 