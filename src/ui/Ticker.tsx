import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
} from "@tabler/icons-react";

export type TickerVariant = "info" | "warning" | "danger" | "success";

export interface TickerAction {
  label: string;
  ariaLabel?: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  target?: string;
  showLabel?: boolean;
}

export interface TickerProps {
  children: ReactNode;
  variant?: TickerVariant;
  icon?: ReactNode | false;
  action?: TickerAction;
  duration?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  label?: string;
}

const variantIcons: Record<TickerVariant, ReactNode> = {
  info: <IconInfoCircle aria-hidden="true" />,
  warning: <IconAlertTriangle aria-hidden="true" />,
  danger: <IconCircleX aria-hidden="true" />,
  success: <IconCircleCheck aria-hidden="true" />,
};

export function Ticker({
  children,
  variant = "info",
  icon,
  action,
  duration = 24,
  direction = "right",
  pauseOnHover = true,
  label,
}: TickerProps) {
  const style = { "--uf-ticker-duration": `${duration}s` } as CSSProperties;
  const actionContent = <><span>{action?.label}</span><IconArrowRight aria-hidden="true" /></>;

  return (
    <section
      className="uf-ticker"
      data-variant={variant}
      data-direction={direction}
      data-pause-on-hover={pauseOnHover || undefined}
      aria-label={label}
      style={style}
    >
      {icon !== false && <span className="uf-ticker__icon">{icon ?? variantIcons[variant]}</span>}
      <div className="uf-ticker__viewport">
        <div className="uf-ticker__track">
          <div className="uf-ticker__group">{children}</div>
          <div className="uf-ticker__group" aria-hidden="true">{children}</div>
        </div>
      </div>
      {action && (action.href ? (
        <a className="uf-ticker__action" href={action.href} target={action.target} aria-label={action.ariaLabel ?? action.label} data-show-label={action.showLabel || undefined}>
          {actionContent}
        </a>
      ) : (
        <button className="uf-ticker__action" type="button" onClick={action.onClick} aria-label={action.ariaLabel ?? action.label} data-show-label={action.showLabel || undefined}>
          {actionContent}
        </button>
      ))}
    </section>
  );
}
