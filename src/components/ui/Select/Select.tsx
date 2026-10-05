import { CheckIcon, ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { TRIGGER_SIZE_CLASSES } from "./constants";
import { useSelect } from "./hooks";
import type { SelectProps } from "./types";

/**
 * A select drawn in the system's own style, in place of the browser's.
 *
 * The native `<select>` opens a list the page cannot style — grey, square and
 * different on every operating system — in the middle of screens where every
 * other surface is a rounded card. This keeps what the native one got right:
 * the keyboard (arrows, Home/End, typing to jump, Enter, Escape), focus that
 * never leaves the trigger, and a list that is never clipped by a scrolling
 * table or hidden under a modal, because it opens in the top layer.
 */
const Select = <T extends string>({
  value,
  options,
  onValueChange,
  placeholder = "Selecione…",
  disabled,
  invalid,
  size = "field",
  className,
  id,
  labelledBy,
  "aria-label": ariaLabel,
}: SelectProps<T>) => {
  const select = useSelect({ value, options, onValueChange, disabled });

  return (
    <>
      <button
        ref={select.triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={select.open}
        aria-controls={select.listId}
        aria-activedescendant={
          select.open ? select.optionId(select.active) : undefined
        }
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={select.toggle}
        onKeyDown={select.onKeyDown}
        onKeyUp={select.onKeyUp}
        className={cn(
          TRIGGER_SIZE_CLASSES[size],
          "cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
          select.open && "border-violeta",
          invalid && "border-ambar",
          className,
        )}
      >
        <span
          className={cn("truncate", !select.selected && "text-tinta-suave/70")}
        >
          {select.selected?.label ?? placeholder}
        </span>
        <ChevronDownIcon
          size={size === "compact" ? 12 : 16}
          className={cn(
            "shrink-0 opacity-70 transition-transform duration-150",
            select.open && "rotate-180",
          )}
        />
      </button>

      <div
        ref={select.listRef}
        id={select.listId}
        role="listbox"
        popover="manual"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : ariaLabel}
        className="menu-entrada inset-auto m-0 max-h-72 overflow-y-auto rounded-lg border border-linha bg-papel-alto p-1 text-tinta shadow-[0_8px_24px_rgb(0_0_0/0.14)]"
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          const isActive = index === select.active;
          return (
            <div
              key={option.value}
              id={select.optionId(index)}
              role="option"
              aria-selected={isSelected}
              // Keeps focus on the trigger, where the keyboard is listened to.
              onPointerDown={(event) => event.preventDefault()}
              onPointerMove={() => {
                if (!isActive) select.highlight(index);
              }}
              onClick={() => select.choose(index)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-2 text-sm whitespace-nowrap",
                isActive && "bg-violeta-lav text-violeta",
                isSelected && "font-semibold",
              )}
            >
              {option.label}
              <CheckIcon
                size={14}
                aria-hidden
                className={cn(
                  "shrink-0 text-violeta",
                  !isSelected && "invisible",
                )}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export { Select };
