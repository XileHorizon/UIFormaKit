import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { TextField } from "./TextField";
import "./tokens/components.css";
import "./form-controls.css";


export interface AutocompleteOption {
  value: string;
  label: string;
  keywords?: readonly string[];
}

export interface AutocompleteProps {
  options: readonly AutocompleteOption[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  emptyMessage?: string;
  /** Optional actions rendered under the results, e.g. clear or view-all buttons. */
  footer?: ReactNode;
}

export function Autocomplete({
  options,
  value,
  onValueChange,
  label,
  placeholder = "Search",
  emptyMessage = "No matches",
  footer,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const results = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      [option.label, ...(option.keywords ?? [])].some((term) => term.toLowerCase().includes(query)),
    );
  }, [options, value]);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div className="uf-autocomplete-control" ref={rootRef} data-open={open || undefined}>
      <TextField
        label={label}
        value={value}
        placeholder={placeholder}
        trailingIcon={open ? <IconChevronDown /> : <IconChevronRight />}
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          onValueChange(event.currentTarget.value);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            setActiveIndex(-1);
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((current) => Math.min(results.length - 1, current + 1));
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((current) => Math.max(0, current < 0 ? results.length - 1 : current - 1));
          }
          if (event.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
            event.preventDefault();
            onValueChange(results[activeIndex].label);
            setOpen(false);
            setActiveIndex(-1);
          }
        }}
      />
      {open && (
        <div className="uf-autocomplete-control__tray" id={listboxId} role="listbox">
          <div className="uf-autocomplete-control__results">
            {results.length ? (
              results.map((option, index) => (
                <button
                  key={option.value}
                  id={`${listboxId}-${index}`}
                  type="button"
                  role="option"
                  aria-selected={activeIndex === index || value === option.label}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onValueChange(option.label);
                    setOpen(false);
                    setActiveIndex(-1);
                  }}
                >
                  <span>{option.label}</span>
                </button>
              ))
            ) : (
              <span>{emptyMessage}</span>
            )}
          </div>
          {footer && <div className="uf-autocomplete-control__actions">{footer}</div>}
        </div>
      )}
    </div>
  );
}
