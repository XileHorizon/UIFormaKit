import { useId, useState, type ReactNode } from "react";

export interface AccordionItem { value: string; trigger: ReactNode; content: ReactNode; disabled?: boolean; }
export interface AccordionProps { items: readonly AccordionItem[]; type?: "single" | "multiple"; defaultValue?: string | readonly string[]; }

export function Accordion({ items, type = "single", defaultValue }: AccordionProps) {
  const id = useId();
  const initial = Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue as string] : [];
  const [open, setOpen] = useState<readonly string[]>(initial);
  const toggle = (value: string) => setOpen((current) => current.includes(value) ? current.filter((item) => item !== value) : type === "single" ? [value] : [...current, value]);
  return <div className="uf-accordion">
    {items.map((item) => {
      const expanded = open.includes(item.value);
      return <div className="uf-accordion__item" key={item.value}>
        <h3><button type="button" id={`${id}-trigger-${item.value}`} aria-expanded={expanded} aria-controls={`${id}-panel-${item.value}`} disabled={item.disabled} onClick={() => toggle(item.value)}><span>{item.trigger}</span><span aria-hidden="true">＋</span></button></h3>
        <div className="uf-accordion__panel" id={`${id}-panel-${item.value}`} role="region" aria-labelledby={`${id}-trigger-${item.value}`} hidden={!expanded}>{item.content}</div>
      </div>;
    })}
  </div>;
}
