import { redirect } from 'next/navigation';

// 重定向根页面到默认语言（英文）
export default function RootPage() {
  redirect('/en');
  return null; // 永远不会执行，但需要返回一个有效的React元素
} 