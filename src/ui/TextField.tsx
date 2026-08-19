import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import "./form-controls.css";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export function TextField({
  label,
  leadingIcon,
  trailingIcon,
  hint,
  error,
  id: suppliedId,
  className = "",
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const descriptionId = hint || error ? `${id}-description` : undefined;
  return (
    <label className={`uf-text-field ${className}`.trim()} htmlFor={id} data-invalid={error ? true : undefined}>
      {label && <span className="uf-text-field__label">{label}</span>}
      <span className="uf-text-field__control">
        {leadingIcon && <span className="uf-text-field__icon">{leadingIcon}</span>}
        <input {...props} id={id} aria-invalid={error ? true : undefined} aria-describedby={descriptionId} />
        {trailingIcon && <span className="uf-text-field__icon">{trailingIcon}</span>}
      </span>
      {(error || hint) && (
        <span id={descriptionId} className="uf-text-field__description">
          {error ?? hint}
        </span>
      )}
    </label>
  );
}

