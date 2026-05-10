'use client';
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  const setValue = (value) => {
    try {
      const val = value instanceof Function ? value(storedValue) : value;
      setStoredValue(val);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(val));
      }
    } catch (err) {
      console.error('[useLocalStorage] set error:', err);
    }
  };

  return [storedValue, setValue];
}