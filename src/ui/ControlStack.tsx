import { useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "./Button";
import "./form-controls.css";

type StackButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children" | "onClick"
>;

export interface StackedItem<T extends string> {
  value: T;
  label?: ReactNode;
  disabled?: boolean;

  /**
   * Anything your normal Button supports:
   * appearance, shape, size, icons, style, className, etc.
   */
  buttonProps?: StackButtonProps;

  /**
   * Used when the stack is NOT acting as a radio group.
   */
  onClick?: () => void;
}

interface BaseControlStackProps<T extends string> {
  items: readonly StackedItem<T>[];
  className?: string;
}

/**
 * Normal button stack.
 */
interface StandardControlStackProps<T extends string>
  extends BaseControlStackProps<T> {
  radio?: false;
  label?: string;
}

/**
 * Radio button stack.
 */
interface RadioControlStackProps<T extends string>
  extends BaseControlStackProps<T> {
  radio: true;
  value: T;
  onValueChange: (value: T) => void;
  label: string;
}

export type ControlStackProps<T extends string> =
  | StandardControlStackProps<T>
  | RadioControlStackProps<T>;

export function ControlStack<T extends string>(
  props: ControlStackProps<T>,
) {
  const { items, className = "" } = props;
  const isRadio = props.radio === true;
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!isRadio || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const enabledIndexes = items
      .map((item, itemIndex) => (item.disabled || item.buttonProps?.disabled ? -1 : itemIndex))
      .filter((itemIndex) => itemIndex >= 0);
    if (!enabledIndexes.length) return;
    const current = enabledIndexes.indexOf(index);
    const targetIndex =
      event.key === "Home"
        ? enabledIndexes[0]
        : event.key === "End"
          ? enabledIndexes[enabledIndexes.length - 1]
          : enabledIndexes[
              (current + (event.key === "ArrowDown" ? 1 : -1) + enabledIndexes.length) %
                enabledIndexes.length
            ];
    const target = items[targetIndex];
    props.onValueChange(target.value);
    buttonRefs.current[targetIndex]?.focus();
  };

  return (
    <div
      className={`uf-control-stack ${className}`.trim()}
      role={isRadio ? "radiogroup" : props.label ? "group" : undefined}
      aria-label={props.label}
    >
      {items.map((item, index) => {
        const checked = isRadio && props.value === item.value;

        return (
          <Button
            {...item.buttonProps}
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            key={item.value}
            type="button"
            disabled={
              item.disabled ||
              item.buttonProps?.disabled
            }
            role={isRadio ? "radio" : undefined}
            aria-checked={isRadio ? checked : undefined}
            data-state={isRadio ? (checked ? "checked" : "unchecked") : undefined}
            tabIndex={isRadio ? (checked ? 0 : -1) : item.buttonProps?.tabIndex}
            onKeyDown={(event) => {
              item.buttonProps?.onKeyDown?.(event);
              if (!event.defaultPrevented) moveFocus(event, index);
            }}
            onClick={() => {
              if (isRadio) {
                props.onValueChange(item.value);
              } else {
                item.onClick?.();
              }
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}
