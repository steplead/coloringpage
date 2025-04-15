/**
 * Blog Content Analyzer
 * 
 * Utility functions for analyzing blog post content to detect duplication,
 * measure uniqueness, and enhance SEO performance.
 */

import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

/**
 * Content similarity threshold (percentage of similarity that's considered duplicate)
 */
const SIMILARITY_THRESHOLD = 0.7;

/**
 * Interface for blog post content analysis results
 */
export interface ContentAnalysisResult {
  uniquenessScore: number;         // 0-100 with 100 being completely unique
  similarPosts: SimilarPost[];     // List of similar posts if any
  isDuplicate: boolean;            // Whether this is likely a duplicate
  contentHash: string;             // Hash of the content for future comparisons
  keywordDensity: number;          // Keyword density percentage
  readabilityScore: number;        // 0-100 score for readability
  wordCount: number;               // Total word count
  recommendations: string[];       // List of improvement recommendations
}

/**
 * Interface for similar post data
 */
interface SimilarPost {
  id: string;
  slug: string;
  title: string;
  similarityScore: number;  // 0-1 with 1 being identical
}

/**
 * Analyze blog post content for uniqueness and SEO metrics
 */
export async function analyzeContent(
  content: string, 
  title: string, 
  primaryKeyword: string
): Promise<ContentAnalysisResult> {
  // Default values
  const result: ContentAnalysisResult = {
    uniquenessScore: 100,
    similarPosts: [],
    isDuplicate: false,
    contentHash: '',
    keywordDensity: 0,
    readabilityScore: 70,
    wordCount: 0,
    recommendations: []
  };

  try {
    // Clean content (remove HTML tags for analysis)
    const cleanContent = content.replace(/<[^>]*>/g, ' ');
    
    // Generate content hash
    try {
      result.contentHash = generateContentHash(cleanContent);
    } catch (hashError) {
      console.error('Error generating content hash:', hashError);
      result.contentHash = fallbackGenerateHash(cleanContent);
    }
    
    // Calculate word count
    try {
      result.wordCount = countWords(cleanContent);
    } catch (countError) {
      console.error('Error counting words:', countError);
      // Fallback word count
      result.wordCount = cleanContent.split(/\s+/).filter(Boolean).length;
    }
    
    // Calculate keyword density
    try {
      result.keywordDensity = calculateKeywordDensity(cleanContent, primaryKeyword);
    } catch (keywordError) {
      console.error('Error calculating keyword density:', keywordError);
      // Fallback to a default value
      result.keywordDensity = 1.5;
    }
    
    // Check for similar posts in database
    let similarPosts: SimilarPost[] = [];
    try {
      // Only attempt similarity check if we have a content hash
      if (result.contentHash) {
        similarPosts = await findSimilarPosts(result.contentHash, cleanContent, title);
        result.similarPosts = similarPosts;
      }
    } catch (similarityError) {
      console.error('Error finding similar posts:', similarityError);
      // Leave similarPosts as empty array
    }
    
    // Determine if content is duplicate based on similar posts
    if (similarPosts.length > 0) {
      result.isDuplicate = similarPosts.some(post => post.similarityScore > SIMILARITY_THRESHOLD);
      
      // Calculate uniqueness score based on similarity to existing content
      const highestSimilarity = Math.max(...similarPosts.map(post => post.similarityScore));
      result.uniquenessScore = Math.round(100 - (highestSimilarity * 100));
    }
    
    // Calculate readability score
    try {
      result.readabilityScore = calculateReadabilityScore(cleanContent);
    } catch (readabilityError) {
      console.error('Error calculating readability score:', readabilityError);
      // Default to average readability
      result.readabilityScore = 70;
    }
    
    // Generate recommendations
    try {
      result.recommendations = generateRecommendations(result, primaryKeyword);
    } catch (recommendationsError) {
      console.error('Error generating recommendations:', recommendationsError);
      // Provide basic recommendation
      result.recommendations = ['Consider enhancing this content with more specific details.'];
    }
    
    return result;
  } catch (error) {
    console.error('Error analyzing content:', error);
    // Return basic analysis with default values
    return {
      uniquenessScore: 85,
      similarPosts: [],
      isDuplicate: false,
      contentHash: fallbackGenerateHash(content),
      keywordDensity: 1.0,
      readabilityScore: 70,
      wordCount: content.split(/\s+/).filter(Boolean).length,
      recommendations: ['Consider expanding this content with more specific information.']
    };
  }
}

/**
 * Generate a content hash for quick similarity detection
 */
function generateContentHash(content: string): string {
  // Get first 1000 chars to get the general content identity while ignoring minor changes
  const contentSample = content.substring(0, 1000);
  return crypto.createHash('md5').update(contentSample).digest('hex');
}

/**
 * Count words in content
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculate keyword density
 */
function calculateKeywordDensity(content: string, keyword: string): number {
  const totalWords = countWords(content);
  if (totalWords === 0) return 0;
  
  // Count occurrences of keyword (case insensitive)
  const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');
  const matches = content.match(keywordRegex) || [];
  
  return (matches.length / totalWords) * 100;
}

/**
 * Simple readability score calculation (Flesch-Kincaid simplified)
 */
function calculateReadabilityScore(content: string): number {
  // Count sentences, words, and syllables
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = content.split(/\s+/).filter(w => w.match(/[a-z0-9]/i));
  
  if (sentences.length === 0 || words.length === 0) return 50;
  
  // Calculate average sentence length
  const avgSentenceLength = words.length / sentences.length;
  
  // Calculate average word length as proxy for syllables
  const avgWordLength = content.replace(/[^a-z0-9]/gi, '').length / words.length;
  
  // Simplified Flesch-Kincaid calculation (higher is more readable)
  let score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * (avgWordLength / 5));
  
  // Convert to 0-100 scale
  score = Math.min(100, Math.max(0, Math.round(score)));
  
  return score;
}

/**
 * Simple fallback hash generator that works in any environment
 */
function fallbackGenerateHash(content: string): string {
  let hash = 0;
  const sample = content.substring(0, 1000);
  for (let i = 0; i < sample.length; i++) {
    const char = sample.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

/**
 * Find similar posts in the database
 */
async function findSimilarPosts(
  contentHash: string, 
  content: string, 
  title: string
): Promise<SimilarPost[]> {
  try {
    // First try exact hash match (very fast)
    try {
      const { data: exactMatches } = await supabase
        .from('blog_posts')
        .select('id, slug, title, content')
        .eq('content_hash', contentHash)
        .limit(5);
        
      // If exact matches found, calculate similarity
      if (exactMatches && exactMatches.length > 0) {
        return exactMatches.map(post => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          similarityScore: calculateSimilarity(content, post.content.replace(/<[^>]*>/g, ' '))
        }));
      }
    } catch (hashQueryError) {
      console.error('Error querying by content hash:', hashQueryError);
      // Continue to alternative search method
    }
    
    // Otherwise look for similar titles or content patterns
    try {
      // Sanitize inputs for database query - remove any problematic characters
      const safeTitle = title.substring(0, 20).replace(/['"%]/g, '');
      const safeContent = content.substring(0, 100).replace(/['"%]/g, '');
      
      const { data: potentialMatches } = await supabase
        .from('blog_posts')
        .select('id, slug, title, content')
        .or(`title.ilike.%${safeTitle}%,content.ilike.%${safeContent}%`)
        .limit(10);
        
      if (!potentialMatches || potentialMatches.length === 0) {
        return [];
      }
      
      // Calculate similarity for potential matches
      const similarPosts = potentialMatches.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        similarityScore: calculateSimilarity(content, post.content.replace(/<[^>]*>/g, ' '))
      }));
      
      // Only return posts with some meaningful similarity
      return similarPosts
        .filter(post => post.similarityScore > 0.3)
        .sort((a, b) => b.similarityScore - a.similarityScore);
    } catch (textSearchError) {
      console.error('Error performing text search:', textSearchError);
      return [];
    }
        
  } catch (error) {
    console.error('Error finding similar posts:', error);
    return [];
  }
}

/**
 * Calculate similarity between two text strings
 * Using Jaccard similarity of content chunks
 */
function calculateSimilarity(text1: string, text2: string): number {
  try {
    // Split text into chunks (words)
    const chunks1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 4));
    const chunks2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 4));
    
    // Calculate intersection size - using Array.from to fix Set iteration issues
    const chunks1Array = Array.from(chunks1);
    const intersection = new Set(chunks1Array.filter(x => chunks2.has(x)));
    
    // Calculate union size - using Array.from to fix Set iteration issues
    const union = new Set([...Array.from(chunks1), ...Array.from(chunks2)]);
    
    // Jaccard similarity
    return intersection.size / union.size;
  } catch (error) {
    console.error('Error calculating similarity:', error);
    return 0;
  }
}

/**
 * Generate content improvement recommendations
 */
function generateRecommendations(
  analysis: ContentAnalysisResult,
  primaryKeyword: string
): string[] {
  const recommendations: string[] = [];
  
  // Uniqueness recommendations
  if (analysis.isDuplicate) {
    recommendations.push('Content appears to be too similar to existing posts. Consider rewriting with a different angle or perspective.');
  } else if (analysis.uniquenessScore < 70) {
    recommendations.push('Content has significant overlap with existing posts. Try adding more unique information or examples.');
  }
  
  // Keyword density recommendations
  if (analysis.keywordDensity < 0.5) {
    recommendations.push(`Increase the usage of primary keyword "${primaryKeyword}" to improve SEO (aim for 1-2%).`);
  } else if (analysis.keywordDensity > 3) {
    recommendations.push(`Keyword density for "${primaryKeyword}" is too high (${analysis.keywordDensity.toFixed(1)}%). Reduce to avoid keyword stuffing.`);
  }
  
  // Word count recommendations
  if (analysis.wordCount < 800) {
    recommendations.push('Content is quite short. Consider expanding to at least 1000 words for better SEO performance.');
  } else if (analysis.wordCount > 3000) {
    recommendations.push('Content is very long. Consider breaking into multiple posts or adding clear subheadings for readability.');
  }
  
  // Readability recommendations
  if (analysis.readabilityScore < 60) {
    recommendations.push('Content readability is low. Try using shorter sentences and simpler language.');
  }
  
  return recommendations;
}

/**
 * Calculate an overall SEO score based on various metrics
 */
export function calculateSeoScore(analysis: ContentAnalysisResult): number {
  // Weight factors for different components
  const weights = {
    uniqueness: 0.3,
    readability: 0.2,
    keywordDensity: 0.15,
    wordCount: 0.15,
    recommendations: 0.2
  };
  
  // Score for keyword density (optimal is 1-2%)
  const keywordDensityScore = analysis.keywordDensity < 0.5 ? 
    analysis.keywordDensity * 100 : 
    analysis.keywordDensity > 3 ? 
      Math.max(0, 100 - (analysis.keywordDensity - 3) * 20) : 
      100;
  
  // Score for word count (optimal is 1500-2500)
  const wordCountScore = analysis.wordCount < 800 ? 
    analysis.wordCount / 8 : 
    analysis.wordCount > 3000 ? 
      Math.max(0, 100 - (analysis.wordCount - 3000) / 20) : 
      100;
  
  // Score for recommendations (fewer is better)
  const recommendationsScore = Math.max(0, 100 - (analysis.recommendations.length * 20));
  
  // Calculate final score
  const seoScore = 
    (analysis.uniquenessScore * weights.uniqueness) +
    (analysis.readabilityScore * weights.readability) +
    (keywordDensityScore * weights.keywordDensity) +
    (wordCountScore * weights.wordCount) +
    (recommendationsScore * weights.recommendations);
  
  return Math.round(seoScore);
}
