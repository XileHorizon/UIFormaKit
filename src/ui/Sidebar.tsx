import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import "./tokens/components.css";
import "./layout-components.css";

export type SidebarSide = "left" | "right";
export type SidebarSize = "rail" | "narrow" | "wide";

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  side?: SidebarSide;
  size?: SidebarSize;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsed?: boolean;
  label: string;
  header?: ReactNode;
  footer?: ReactNode;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
}

export function Sidebar({
  side = "left",
  size = "narrow",
  open = true,
  onOpenChange,
  collapsed = false,
  label,
  header,
  footer,
  closeOnEscape = true,
  closeOnBackdrop = true,
  className = "",
  children,
  ...props
}: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [isDrawer, setIsDrawer] = useState(false);
  const visible = !isDrawer || open;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setIsDrawer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isDrawer || !open) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    sidebarRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onOpenChange?.(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [closeOnEscape, isDrawer, onOpenChange, open]);

  return (
    <div
      className={`uf-sidebar-root ${className}`.trim()}
      data-adaptive={isDrawer ? "drawer" : "sidebar"}
      data-side={side}
      data-open={visible || undefined}
    >
      {isDrawer && visible && (
        <button
          className="uf-sidebar__backdrop"
          type="button"
          aria-label={`Close ${label}`}
          onClick={() => closeOnBackdrop && onOpenChange?.(false)}
        />
      )}
      <aside
        {...props}
        ref={sidebarRef}
        className="uf-sidebar"
        data-side={side}
        data-size={size}
        data-adaptive={isDrawer ? "drawer" : "sidebar"}
        data-collapsed={collapsed || undefined}
        data-open={visible || undefined}
        aria-label={label}
        aria-hidden={!visible || undefined}
        aria-modal={isDrawer ? true : undefined}
        role={isDrawer ? "dialog" : props.role}
        tabIndex={isDrawer ? -1 : props.tabIndex}
      >
        {header && <div className="uf-sidebar__header">{header}</div>}
        <div className="uf-sidebar__body">{children}</div>
        {footer && <div className="uf-sidebar__footer">{footer}</div>}
      </aside>
    </div>
  );
}
