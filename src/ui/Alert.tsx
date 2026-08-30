import type { HTMLAttributes, ReactNode } from "react";
import "./layout-components.css";

export type FeedbackTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: FeedbackTone;
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
}

export function Alert({ tone = "neutral", title, icon, action, className = "", children, ...props }: AlertProps) {
  return (
    <div {...props} className={`uf-alert ${className}`.trim()} data-tone={tone} role={tone === "danger" ? "alert" : "status"}>
      {icon && <span className="uf-alert__icon" aria-hidden="true">{icon}</span>}
      <div className="uf-alert__content">{title && <strong>{title}</strong>}{children && <div>{children}</div>}</div>
      {action && <div className="uf-alert__action">{action}</div>}
    </div>
  );
}

export interface StatusProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: FeedbackTone;
  dot?: boolean;
}

export function Status({ tone = "neutral", dot = true, className = "", children, ...props }: StatusProps) {
  return <span {...props} className={`uf-status ${className}`.trim()} data-tone={tone}>{dot && <span aria-hidden="true" />}{children}</span>;
}
