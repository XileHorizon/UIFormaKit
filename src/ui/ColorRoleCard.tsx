import type { CSSProperties, ReactNode } from "react";
import "./tokens/components.css";
import "./molecules.css";

export type ColorRoleTone = "info" | "success" | "warning";

export interface ColorRoleCardProps {
  /** Role name, e.g. "Primary". */
  name: ReactNode;
  /** The colour shown in the chip. */
  color: string;
  /** Value line under the name; defaults to the colour. */
  value?: ReactNode;
  /** Tag describing where the colour came from, e.g. "Brand Seed". */
  tag: ReactNode;
  tone?: ColorRoleTone;
  className?: string;
}

/** Shows a colour role with its source tag, as in the Figma Brand Seed / Generated / Steered cards. */
export function ColorRoleCard({ name, color, value = color, tag, tone = "info", className = "" }: ColorRoleCardProps) {
  return (
    <article
      className={`uf-color-role-card ${className}`.trim()}
      data-tone={tone}
      style={{ "--uf-color-role-card-color": color } as CSSProperties}
    >
      <div className="uf-color-role-card__header">
        <span className="uf-color-role-card__chip" aria-hidden="true" />
        <div className="uf-color-role-card__copy">
          <strong>{name}</strong>
          <span>{value}</span>
        </div>
      </div>
      <span className="uf-color-role-card__tag">{tag}</span>
    </article>
  );
}
