import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  animateOnMount?: boolean;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  duration = 300,
  animateOnMount = true,
}) => {
  const router = useRouter();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');
  const [mounted, setMounted] = useState(false);

  // Handle initial mount animation
  useEffect(() => {
    setMounted(true);
    if (animateOnMount) {
      setTransitionStage('fadeIn');
    }
  }, [animateOnMount]);

  // Handle route change
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setTransitionStage('fadeOut');
    };

    const handleRouteChangeComplete = () => {
      setTransitionStage('fadeIn');
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  // Update displayed children when children prop changes or when animation is triggered
  useEffect(() => {
    if (transitionStage === 'fadeOut') {
      // Only change the displayed children after the fade-out animation completes
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('fadeIn');
      }, duration);

      return () => clearTimeout(timer);
    }

    setDisplayChildren(children);
  }, [children, transitionStage, duration]);

  // Only animate once mounted (to prevent SSR issues)
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div
      className={`transition-opacity ${className}`}
      style={{
        opacity: transitionStage === 'fadeIn' ? 1 : 0,
        transition: `opacity ${duration}ms ease-in-out`,
      }}
    >
      {displayChildren}
    </div>
  );
};

export default PageTransition;
