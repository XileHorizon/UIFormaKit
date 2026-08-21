import type { CSSProperties, ReactNode } from "react";

export interface ScrollProps {
  children: ReactNode;
  duration?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  label?: string;
}

export function Scroll({ children, duration = 24, direction = "right", pauseOnHover = true, label }: ScrollProps) {
  const style = { "--uf-scroll-duration": `${duration}s` } as CSSProperties;
  return (
    <div className="uf-scroll" data-direction={direction} data-pause-on-hover={pauseOnHover || undefined} aria-label={label} style={style}>
      <div className="uf-scroll__track">
        <div className="uf-scroll__group">{children}</div>
        <div className="uf-scroll__group" aria-hidden="true">{children}</div>
      </div>
      <div>
      <button> </button>
    </div>
    </div>
    
  );
}
