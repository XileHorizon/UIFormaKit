import { useEffect, useState, type ReactNode } from "react";

export interface TickerItem {
  id: string;
  content: ReactNode;
}

export interface TickerProps {
  items: readonly TickerItem[];
  interval?: number;
  label?: string;
  paused?: boolean;
}

export function Ticker({ items, interval = 4000, label = "Latest alerts", paused = false }: TickerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), interval);
    return () => window.clearInterval(timer);
  }, [interval, items.length, paused]);

  if (!items.length) return null;
  const activeIndex = index % items.length;

  return (
    <div className="uf-ticker" role="status" aria-label={label} aria-live="polite">
      <span className="uf-ticker__marker" aria-hidden="true" />
      <div className="uf-ticker__viewport">
        <span key={items[activeIndex].id} className="uf-ticker__item">{items[activeIndex].content}</span>
      </div>
      <span className="uf-ticker__count" aria-hidden="true">{activeIndex + 1} / {items.length}</span>
    </div>
  );
}
