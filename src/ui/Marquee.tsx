import type { CSSProperties, ReactNode } from "react";

export interface MarqueeProps {
  children: ReactNode;
  duration?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  label?: string;
}

export function Marquee({ children, duration, direction = "left", pauseOnHover = true, label }: MarqueeProps) {
  const style = (duration === undefined ? {} : { "--uf-marquee-duration": `${duration}s` }) as CSSProperties;
  return (
    <div className="uf-marquee" data-direction={direction} data-pause-on-hover={pauseOnHover || undefined} aria-label={label} style={style}>
      <div className="uf-marquee__track">
        <div className="uf-marquee__group">{children}</div>
        <div className="uf-marquee__group" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
