import React from 'react';

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words hyphens-auto">
          {title}
        </h1>
        {description && (
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-500 max-w-3xl break-words">
            {description}
          </p>
        )}
        {children && <div className="mt-4 sm:mt-6">{children}</div>}
      </div>
    </div>
  );
} 