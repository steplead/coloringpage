# AI Coloring Page Generator by JL

Create custom coloring pages instantly with AI. This project uses Next.js 14 and the SiliconFlow API to generate beautiful coloring pages. Perfect for parents, teachers, and anyone who loves coloring!

## Live Demo

🎨 Try it now: [AI Coloring Page Generator](https://ai-coloringpage.com)

## About

This project was created by JL to make it easy for anyone to generate custom coloring pages using AI technology. Whether you're a teacher looking for educational materials, a parent wanting to entertain your kids, or just someone who enjoys coloring - this tool is for you!

## Features

- 🎨 Generate custom coloring pages using AI
- ✏️ Clean, black outline style perfect for coloring
- 🎭 Multiple style options (Standard, Cute, Cartoon, Realistic, Geometric, Sketch)
- 📊 Adjustable complexity levels for different age groups
- 🧠 Advanced mode for complete prompt control
- 📱 Responsive design for all devices
- ⚡ Server-side rendering for optimal performance
- 🔒 Secure API access and configuration
- 🖨️ Easy to print and share
- 📂 Save generation history in your browser

## How to Use

1. **Basic Mode**:
   - Enter a description of what you want to color
   - Choose a style (Standard, Cute, Cartoon, etc.)
   - Select complexity level (Simple, Medium, Complex)
   - Browse category suggestions for inspiration
   - Click "Generate Coloring Page"

2. **Advanced Mode**:
   - Toggle "Advanced Mode" switch
   - Enter a custom prompt with complete control
   - Include "black outline coloring page, clean lines" for best results
   - Click "Generate Coloring Page"

3. **Print or Download**:
   - View your generated coloring page
   - Click "Download" to save as an image
   - Click "Print" to send directly to your printer

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

The project is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Create a new project on [Vercel](https://vercel.com)
3. Connect your forked repository
4. Add the following environment variables in your Vercel project settings:
   - `SILICONFLOW_API_KEY`
   - `SILICONFLOW_API_URL`
   - `SILICONFLOW_MODEL`
5. Deploy!

### Custom Domain Setup

If you want to use a custom domain:

1. Purchase a domain (we used Cloudflare)
2. In Vercel project settings, go to "Domains"
3. Add your domain and follow the DNS configuration instructions
4. Add the required A and CNAME records in your DNS provider
5. Wait for DNS propagation (up to 24 hours)

## Environment Variables

The following environment variables are required for the application to function:

| Variable | Description | Required |
|----------|-------------|----------|
| `SILICONFLOW_API_KEY` | Your SiliconFlow API key | Yes |
| `SILICONFLOW_API_URL` | SiliconFlow API endpoint | Yes |
| `SILICONFLOW_MODEL` | AI model for image generation | Yes |

Additional optional environment variables can be found in `.env.example`.

## Prompt Engineering

The application uses a sophisticated prompt engineering system:

1. **Base Format**:
   ```
   [User Description], [Style], [Complexity], black outline coloring page, clean lines
   ```

2. **Style Options**:
   - Standard: Classic coloring page style
   - Cute: Adorable, kawaii style
   - Cartoon: Animated cartoon style
   - Realistic: More realistic proportions and details
   - Geometric: Composed of geometric shapes and patterns
   - Sketch: Hand-drawn sketch appearance

3. **Complexity Levels**:
   - Simple: Fewer details, large areas to color, ideal for young children
   - Medium: Balanced details, good for most ages
   - Complex: More intricate details, better for older children and adults

4. **Advanced Mode**:
   For users who want complete control over prompt engineering, allowing direct input of custom prompts without automatic formatting.

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [SiliconFlow API](https://siliconflow.cn) - AI image generation

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
