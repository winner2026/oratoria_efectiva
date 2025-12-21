import { useEffect, useRef } from "react";

type UseIntersectionObserverOptions = {
  onVisible: () => void;
  onHidden?: () => void;
  threshold?: number;
  rootMargin?: string;
};

/**
 * Hook to track when an element becomes visible using IntersectionObserver
 *
 * Used for tracking scroll depth and section engagement
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options: UseIntersectionObserverOptions
) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            options.onVisible();
          } else if (options.onHidden) {
            options.onHidden();
          }
        });
      },
      {
        threshold: options.threshold ?? 0.5,
        rootMargin: options.rootMargin ?? "0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return elementRef;
}
