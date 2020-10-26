import { useEffect, RefObject, useCallback } from 'react';

export const useClickOutside = <T extends Element | undefined>(ref: RefObject<T>, callback: (event: MouseEvent) => void) => {
  const handleClick = useCallback(
    (event: MouseEvent): void => {
      if (!ref.current?.contains(event.target as Node)) {
        callback(event);
      }
    },
    [callback, ref]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return (): void => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
};
