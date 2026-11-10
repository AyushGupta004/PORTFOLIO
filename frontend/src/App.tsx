import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ScrollProvider } from './context/ScrollContext';
import { Header } from './components/Header';
import { NavigationMenu } from './components/NavigationMenu';
import { StyleguidePage } from './pages/StyleguidePage';
import { HorizontalScrollContainer } from './components/HorizontalScrollContainer';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Gate styleguide route behind import.meta.env.DEV
  const isStyleguide = Boolean(import.meta.env.DEV) && (currentPath === '/styleguide' || currentPath.endsWith('styleguide'));

  return (
    <ThemeProvider>
      <ScrollProvider>
        <main className="w-full min-h-screen bg-bg text-ink relative">
          {/* Fixed Header */}
          <Header onLogoClick={() => navigateTo('/')} />

          {/* Accessible Navigation Menu Drawer */}
          <NavigationMenu />

          {/* Route view (styleguide available only in dev) */}
          {isStyleguide ? (
            <StyleguidePage onBackToHome={() => navigateTo('/')} />
          ) : (
            <HorizontalScrollContainer />
          )}

        </main>
      </ScrollProvider>
    </ThemeProvider>
  );
};

export default App;
