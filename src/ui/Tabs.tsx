import { useId, useRef, type ReactNode } from "react";

export interface TabItem { value: string; label: ReactNode; content: ReactNode; disabled?: boolean; }
export interface TabsProps { items: readonly TabItem[]; value: string; onValueChange: (value: string) => void; label?: string; }

export function Tabs({ items, value, onValueChange, label = "Tabs" }: TabsProps) {
  const id = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = items.find((item) => item.value === value && !item.disabled) ?? items.find((item) => !item.disabled);
  const move = (current: number, direction: number) => {
    const enabled = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled);
    const position = enabled.findIndex(({ index }) => index === current);
    const target = enabled[(position + direction + enabled.length) % enabled.length];
    if (target) { onValueChange(target.item.value); refs.current[target.index]?.focus(); }
  };
  const focusEdge = (edge: "first" | "last") => {
    const enabled = items.map((item, index) => ({ item, index })).filter(({ item }) => !item.disabled);
    const target = edge === "first" ? enabled[0] : enabled[enabled.length - 1];
    if (target) { onValueChange(target.item.value); refs.current[target.index]?.focus(); }
  };
  return <div className="uf-tabs">
    <div className="uf-tabs__list" role="tablist" aria-label={label}>
      {items.map((item, index) => <button key={item.value} ref={(node) => { refs.current[index] = node; }} type="button" role="tab" id={`${id}-tab-${item.value}`} aria-controls={`${id}-panel-${item.value}`} aria-selected={item.value === active?.value} tabIndex={item.value === active?.value ? 0 : -1} disabled={item.disabled} onClick={() => onValueChange(item.value)} onKeyDown={(event) => {
        if (event.key === "ArrowRight") { event.preventDefault(); move(index, 1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); move(index, -1); }
        if (event.key === "Home") { event.preventDefault(); focusEdge("first"); }
        if (event.key === "End") { event.preventDefault(); focusEdge("last"); }
      }}>{item.label}</button>)}
    </div>
    {active && <div className="uf-tabs__panel" role="tabpanel" id={`${id}-panel-${active.value}`} aria-labelledby={`${id}-tab-${active.value}`} tabIndex={0}>{active.content}</div>}
  </div>;
}
