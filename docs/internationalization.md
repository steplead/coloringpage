# Advanced Internationalization Guide

This guide explains the enhanced internationalization system implemented in this application, featuring URL-based language routing for better SEO and user experience.

## URL-Based Language Routing

The application now uses URL-based language paths instead of just cookies for language selection:

```
https://ai-coloringpage.com/en/create  # English version
https://ai-coloringpage.com/zh/create  # Chinese version
https://ai-coloringpage.com/es/create  # Spanish version
```

This approach offers several benefits:
- Better SEO for multilingual content
- Easier sharing of language-specific links
- Clearer user experience
- Improved site structure for search engines

## How the System Works

### 1. Language Detection and Redirection

- When a user visits the site for the first time, the middleware detects their browser's language
- If a supported language is detected, they are redirected to the appropriate URL path
- A one-time banner also offers users the option to switch to their detected language

### 2. URL Structure

- All pages follow the `/{language}/{path}` structure
- The language code is a two-letter code (`en`, `zh`, `es`, etc.)
- The root path (`/`) redirects to the user's preferred language path

### 3. SEO Optimization

- `hreflang` tags are added to all pages to indicate language alternatives
- Language-specific metadata is generated for each page
- The sitemap includes all language variations of each page
- Language information is properly communicated to search engines

## Components and Files

### Middleware (`/src/middleware.ts`)

The middleware handles language detection and URL routing:
- Detects user's preferred language from browser settings or cookies
- Redirects to the appropriate language path
- Sets language cookies for persistence

### Language Layout (`/src/app/[lang]/layout.tsx`)

This layout wraps pages with language-specific context:
- Provides language information to all pages
- Generates language-specific metadata
- Adds necessary SEO tags

### Language Selector (`/src/components/LanguageSelector.tsx`)

The updated language selector now changes the URL path instead of just setting a cookie:
- When a language is selected, the user is redirected to the same page with the new language code
- The current URL path is preserved during language switches

### Language Detection Banner (`/src/components/LanguageDetectionBanner.tsx`)

A new banner that appears on first visit:
- Detects the user's browser language
- Offers to switch to their preferred language
- Remembers the user's choice for future visits

## Adding a New Page

When adding a new page, follow these steps to ensure proper internationalization:

1. Create the base page in `/src/app/{path}/page.tsx`
2. Create a language-specific version in `/src/app/[lang]/{path}/page.tsx`
3. Make the base page accept a `params` prop with language information
4. Use the `TranslatedText` component for all user-visible text
5. Add necessary translation keys to all language files

## Adding a New Language

To add a new language:

1. Add the language to `SUPPORTED_LANGUAGES` in `/src/lib/i18n/locales.ts`
2. Create a new translation file in `/src/lib/i18n/translations/{lang}.json`
3. Update the alternates in `layout.tsx` to include the new language
4. Test all pages with the new language

## Updating Translations

To update existing translations:

1. Edit the appropriate translation file in `/src/lib/i18n/translations/{lang}.json`
2. Use the English (en.json) file as a reference for the structure
3. Ensure all keys from the English file exist in your translation file
4. Keep special formatting like `%s` and HTML tags intact - only translate the text

Example:
```json
// English (en.json)
{
  "welcome": "Hello %s, welcome to our site!"
}

// Spanish (es.json)
{
  "welcome": "Hola %s, ¡bienvenido a nuestro sitio!"
}
```

## SEO Best Practices

Our internationalization system is optimized for search engines with the following features:

### Language-Specific Sitemaps

The application generates language-specific sitemaps for each supported language:
- Main sitemap: `https://ai-coloringpage.com/sitemap.xml`
- Language sitemaps: `https://ai-coloringpage.com/{lang}/sitemap.xml`

These sitemaps include:
- All pages available in each language
- Language alternates for each page
- Proper `hreflang` attributes for multilingual content
- Priority and update frequency information

### Robots.txt Configuration

The `robots.txt` file directs search engines to the language-specific sitemaps, helping them efficiently crawl and index multilingual content.

### URL Structure and Canonicalization

- Each language version has its own URL path (`/{lang}/path`)
- The correct canonical URLs are set for all pages
- Language alternatives are properly cross-referenced using `hreflang` tags
- The default language version is marked with `x-default`

### Metadata and Open Graph

- Page titles and descriptions are localized for each language
- Open Graph tags include language attributes
- Social sharing metadata is appropriately localized

### Implementation Details

Key files for SEO implementation:
- `/src/app/robots.ts` - Defines robots.txt with language sitemaps
- `/src/app/sitemap.ts` - Main sitemap generator
- `/src/app/[lang]/sitemap.ts` - Language-specific sitemap generator
- `/src/app/layout.tsx` - Global layout with hreflang tags
- `/src/app/[lang]/layout.tsx` - Language-specific layout with metadata

To optimize your content for multilingual SEO:
- Ensure all important pages have translations in all supported languages
- Use the `<TranslatedText>` component for all visible text
- Include translated metadata in your page components
- Set appropriate canonical URLs and alternates

## Limitations

- Blog content remains in English only
- User-generated content is not translated
- Not all corner cases may be handled perfectly when switching languages on dynamic pages 