import { useEffect, useRef, useState } from "react";

/**
 * useInView — fires once when the element enters the viewport.
 * Uses the border-box scroll container as the root so IntersectionObserver works correctly inside the fixed + scrollable wrapper
 */
const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting); // true on enter, false on leave
      },
      {
        root: null,
        threshold,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
};

export default useInView;
