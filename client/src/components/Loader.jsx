import React from 'react';

export const Loader = ({ fullPage = false, size = 'md' }) => {
  const containerStyle = fullPage
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md'
    : 'flex flex-col items-center justify-center p-6';

  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className={containerStyle}>
      <div className="relative">
        {/* Outer glowing ring */}
        <div className={`rounded-full border-t-blue-500 border-r-indigo-500 border-b-purple-500 border-l-transparent animate-spin ${sizes[size]}`} />
        {/* Inner static circle */}
        <div className="absolute inset-0.5 rounded-full bg-slate-900/10 dark:bg-slate-950/40 border border-slate-700/20" />
      </div>
      {fullPage && (
        <span className="mt-4 text-sm font-semibold tracking-wider text-slate-300 animate-pulse">
          TALENTSPHERE IS CONTEXTUALIZING...
        </span>
      )}
    </div>
  );
};

export default Loader;
