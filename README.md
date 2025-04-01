# AI Coloring Page Generator

Create custom coloring pages instantly with AI. This project uses Next.js 14 and the SiliconFlow API to generate beautiful coloring pages.

## Live Demo

The application is deployed and accessible at:
https://coloringpage-boyf0kvyq-stepleads-projects.vercel.app

## Features

- Generate custom coloring pages using AI
- Clean, black outline style perfect for coloring
- Responsive design for all devices
- Server-side rendering for optimal performance
- Environment variable configuration for secure API access

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
