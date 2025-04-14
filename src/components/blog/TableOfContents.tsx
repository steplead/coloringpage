import React from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  className?: string;
}

/**
 * Table of Contents component for blog posts
 * Creates a navigable list of links to article sections
 */
const TableOfContents: React.FC<TableOfContentsProps> = ({ headings, className = '' }) => {
  if (!headings || headings.length === 0) return null;

  return (
    <div className={`${className}`}>
      <h2 className="text-lg font-bold mb-3">Table of Contents</h2>
      <nav aria-label="Table of contents">
        <ol className="space-y-1">
          {headings.map((heading) => (
            <li 
              key={heading.id} 
              className={`${
                heading.level === 2 ? 'ml-0' : 
                heading.level === 3 ? 'ml-4' : 'ml-8'
              }`}
            >
              <a 
                href={`#${heading.id}`} 
                className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    // Smooth scroll to the element
                    element.scrollIntoView({ behavior: 'smooth' });
                    // Update URL hash without jumping
                    window.history.pushState(null, '', `#${heading.id}`);
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default TableOfContents; 