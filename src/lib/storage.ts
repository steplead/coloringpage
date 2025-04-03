import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * 存储图片到Supabase Storage
 * @param imageUrl 外部图片URL
 * @param prompt 提示词，用于生成文件名
 * @returns 存储后的图片URL
 */
export async function storeImageFromUrl(imageUrl: string, prompt: string): Promise<string> {
  try {
    console.log('Fetching image from URL:', imageUrl);
    
    // 从外部URL获取图片数据
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    // 获取图片数据
    const imageData = await response.arrayBuffer();
    
    // 创建一个唯一的文件名
    const fileName = generateFileName(prompt);
    
    // 获取图片类型，默认为jpeg
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const fileExtension = getFileExtension(contentType);
    
    // 上传到Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`${fileName}.${fileExtension}`, imageData, {
        contentType,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image to Supabase Storage:', error);
      throw error;
    }
    
    console.log('Successfully uploaded image to Supabase Storage:', data.path);
    
    // 获取公共URL
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(data.path);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in storeImageFromUrl:', error);
    throw error;
  }
}

/**
 * 根据提示词生成文件名
 * @param prompt 提示词
 * @returns 生成的文件名
 */
function generateFileName(prompt: string): string {
  // 从提示词中提取前3个词，并转为小写，移除特殊字符
  const words = prompt
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter(w => w.length > 0)
    .slice(0, 3)
    .join('-');
  
  // 添加时间戳和UUID前8位，确保唯一性
  const timestamp = new Date().getTime();
  const uuid = uuidv4().split('-')[0];
  
  return `${words}-${timestamp}-${uuid}`;
}

/**
 * 根据MIME类型获取文件扩展名
 * @param contentType MIME类型
 * @returns 文件扩展名
 */
function getFileExtension(contentType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  };
  
  return mimeToExt[contentType] || 'jpg';
}

/**
 * 初始化Supabase Storage存储桶
 * 确保'images'存储桶存在，如果不存在则创建
 */
export async function initializeStorage(): Promise<void> {
  try {
    // 检查images存储桶是否存在
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing storage buckets:', error);
      throw error;
    }
    
    const imagesBucketExists = buckets.some(bucket => bucket.name === 'images');
    
    // 如果不存在，创建images存储桶
    if (!imagesBucketExists) {
      console.log('Creating images bucket in Supabase Storage');
      
      const { error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml']
      });
      
      if (createError) {
        console.error('Error creating images bucket:', createError);
        throw createError;
      }
      
      console.log('Successfully created images bucket');
    } else {
      console.log('Images bucket already exists in Supabase Storage');
    }
  } catch (error) {
    console.error('Error initializing Supabase Storage:', error);
    throw error;
  }
} 