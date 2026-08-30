import type { HTMLAttributes, ReactNode } from "react";
import "./layout-components.css";

export interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "article" | "div";
  tone?: "default" | "subtle" | "raised";
  padding?: "none" | "compact" | "standard" | "spacious";
  header?: ReactNode;
  footer?: ReactNode;
}

export function Panel({ as: Element = "section", tone = "default", padding = "standard", header, footer, className = "", children, ...props }: PanelProps) {
  return (
    <Element {...props} className={`uf-panel ${className}`.trim()} data-tone={tone} data-padding={padding}>
      {header && <div className="uf-panel__header">{header}</div>}
      <div className="uf-panel__body">{children}</div>
      {footer && <div className="uf-panel__footer">{footer}</div>}
    </Element>
  );
}
