import { useEffect, useRef, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import "./tokens/components.css";
import "./layout-components.css";

export interface SplitPaneProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  first: ReactNode;
  second: ReactNode;
  value: number;
  onValueChange: (percentage: number) => void;
  min?: number;
  max?: number;
  orientation?: "horizontal" | "vertical";
  firstLabel?: string;
  secondLabel?: string;
  resizeLabel?: string;
}

export function SplitPane({ first, second, value, onValueChange, min = 20, max = 80, orientation = "horizontal", firstLabel = "First pane", secondLabel = "Second pane", resizeLabel = "Resize panes", className = "", ...props }: SplitPaneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const clamp = (next: number) => Math.min(max, Math.max(min, next));
  const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const position = orientation === "horizontal" ? event.clientX - rect.left : event.clientY - rect.top;
    const size = orientation === "horizontal" ? rect.width : rect.height;
    onValueChange(clamp((position / size) * 100));
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const backward = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const forward = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    if (![backward, forward, "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    onValueChange(event.key === "Home" ? min : event.key === "End" ? max : clamp(value + (event.key === forward ? 2 : -2)));
  };
  useEffect(() => { if (value < min || value > max) onValueChange(clamp(value)); }, [min, max, value]);
  const style = { "--uf-split-pane-position": `${clamp(value)}%` } as React.CSSProperties;
  return (
    <div {...props} ref={rootRef} className={`uf-split-pane ${className}`.trim()} data-orientation={orientation} style={{ ...style, ...props.style }}>
      <div className="uf-split-pane__panel" aria-label={firstLabel}>{first}</div>
      <div className="uf-split-pane__separator" role="separator" tabIndex={0} aria-label={resizeLabel} aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"} aria-valuemin={min} aria-valuemax={max} aria-valuenow={Math.round(value)} onKeyDown={onKeyDown} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); updateFromPointer(event); }} onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) updateFromPointer(event); }} />
      <div className="uf-split-pane__panel" aria-label={secondLabel}>{second}</div>
    </div>
  );
}
