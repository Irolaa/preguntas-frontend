// src/components/AnimatedPage.tsx
import { useEffect, useState } from 'react';
import '../styles/animatedPage.css';

const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100); // Delay pequeño
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`page-transition ${visible ? 'enter' : ''}`}>
      {children}
    </div>
  );
};

export default AnimatedPage;
