import { BlogPostTemplateProps } from './postTemplate';
import { generateBlogPost, getPopularKeywords } from './generator';

type PublishConfig = {
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  startTime: string; // ISO time string
  enabled: boolean;
  categories?: string[];
};

/**
 * Manages automatic blog post publishing based on a schedule
 * This ensures consistent content creation for SEO purposes
 */
export class BlogAutoPublisher {
  private config: PublishConfig;
  private db: any; // In real implementation, this would be your database client
  
  constructor(config: PublishConfig, dbClient: any) {
    this.config = config;
    this.db = dbClient;
  }
  
  /**
   * Initialize the auto-publisher with a publishing schedule
   */
  public initialize(): void {
    if (!this.config.enabled) {
      console.log('Auto-publisher is disabled');
      return;
    }
    
    // Set up the publishing schedule based on frequency
    const interval = this.getIntervalMilliseconds();
    
    // Schedule the first run
    const nextRunTime = new Date(this.config.startTime).getTime();
    const now = Date.now();
    
    const timeUntilFirstRun = nextRunTime > now ? 
      nextRunTime - now : 
      interval - ((now - nextRunTime) % interval);
    
    setTimeout(() => {
      this.publishPosts();
      
      // Then set it to run on the regular interval
      setInterval(() => this.publishPosts(), interval);
    }, timeUntilFirstRun);
    
    console.log(`Auto-publisher scheduled to run in ${Math.round(timeUntilFirstRun / 1000 / 60)} minutes`);
  }
  
  /**
   * Get the interval in milliseconds based on the configured frequency
   */
  private getIntervalMilliseconds(): number {
    switch (this.config.frequency) {
      case 'daily':
        return 24 * 60 * 60 * 1000;
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000;
      case 'monthly':
        return 30 * 24 * 60 * 60 * 1000;
      default:
        return 24 * 60 * 60 * 1000; // Default to daily
    }
  }
  
  /**
   * Publish a batch of blog posts according to the schedule
   */
  private async publishPosts(): Promise<void> {
    try {
      console.log(`Running scheduled post publisher, target: ${this.config.targetCount} posts`);
      
      // Get popular keywords for SEO optimization
      const keywords = getPopularKeywords();
      
      // Create the target number of posts
      const posts: BlogPostTemplateProps[] = [];
      
      for (let i = 0; i < this.config.targetCount; i++) {
        // Select keywords intelligently to avoid duplication and target SEO opportunities
        const keyword = keywords[i % keywords.length];
        const topic = `${keyword} for ${i % 2 === 0 ? 'Kids' : 'Adults'}`;
        
        // Generate SEO-optimized blog post content
        const post = await generateBlogPost(topic, keyword);
        posts.push(post);
        
        // In a real implementation, you would save to database here
        await this.savePost(post);
        
        // Avoid rate limits on external APIs
        if (i < this.config.targetCount - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      console.log(`Successfully published ${posts.length} new blog posts`);
    } catch (error) {
      console.error('Error in auto-publisher:', error);
    }
  }
  
  /**
   * Save a generated blog post to the database
   * In a real implementation, this would connect to your actual database
   */
  private async savePost(post: BlogPostTemplateProps): Promise<void> {
    // Simulate database save operation
    console.log(`Saving post: ${post.title}`);
    
    // In a real implementation, you would:
    // await this.db.blogPosts.create({
    //   data: {
    //     title: post.title,
    //     slug: post.slug,
    //     content: JSON.stringify(post),
    //     publishedAt: new Date(),
    //     ...other fields
    //   }
    // });
    
    // For demo purposes, just log that it would be saved
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Post "${post.title}" saved with slug "${post.slug}"`);
  }
  
  /**
   * Generate the XML sitemap entry for this blog post
   * This helps search engines discover and index the content
   */
  private generateSitemapEntry(post: BlogPostTemplateProps): string {
    const lastmod = new Date(post.modifiedDate).toISOString();
    return `
      <url>
        <loc>https://ai-coloringpage.com/blog/${post.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
  }
  
  /**
   * Update the sitemap after publishing new posts
   * This ensures search engines can discover your new content
   */
  private async updateSitemap(): Promise<void> {
    // In a real implementation, you would:
    // 1. Read the current sitemap
    // 2. Add entries for new blog posts
    // 3. Write the updated sitemap
    console.log('Updated sitemap with new blog posts');
  }
}

/**
 * Create a default auto-publisher configuration
 */
export function getDefaultPublisherConfig(): PublishConfig {
  return {
    frequency: 'daily',
    targetCount: 1,
    startTime: new Date(new Date().setHours(1, 0, 0, 0)).toISOString(), // 1:00 AM
    enabled: true,
    categories: ['Coloring Techniques', 'Educational Content', 'Art Therapy']
  };
} 