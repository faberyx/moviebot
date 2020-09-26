/** @jsx createElement */
import { useEffect } from 'react';

type HookKey = (callback: (event: KeyboardEvent) => void, element: HTMLElement | Document | null) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useWindowEvent = (event: string, callback: (e: any) => void, element?: HTMLElement | Window | Document | null) => {
  useEffect(() => {
    if (element) {
      element.addEventListener(event, callback);
    }
    return () => {
      if (element) {
        element.removeEventListener(event, callback);
      }
    };
  }, [event, callback, element]);
};

/**
 * Returns an event listener on the keydown event
 * @param callback Callback when the keydown event is listened in the element
 * @param element  Element to attach the listeners
 */
export const useEventKeyDown: HookKey = (callback: (event: KeyboardEvent) => void, element) => {
  return useWindowEvent('keydown', callback, element);
};
