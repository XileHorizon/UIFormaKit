import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./form-controls.css";

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "role"> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
}

export function Switch({ checked, onCheckedChange, label, className = "", ...props }: SwitchProps) {
  const control = (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={checked}
      className={`uf-control-switch ${className}`.trim()}
      data-state={checked ? "checked" : "unchecked"}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) onCheckedChange?.(!checked);
      }}
    >
      <span aria-hidden="true" />
    </button>
  );

  if (!label) return control;
  return (
    <label className="uf-control-switch-row">
      {control}
      <span>{label}</span>
    </label>
  );
}

