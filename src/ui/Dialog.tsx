import { useEffect, useRef, type DialogHTMLAttributes, type ReactNode } from "react";
import { Button } from "./Button";
import "./layout-components.css";

export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, "open" | "title"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
}

export function Dialog({ open, onOpenChange, title, description, footer, className = "", children, ...props }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog {...props} ref={ref} className={`uf-dialog ${className}`.trim()} onCancel={(event) => { event.preventDefault(); onOpenChange(false); }} onClose={() => onOpenChange(false)}>
      <div className="uf-dialog__header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div><Button type="button" appearance="tertiary" size="compact" shape="square" aria-label="Close dialog" onClick={() => onOpenChange(false)}>×</Button></div>
      <div className="uf-dialog__body">{children}</div>
      {footer && <div className="uf-dialog__footer">{footer}</div>}
    </dialog>
  );
}
