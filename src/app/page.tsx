import { redirect } from 'next/navigation';

// This is the root page component that handles the base URL (/)
// It simply redirects to the default language version
export default function RootPage() {
  // Redirect to the default English version
  redirect('/en');
  
  // This return is not needed but added to satisfy TypeScript
  return null;
} 