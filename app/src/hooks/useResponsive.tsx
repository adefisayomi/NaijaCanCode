import { useState, useEffect } from 'react';

export default function useResponsive () : 'mobile' | 'desktop' {

  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' && window.innerWidth);

  const updateScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateScreenWidth);

    return () => {
      window.removeEventListener('resize', updateScreenWidth);
    };
  }, []);

  return screenWidth && screenWidth <= 768 ? 'mobile' : 'desktop'
}