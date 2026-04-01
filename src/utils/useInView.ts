import { useEffect, useState, useCallback } from "react";

const useInView = (threshold = 0.15) => {
  const [inView, setInView] = useState(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const ref = useCallback((el: HTMLDivElement | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { root: null, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold]);

  return { ref, inView };
};

export default useInView;
