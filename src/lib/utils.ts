import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并并优化CSS类名
 * 使用clsx组合条件类名，然后使用tailwind-merge优化Tailwind类
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 