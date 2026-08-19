import { useId, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";
import "./form-controls.css";

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  label?: ReactNode;
  value: number;
  onValueChange: (value: number) => void;
  showValue?: boolean;
  gradient?: string;
}

export function Slider({
  label,
  value,
  onValueChange,
  showValue = true,
  gradient,
  id: suppliedId,
  min = 0,
  max = 100,
  step = 1,
  className = "",
  ...props
}: SliderProps) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const minimum = Number(min);
  const maximum = Number(max);
  const percentage = ((value - minimum) / (maximum - minimum)) * 100;
  return (
    <label className={`uf-slider ${className}`.trim()} htmlFor={id}>
      {(label || showValue) && (
        <span className="uf-slider__heading">
          <span>{label}</span>
          {showValue && <output htmlFor={id}>{value}</output>}
        </span>
      )}
      <input
        {...props}
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onValueChange(Number(event.currentTarget.value))}
        style={{
          "--uf-slider-progress": `${percentage}%`,
          ...(gradient ? { "--uf-slider-gradient": gradient } : {}),
        } as CSSProperties}
      />
    </label>
  );
}

