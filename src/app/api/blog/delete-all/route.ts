import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 管理员密钥（生产环境中应该从环境变量获取）
const ADMIN_KEY = process.env.ADMIN_API_KEY || 'admin-secret-key';

/**
 * DELETE handler to remove all blog posts
 * This endpoint is for administrative use only
 */
export async function DELETE(request: NextRequest) {
  try {
    console.log('Attempting to delete all blog posts...');
    
    // 验证管理员密钥
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('Unauthorized attempt to delete blog posts: Missing authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 提取并验证令牌
    const token = authHeader.split(' ')[1];
    if (token !== ADMIN_KEY) {
      console.warn('Unauthorized attempt to delete blog posts: Invalid admin key');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 获取文章数量以便报告
    const { count: postCount, error: countError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting blog posts:', countError);
      return NextResponse.json(
        { error: 'Failed to count existing blog posts' },
        { status: 500 }
      );
    }
    
    // 删除所有博客文章
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .neq('id', 'placeholder'); // 这个条件会匹配所有行
    
    if (error) {
      console.error('Error deleting blog posts:', error);
      return NextResponse.json(
        { error: 'Failed to delete blog posts' },
        { status: 500 }
      );
    }
    
    console.log(`Successfully deleted ${postCount} blog posts`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${postCount} blog posts`
    });
  } catch (error) {
    console.error('Exception deleting blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog posts' },
      { status: 500 }
    );
  }
} 