# AI Coloring Page Generator by JL

Create custom coloring pages instantly with AI. This project uses Next.js 14 and the SiliconFlow API to generate beautiful coloring pages. Perfect for parents, teachers, and anyone who loves coloring!

## Live Demo

🎨 Try it now: [AI Coloring Page Generator](https://ai-coloringpage.com)

## About

This project was created by JL to make it easy for anyone to generate custom coloring pages using AI technology. Whether you're a teacher looking for educational materials, a parent wanting to entertain your kids, or just someone who enjoys coloring - this tool is for you!

## Features

- 🎨 Generate custom coloring pages using AI
- ✏️ Clean, black outline style perfect for coloring
- 📱 Responsive design for all devices
- ⚡ Server-side rendering for optimal performance
- 🔒 Secure API access and configuration
- 🖨️ Easy to print and share
- 🎛️ Advanced mode for complete prompt control
- 🎭 Multiple style options (Simple, Medium, Complex, Cartoon, Realistic)
- 📚 Category suggestions for inspiration
- 🖼️ Browse community gallery of coloring pages
- 📄 Print-optimized view for perfect printing results
- 💾 Database integration for saving and sharing creations
- 🌐 Internationalization (i18n) with support for multiple languages
- 🔄 Automatic language detection based on browser settings
- 📰 Auto-generated Blog with SEO-optimized educational coloring content
- 🔐 Admin dashboard for content management

## How to Use

### Standard Mode

1. Type a description of what you want to color
2. Select a style (Simple, Medium, Complex, Cartoon, or Realistic)
3. Optionally choose a category for suggestions
4. Click "Generate Coloring Page"
5. Download or print your coloring page

### Advanced Mode

For experienced users who want complete control over the AI generation:

1. Toggle "Advanced Mode"
2. Enter a custom prompt with all details
3. For best results, include "black outline coloring page, clean lines" in your prompt
4. Click "Generate Coloring Page"

### Gallery

Explore a collection of community-created coloring pages:

1. Navigate to the "Gallery" page from the main navigation
2. Browse through the available coloring pages
3. Click on any image to view details and options
4. Use the "View" button to see the full page
5. Use the "Print" button to open a print-optimized version
6. Follow the printing instructions for best results

### Blog

Discover educational articles about coloring and creative activities:

1. Visit the "Blog" section from the main navigation
2. Browse through articles about coloring benefits, techniques, and ideas
3. Articles are automatically generated daily with SEO-optimized content about coloring topics
4. Each article features:
   - Structured content with proper heading hierarchy
   - Schema.org markup for better search visibility
   - Related coloring pages that you can download
   - Keyword-rich tags for topic discovery
5. Content is optimized for educational value, search engines, and creative inspiration

### Admin Dashboard

Manage your blog content through a secure admin panel:

1. Access the admin panel at `/admin` (password protected)
2. View a list of all blog posts with status, creation date, and tags
3. Create new blog posts with a user-friendly form editor
4. Edit existing posts with full content and metadata control
5. Delete posts or toggle their published status
6. Auto-generate blog posts in bulk with configurable settings
7. Preview posts before publishing

## Latest Updates

- **Improved Blog Post Layout (2024-06-22)**: Refactored blog post rendering using `react-markdown` to enhance readability and user experience:
  - Replaced `dangerouslySetInnerHTML` with component-based rendering for better styling control.
  - Implemented custom Tailwind CSS styles for headings, paragraphs, lists, etc., improving visual structure and spacing.
  - Enhanced scannability, especially for step-by-step guides.

- **Enhanced Blog Content Quality (2024-06-21)**: Improved blog post generation system to create higher quality, more focused content:
  - Increased post length to 2000+ words for better depth and SEO performance
  - Added step-by-step coloring guides specific to each gallery image
  - Feature image now appears prominently at top of each post
  - Implemented improved image metadata enhancement for SEO
  - Added Schema.org markup with both Article and ImageObject types
  - Created image selection system that prioritizes unused, recent images
  - Fixed Gemini API integration to use stable endpoints and proper configuration

- **Content Uniqueness Success (2024-06-20)**: Successfully implemented and tested the advanced content uniqueness system with Gemini API integration. The system now creates blog posts based on gallery images with proper unique metadata, avoiding duplicate content patterns.

- **Enhanced Blog Content Uniqueness System (2024-06-19)**: Implemented advanced anti-duplication system that prevents generic templated content. The system now:
  - Removes introductions and FAQ sections that often lead to duplicate content
  - Focuses each post on unique gallery images specific to the topic
  - Ensures every image has complete metadata (title, alt text, description, etc.)
  - Creates content based on the actual visual elements of specific images
  - Automatically enhances metadata for any images referenced in blog posts
  - Adds a gallery section to each post featuring related coloring pages
  - Implements dynamic topic selection based on available unique images

- **Enhanced Blog Content Generation (2024-06-18)**: Completely redesigned the blog content generation system with advanced SEO optimization and content uniqueness detection. The new system analyzes existing content to prevent duplication, implements Flesch-Kincaid readability scoring, keyword optimization, and automatic content hash generation for similarity detection. Blog posts now include comprehensive SEO metadata, uniqueness scores, and detailed metrics for better performance in search engines.

- **Admin Dashboard (2024-06-17)**: Added a comprehensive admin dashboard for blog management, including a post editor, bulk generation tool, and content moderation features.

## Internationalization (i18n)

This application supports multiple languages to make it accessible to users worldwide.

### Supported Languages

- 🇺🇸 English (Default)
- 🇨🇳 Chinese (简体中文)
- 🇪🇸 Spanish (Español)
- 🇫🇷 French (Français)
- 🇩🇪 German (Deutsch)
- 🇯🇵 Japanese (日本語)
- 🇰🇷 Korean (한국어)
- 🇷🇺 Russian (Русский)

### Enhanced Language Features

The application now uses URL-based language paths for improved SEO and user experience:

- **URL-Based Routing**: Languages are part of the URL path (e.g., `/en/create`, `/zh/gallery`)
- **Automatic Detection**: First-time visitors are offered their preferred language based on browser settings
- **SEO Optimization**: Complete with `hreflang` tags and language-specific sitemaps
- **Persistent Selection**: Language preferences are saved for returning visitors

### Multilingual Architecture

The internationalization system is built using Next.js App Router and follows these design principles:

1. **Route Structure**: Each page is nested under a language parameter route (`[lang]`) 
2. **Separate Layout Structure**: 
   - Root layout (`src/app/layout.tsx`) - Provides the base HTML structure
   - Language layout (`src/app/[lang]/layout.tsx`) - Handles language-specific settings
3. **Translation Context**: 
   - Uses React Context API to provide translations throughout the app
   - Includes client-safe hydration handling to prevent React hydration errors
   - Implements efficient caching with localStorage and version tracking

#### Solving React Hydration Issues

To prevent React hydration errors with internationalization, we've implemented:

- **Client-side only initialization**: All localStorage and browser-specific code runs only after component mounting
- **Consistent initial rendering**: Using fallback content for first render to match server output
- **Hydration safety flags**: Using `suppressHydrationWarning` and mounting state tracking
- **Progressive enhancement**: Content displays instantly with fallbacks, then enhances once hydrated

### Chinese Translation Handling

For Chinese language support, we've implemented:

- **Hardcoded Fallbacks**: Critical UI elements have hardcoded Chinese translations
- **Reactive Fix Scripts**: For complex scenarios, reactive DOM manipulation scripts correct translations
- **Multi-layer Strategy**: Combines server-side translations with client-side enhancements

**Note**: While the main UI interface supports multiple languages, blog content is currently available in English only. The internationalization system is focused on providing a localized user experience for the core application features.

For detailed documentation on the internationalization system, see [docs/internationalization.md](./docs/internationalization.md).

## Local Development

1. Clone the repository:
```bash
git clone git@github.com:steplead/coloringpage.git
cd coloringpage
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# SiliconFlow API Configuration
SILICONFLOW_API_KEY=your_api_key_here
SILICONFLOW_API_URL=https://api.siliconflow.cn/v1/images/generations
SILICONFLOW_MODEL=black-forest-labs/FLUX.1-schnell

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Image Generation Configuration
DEFAULT_IMAGE_SIZE=1024
MAX_RETRY_ATTEMPTS=3
MIN_QUALITY_SCORE=7.0

# Cache Configuration
CACHE_DURATION=3600
MAX_CACHE_SIZE=100

# SEO Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NEXT_PUBLIC_SITE_NAME="AI Coloring Page Generator"
NEXT_PUBLIC_SITE_DESCRIPTION="Create custom coloring pages instantly with AI. Free printable coloring pages for kids and adults."
```

4. Set up your Supabase database:
   - Create a new Supabase project
   - Create a table called `images` with the following schema:
   ```sql
   create table images (
     id uuid default gen_random_uuid() primary key,
     created_at timestamp with time zone default now(),
     prompt text not null,
     image_url text not null,
     is_public boolean default true,
     user_id uuid,
     style text,
     title text
   );
   ```
   - Set up Row Level Security (RLS) policies as needed

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3002](http://localhost:3002) in your browser.

## Deployment

The project is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your forked repository
4. Add the following environment variables in your Vercel project settings:
   - `SILICONFLOW_API_KEY`
   - `SILICONFLOW_API_URL`
   - `SILICONFLOW_MODEL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## Automated Deployment

This project includes built-in automated deployment scripts to simplify the update process. These scripts handle git operations and Vercel deployment in a single command.

### Deployment Methods

1. **Quick One-Command Deployment**:
   ```bash
   npm run deploy-now
   ```
   This command automatically adds all changes, commits with a timestamp, pushes to GitHub, and deploys to Vercel production.

2. **Interactive Deployment** (with custom commit message):
   ```bash
   npm run deploy
   ```
   This will prompt you for a commit message before proceeding.

3. **Other Deployment Options**:
   - `npm run deploy:auto` - Automatic deployment without prompts
   - `npm run quick-deploy` - Alternative to deploy-now

For more detailed information about the deployment process, refer to the [DEPLOY.md](./DEPLOY.md) file.

## Custom Domain Setup

To set up a custom domain like we did with `ai-coloringpage.com`:

1. Purchase a domain from any domain registrar (we used Cloudflare)
2. In your Vercel project settings, go to "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS settings:
   - Add an A record pointing to Vercel's IP (76.76.21.21)
   - Add a CNAME record for "www" pointing to cname.vercel-dns.com
5. Set Cloudflare SSL/TLS encryption mode to "Full"

## Environment Variables

The following environment variables are required for the application to function:

| Variable | Description | Required |
|----------|-------------|----------|
| `SILICONFLOW_API_KEY` | Your SiliconFlow API key | Yes |
| `SILICONFLOW_API_URL` | SiliconFlow API endpoint | Yes |
| `SILICONFLOW_MODEL` | AI model for image generation | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

Additional optional environment variables can be found in `.env.example`.

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [SiliconFlow API](https://siliconflow.cn) - AI image generation
- [Supabase](https://supabase.com/) - Database and storage
- [Vercel](https://vercel.com/) - Hosting and continuous deployment
- [Custom Deployment Scripts](./DEPLOY.md) - Automated deployment workflow

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

Created with ❤️ by JL

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you find this project helpful, please consider:
- Giving it a ⭐ on GitHub
- Sharing it with friends and colleagues
- Following me for more projects

For issues and feature requests, please [open an issue](https://github.com/steplead/coloringpage/issues).

## SEO Optimization

### Image Metadata Optimization

All images in the system now automatically receive optimized metadata for SEO, including:

- **Title**: SEO-friendly title based on the image content
- **Alt Text**: Descriptive alt text for accessibility and SEO
- **Description**: Detailed description for meta tags and social sharing
- **Caption**: Shorter caption for display purposes
- **Keywords**: Related keywords for improved search indexing
- **Filename**: SEO-optimized filename for better indexing

The system includes self-healing capabilities that detect and fix any images lacking proper metadata.

### Content Uniqueness Features

To prevent duplicate content issues, the system implements:

1. **Image-Based Content Generation**: Blog posts are created based on specific, unique images
2. **No Generic Templates**: Common introductions and FAQs are eliminated
3. **Content Hash Analysis**: Each post is analyzed for similarity with existing content
4. **Uniqueness Scoring**: Content receives a uniqueness score (0-100) based on Jaccard similarity
5. **Keyword Optimization**: Each post uses unique keywords based on image metadata
6. **Flesch-Kincaid Readability**: Content is analyzed for readability and optimized accordingly

# Trigger deployment 9 - ESLint fixes applied
