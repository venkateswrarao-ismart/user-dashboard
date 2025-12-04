import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useForceRefresh = () => {
  const [key, setKey] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Force re-render when location changes
    setKey(prev => prev + 1);
  }, [location.pathname]);

  return key;
};