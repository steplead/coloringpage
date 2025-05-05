import { supabase } from '../../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  // 从Supabase Auth获取当前用户
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  
  if (authError || !session?.user) {
    return res.status(401).json({ error: '未授权访问', details: authError });
  }
  
  const userId = session.user.id;
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: '用户名不能为空' });
  }
  
  try {
    // 检查用户资料是否已存在
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (existingProfile) {
      // 用户资料已存在，直接返回
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      return res.status(200).json(data);
    }
    
    // 创建新的用户资料
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          username,
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();
      
    if (error) {
      console.error('创建用户资料失败:', error);
      return res.status(500).json({ error: '创建资料失败', details: error });
    }
    
    return res.status(201).json(data);
  } catch (err) {
    console.error('处理用户资料创建时出错:', err);
    return res.status(500).json({ error: '服务器错误', details: err.message });
  }
} 