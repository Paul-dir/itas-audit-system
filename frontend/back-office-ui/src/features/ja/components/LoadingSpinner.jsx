/**
 * LoadingSpinner Component
 * Display loading state
 */

import { Loader } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return <div className="p-8">{content}</div>;
}
