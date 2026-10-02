import type { CSSProperties, ReactNode } from "react";
import "./tokens/components.css";
import "./molecules.css";

export interface ColorRampProps {
  /** Ramp name, e.g. "Primary". */
  name: ReactNode;
  /** Secondary line under the name, e.g. the seed hex. */
  detail?: ReactNode;
  /** Colours from lightest to darkest. */
  colors: readonly string[];
  /** Step labels shown above the ramp, e.g. 0 … 1000. */
  steps?: readonly ReactNode[];
  /** Show the continuous gradient bar under the steps. */
  showGradient?: boolean;
  className?: string;
}

/** A tonal ramp: labelled steps with an optional blended gradient, as in the Figma Color Primitive. */
export function ColorRamp({ name, detail, colors, steps, showGradient = true, className = "" }: ColorRampProps) {
  return (
    <figure className={`uf-color-ramp ${className}`.trim()} data-has-steps={steps ? true : undefined}>
      <figcaption className="uf-color-ramp__label">
        <span className="uf-color-ramp__name">{name}</span>
        {detail && <span className="uf-color-ramp__detail">{detail}</span>}
      </figcaption>
      <div className="uf-color-ramp__track">
        <ol className="uf-color-ramp__steps">
          {colors.map((color, index) => (
            <li key={`${index}-${color}`} style={{ "--uf-color-ramp-step": color } as CSSProperties}>
              {steps?.[index] !== undefined && <span className="uf-color-ramp__step-label">{steps[index]}</span>}
              <span className="uf-color-ramp__chip" role="img" aria-label={`${steps?.[index] ?? index}: ${color}`} />
            </li>
          ))}
        </ol>
        {showGradient && (
          <span
            className="uf-color-ramp__gradient"
            aria-hidden="true"
            style={{ background: `linear-gradient(90deg, ${colors.join(", ")})` }}
          />
        )}
      </div>
    </figure>
  );
}
