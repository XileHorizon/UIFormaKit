import { useEffect, useState, type ReactNode } from "react";

export interface ScrollItem {
  id: string;
  content: ReactNode;
}

export interface ScrollProps {
  items: readonly ScrollItem[];
  interval?: number;
  label?: string;
  paused?: boolean;
}

export function Scroll({ items, interval = 4000, label = "Latest updates", paused = false }: ScrollProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), interval);
    return () => window.clearInterval(timer);
  }, [interval, items.length, paused]);

  if (!items.length) return null;
  const activeIndex = index % items.length;

  return (
    <div className="uf-scroll" role="status" aria-label={label} aria-live="polite">
      <span className="uf-scroll__marker" aria-hidden="true" />
      <div className="uf-scroll__viewport">
        <span key={items[activeIndex].id} className="uf-scroll__item">{items[activeIndex].content}</span>
      </div>
      <span className="uf-scroll__count" aria-hidden="true">{activeIndex + 1} / {items.length}</span>
    </div>
  );
}
