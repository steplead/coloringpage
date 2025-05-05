import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  // 从Supabase Auth获取当前用户
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  
  if (authError || !session?.user) {
    return res.status(401).json({ error: '未授权访问', details: authError });
  }
  
  const userId = session.user.id;
  
  // 根据请求方法处理不同操作
  switch (req.method) {
    case 'GET':
      return await getProfile(req, res, userId);
    case 'PUT':
      return await updateProfile(req, res, userId);
    default:
      return res.status(405).json({ error: '方法不允许' });
  }
}

// 获取用户个人资料
async function getProfile(req, res, userId) {
  try {
    // 查询用户资料
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      // 如果是找不到资料的错误，则为用户创建一个新资料
      if (error.code === 'PGRST116') {
        console.log('自动创建用户资料:', userId);
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId, 
            username: `user_${userId.substring(0, 8)}`,
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();
          
        if (createError) {
          console.error('创建资料失败:', createError);
          return res.status(500).json({ error: '创建资料失败', details: createError });
        }
        
        return res.status(200).json(newProfile);
      }
      
      console.error('获取资料失败:', error);
      return res.status(500).json({ error: '获取资料失败', details: error });
    }
    
    return res.status(200).json(data);
  } catch (err) {
    console.error('处理用户资料请求时错误:', err);
    return res.status(500).json({ error: '服务器错误', details: err.message });
  }
}

// 更新用户个人资料
async function updateProfile(req, res, userId) {
  const { username, displayName, bio, avatarUrl } = req.body;
  
  // 验证输入
  if (!username) {
    return res.status(400).json({ error: '用户名不能为空' });
  }
  
  try {
    // 检查用户名是否已被占用
    if (username) {
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', userId)
        .single();
        
      if (existingUser) {
        return res.status(400).json({ error: '用户名已被占用' });
      }
    }
    
    // 更新用户资料
    const updates = {
      username,
      ...(displayName && { display_name: displayName }),
      ...(bio && { bio }),
      ...(avatarUrl && { avatar_url: avatarUrl }),
      updated_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('更新资料失败:', error);
      return res.status(500).json({ error: '更新资料失败', details: error });
    }
    
    return res.status(200).json(data);
  } catch (err) {
    console.error('处理更新用户资料请求时错误:', err);
    return res.status(500).json({ error: '服务器错误', details: err.message });
  }
} 