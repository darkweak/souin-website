import { RefObject, useEffect } from 'react';

type Handler = (ev: MouseEvent) => void;

function useOnClickOutside<T extends HTMLElement = HTMLElement>(ref: RefObject<T>, handler: Handler): void {
  useEffect(() => {
    if (ref?.current) {
      const el = ref.current;
      const callback = (ev: MouseEvent) => {
        if (!el || el.contains(ev.target as Node)) {
          return;
        }

        handler(ev);
      };
      addEventListener('click', callback);

      return () => removeEventListener('click', callback);
    }
  }, [handler, ref]);
}

export default useOnClickOutside;
