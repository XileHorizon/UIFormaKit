import type { SVGProps } from "react";

type TablerIconProps = SVGProps<SVGSVGElement> & { size?: number };

const baseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

// Paths from Tabler Icons (MIT). Keep ordinary UI symbols here; bespoke Figma
// artwork such as harmony diagrams and picker handles stays with its component.
export function IconArrowRight({ size = 24, ...props }: TablerIconProps) {
  return (
    <svg {...baseProps} width={size} height={size} aria-hidden="true" {...props}>
      <path d="M5 12h14" />
      <path d="m13 18 6-6" />
      <path d="m13 6 6 6" />
    </svg>
  );
}

export function IconChevronDown({ size = 24, ...props }: TablerIconProps) {
  return (
    <svg {...baseProps} width={size} height={size} aria-hidden="true" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconChevronRight({ size = 24, ...props }: TablerIconProps) {
  return <svg {...baseProps} width={size} height={size} aria-hidden="true" {...props}><path d="m9 6 6 6-6 6" /></svg>;
}

export function IconSearch({ size = 24, ...props }: TablerIconProps) {
  return <svg {...baseProps} width={size} height={size} aria-hidden="true" {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}

export function IconPlus({ size = 24, ...props }: TablerIconProps) {
  return <svg {...baseProps} width={size} height={size} aria-hidden="true" {...props}><path d="M12 5v14M5 12h14" /></svg>;
}

export function IconHeart({ size = 24, ...props }: TablerIconProps) {
  return <svg {...baseProps} width={size} height={size} aria-hidden="true" {...props}><path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 0 1 12 6a5 5 0 0 1 7.5 6.6" /></svg>;
}

export function IconDots({ size = 24, ...props }: TablerIconProps) {
  return <svg {...baseProps} width={size} height={size} aria-hidden="true" {...props}><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></svg>;
}
