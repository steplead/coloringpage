import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';

// Main navigation links
const navigationLinks = [
  { name: 'Home', href: '/' },
  { name: 'Create', href: '/create' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
];

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4">
      {navigationLinks.map((link) => {
        const isActive = pathname === link.href || 
          (link.href !== '/' && pathname?.startsWith(link.href));
            
        return (
          <Link
            key={link.name}
            href={link.href}
            className={classNames(
              'px-3 py-2 text-sm font-medium rounded-md transition-colors',
              {
                'bg-blue-700 text-white hover:bg-blue-800': isActive,
                'text-gray-700 hover:bg-gray-100 hover:text-gray-900': !isActive,
              }
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
} 