# AI Coloring Page Generator by JL

Create custom coloring pages instantly with AI. This project uses Next.js 14 and the SiliconFlow API to generate beautiful coloring pages. Perfect for parents, teachers, and anyone who loves coloring!

## Live Demo

🎨 Try it now: [AI Coloring Page Generator](https://ai-coloringpage.com)

## About

This project was created by JL to make it easy for anyone to generate custom coloring pages using AI technology. Whether you're a teacher looking for educational materials, a parent wanting to entertain your kids, or just someone who enjoys coloring - this tool is for you!

## Features

- 🎨 Generate custom coloring pages using AI
- 🖌️ Multiple style options:
  - Classic - Clean black outlines, minimal detail
  - Detailed - More intricate patterns and texture details
  - Simple - Bold lines, fewer details (for younger children)
  - Cartoon - Stylized, fun character-based style
  - Realistic - More accurate proportions and details
- 📊 Complexity levels for different age groups
- 💡 Example prompts in different categories to help get started
- 📜 Generation history to revisit previous creations
- 📱 Responsive design for all devices
- ⚡ Server-side rendering for optimal performance
- 🔒 Secure API access and configuration
- 🖨️ Easy to download and print

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

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3002](http://localhost:3002) in your browser.

## Deployment

The project is deployed on Vercel and accessible at [ai-coloringpage.com](https://ai-coloringpage.com). To deploy your own instance:

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your forked repository
4. Add the required environment variables in your Vercel project settings
5. Deploy!

### Domain Configuration

If you want to use a custom domain:

1. Purchase a domain name (e.g., through Cloudflare, GoDaddy, etc.)
2. In your Vercel project, go to Settings > Domains
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS settings with your domain provider:
   - A record: @ → 76.76.21.21
   - CNAME record: www → cname.vercel-dns.com

## Environment Variables

The following environment variables are required for the application to function:

| Variable | Description | Required |
|----------|-------------|----------|
| `SILICONFLOW_API_KEY` | Your SiliconFlow API key | Yes |
| `SILICONFLOW_API_URL` | SiliconFlow API endpoint | Yes |
| `SILICONFLOW_MODEL` | AI model for image generation | Yes |

Additional optional environment variables can be found in `.env.example`.

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [SiliconFlow API](https://siliconflow.cn) - AI image generation

## Recent Updates

- Added multiple coloring page styles (Classic, Detailed, Simple, Cartoon, Realistic)
- Implemented complexity levels for different age groups
- Added category-based example prompts to help users get started
- Created a generation history feature to revisit previous creations
- Added a random prompt generator for inspiration
- Improved UI/UX with more intuitive controls and feedback

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
