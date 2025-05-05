import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  // 从Supabase Auth获取当前用户
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return res.status(401).json({ error: '未授权访问' });
  }
  
  // 根据请求方法处理不同操作
  switch (req.method) {
    case 'GET':
      return await getUserArtworks(req, res, user.id);
    case 'POST':
      return await saveArtwork(req, res, user.id);
    case 'DELETE':
      return await deleteArtwork(req, res, user.id);
    default:
      return res.status(405).json({ error: '方法不允许' });
  }
}

// 获取用户作品列表
async function getUserArtworks(req, res, userId) {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    return res.status(500).json({ error: '获取作品失败', details: error });
  }
  
  return res.status(200).json(data);
}

// 保存新作品
async function saveArtwork(req, res, userId) {
  const { title, description, image_data, thumbnail, is_public } = req.body;
  
  if (!image_data) {
    return res.status(400).json({ error: '作品图像不能为空' });
  }
  
  // 将Base64图像数据保存到Supabase Storage
  const fileData = image_data.replace(/^data:image\/\w+;base64,/, '');
  const filename = `artwork_${userId}_${new Date().getTime()}.png`;
  
  // 上传完整图像
  const { data: imageData, error: imageError } = await supabase.storage
    .from('artworks')
    .upload(`${userId}/${filename}`, Buffer.from(fileData, 'base64'), {
      contentType: 'image/png',
      upsert: false
    });
    
  if (imageError) {
    return res.status(500).json({ error: '保存图像失败', details: imageError });
  }
  
  // 获取图像URL
  const { data: { publicUrl: imageUrl } } = supabase.storage
    .from('artworks')
    .getPublicUrl(`${userId}/${filename}`);
    
  // 上传缩略图（如果有）
  let thumbnailUrl = null;
  if (thumbnail) {
    const thumbnailData = thumbnail.replace(/^data:image\/\w+;base64,/, '');
    const thumbnailFilename = `thumbnail_${userId}_${new Date().getTime()}.png`;
    
    const { data: thumbData, error: thumbError } = await supabase.storage
      .from('artworks')
      .upload(`${userId}/thumbnails/${thumbnailFilename}`, Buffer.from(thumbnailData, 'base64'), {
        contentType: 'image/png',
        upsert: false
      });
      
    if (!thumbError) {
      const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(`${userId}/thumbnails/${thumbnailFilename}`);
        
      thumbnailUrl = publicUrl;
    }
  }
  
  // 保存作品记录到数据库
  const { data, error } = await supabase
    .from('artworks')
    .insert([
      {
        user_id: userId,
        title: title || `作品 ${new Date().toLocaleDateString()}`,
        description: description || '',
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
        is_public: is_public === undefined ? false : is_public,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
    
  if (error) {
    return res.status(500).json({ error: '保存作品记录失败', details: error });
  }
  
  return res.status(201).json(data);
}

// 删除作品
async function deleteArtwork(req, res, userId) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: '缺少作品ID' });
  }
  
  // 先获取作品信息，确认是否属于当前用户并获取相关文件路径
  const { data: artwork, error: fetchError } = await supabase
    .from('artworks')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
    
  if (fetchError || !artwork) {
    return res.status(404).json({ error: '作品不存在或不属于当前用户' });
  }
  
  // 从URL中提取文件路径
  const getFilePathFromUrl = (url) => {
    try {
      const path = new URL(url).pathname;
      // 移除存储桶名称及路径前缀，得到相对路径
      return path.split('/').slice(2).join('/');
    } catch (e) {
      return null;
    }
  };
  
  // 删除存储中的图像文件
  if (artwork.image_url) {
    const filePath = getFilePathFromUrl(artwork.image_url);
    if (filePath) {
      await supabase.storage.from('artworks').remove([filePath]);
    }
  }
  
  // 删除存储中的缩略图文件
  if (artwork.thumbnail_url) {
    const thumbPath = getFilePathFromUrl(artwork.thumbnail_url);
    if (thumbPath) {
      await supabase.storage.from('artworks').remove([thumbPath]);
    }
  }
  
  // 删除数据库中的作品记录
  const { error: deleteError } = await supabase
    .from('artworks')
    .delete()
    .eq('id', id);
    
  if (deleteError) {
    return res.status(500).json({ error: '删除作品失败', details: deleteError });
  }
  
  return res.status(200).json({ success: true, message: '作品已成功删除' });
} 