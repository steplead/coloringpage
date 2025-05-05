import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, signOut } from '../lib/supabase';

// 创建上下文
const AuthContext = createContext();

// 上下文提供者组件
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化和会话监听
  useEffect(() => {
    // 获取当前用户
    const getUser = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          setUser(session.user);
        }
      } catch (err) {
        console.error('获取会话出错:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // 清理函数
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // 登出功能
  const logout = async () => {
    setLoading(true);
    const { error } = await signOut();
    if (error) {
      console.error('登出错误:', error);
    }
    setUser(null);
    setLoading(false);
  };

  // 暴露的上下文值
  const value = {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 自定义hook，方便使用上下文
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
} 