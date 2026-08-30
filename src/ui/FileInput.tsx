import { useId, useRef, useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { Button } from "./Button";
import "./form-controls.css";

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  buttonLabel?: ReactNode;
  emptyLabel?: ReactNode;
}

export function FileInput({ label, buttonLabel = "Choose file", emptyLabel = "No file selected", id: suppliedId, className = "", onChange, ...props }: FileInputProps) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileName(event.currentTarget.files?.[0]?.name);
    onChange?.(event);
  };
  return (
    <div className={`uf-file-input ${className}`.trim()}>
      {label && <label className="uf-file-input__label" htmlFor={id}>{label}</label>}
      <input {...props} ref={inputRef} id={id} type="file" onChange={handleChange} />
      <div className="uf-file-input__control">
        <Button type="button" appearance="surface" onClick={() => inputRef.current?.click()}>{buttonLabel}</Button>
        <span aria-live="polite">{fileName ?? emptyLabel}</span>
      </div>
    </div>
  );
}
