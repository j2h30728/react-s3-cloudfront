import { useCallback, useEffect, useRef } from "react";

const useIntersectionObserver = (callback: () => void, options?: IntersectionObserverInit) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observe = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      }, options);

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [callback, options]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return observe;
};

export default useIntersectionObserver;
