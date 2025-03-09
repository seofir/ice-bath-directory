'use client';

import { useEffect } from 'react';

export default function HydrationSuppressor() {
  useEffect(() => {
    // Suppress hydration warnings in development
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      // Filter out hydration warnings
      if (args[0] && typeof args[0] === 'string' && args[0].includes('Warning: Text content did not match')) {
        return;
      }
      if (args[0] && typeof args[0] === 'string' && args[0].includes('A tree hydrated but some attributes')) {
        return;
      }
      originalConsoleError(...args);
    };
  }, []);

  return null;
}
