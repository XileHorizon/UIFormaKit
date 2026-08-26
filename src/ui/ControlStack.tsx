import type { ComponentProps, ReactNode } from "react";
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
  props: ControlStackProps<T>
) {
  const {
    items,
    className = "",
  } = props;

  const isRadio = props.radio === true;

  return (
    <div
      className={`uf-control-stack ${className}`.trim()}
      role={isRadio ? "radiogroup" : undefined}
      aria-label={isRadio ? props.label : undefined}
    >
      {items.map((item) => {
        const checked =
          isRadio && props.value === item.value;

        return (
          <Button
            {...item.buttonProps}
            key={item.value}
            type="button"
            disabled={
              item.disabled ||
              item.buttonProps?.disabled
            }
            role={isRadio ? "radio" : undefined}
            aria-checked={
              isRadio ? checked : undefined
            }
            data-state={
              isRadio
                ? checked
                  ? "checked"
                  : "unchecked"
                : undefined
            }
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