import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  LIST_OFFSET_PX,
  PAGE_STEP,
  TYPEAHEAD_RESET_MS,
  VIEWPORT_MARGIN_PX,
} from "./constants";
import type { SelectOption } from "./types";

/** Case- and accent-blind, so typing "gestao" finds "Gestão". */
const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const isPrintable = (event: KeyboardEvent) =>
  event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

/**
 * Places the list under the trigger — or over it when there is more room
 * above — and keeps it inside the viewport.
 *
 * Fixed coordinates, because the list lives in the browser's top layer: that
 * is what lets it escape a table that scrolls sideways and sit above a modal
 * dialog, and it also means it no longer moves with its parent on its own.
 */
function place(trigger: HTMLElement, list: HTMLElement) {
  const rect = trigger.getBoundingClientRect();
  const height = list.offsetHeight;
  const below = window.innerHeight - rect.bottom;
  const flip = below < height + VIEWPORT_MARGIN_PX && rect.top > below;

  list.style.minWidth = `${rect.width}px`;
  list.style.top = `${
    flip ? rect.top - height - LIST_OFFSET_PX : rect.bottom + LIST_OFFSET_PX
  }px`;
  list.style.left = `${Math.max(
    VIEWPORT_MARGIN_PX,
    Math.min(
      rect.left,
      window.innerWidth - list.offsetWidth - VIEWPORT_MARGIN_PX,
    ),
  )}px`;
}

/**
 * Behaviour of a select-only combobox, following the WAI-ARIA pattern: focus
 * stays on the trigger the whole time, and the highlighted option is announced
 * through `aria-activedescendant` rather than by moving focus into the list.
 */
export function useSelect<T extends string>({
  value,
  options,
  onValueChange,
  disabled,
}: {
  value: T;
  options: readonly SelectOption<T>[];
  onValueChange: (value: T) => void;
  disabled?: boolean;
}) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef({ text: "", at: 0 });

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const count = options.length;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const active = Math.min(activeIndex, count - 1);
  const optionId = (index: number) => `${listId}-${index}`;

  function openAt(index: number) {
    if (disabled || count === 0) return;
    setActiveIndex(Math.max(0, Math.min(index, count - 1)));
    setOpen(true);
  }

  /**
   * Closing also forgets what was typed: a search belongs to one opening, and
   * a stale one would make the next Space extend it instead of choosing.
   */
  function close() {
    typeahead.current = { text: "", at: 0 };
    setOpen(false);
  }

  function choose(index: number) {
    const option = options[index];
    if (option && option.value !== value) onValueChange(option.value);
    close();
    triggerRef.current?.focus();
  }

  /**
   * The option whose label starts with what was typed. A single repeated
   * letter cycles through the options sharing it, as a native select does.
   */
  function search(key: string, from: number): number {
    const now = Date.now();
    const state = typeahead.current;
    state.text = now - state.at > TYPEAHEAD_RESET_MS ? key : state.text + key;
    state.at = now;

    const wanted = fold(state.text);
    const cycling = [...wanted].every((char) => char === wanted[0]);
    const start = cycling ? from + 1 : from;
    for (let step = 0; step < count; step += 1) {
      const index = (start + step + count) % count;
      const label = fold(options[index].label);
      if (label.startsWith(cycling ? wanted[0] : wanted)) return index;
    }
    return -1;
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;

    if (!open) {
      const opening: Record<string, number> = {
        ArrowDown: selectedIndex >= 0 ? selectedIndex : 0,
        ArrowUp: selectedIndex >= 0 ? selectedIndex : count - 1,
        Enter: Math.max(selectedIndex, 0),
        " ": Math.max(selectedIndex, 0),
        Home: 0,
        End: count - 1,
      };
      if (key in opening) {
        event.preventDefault();
        openAt(opening[key]);
      } else if (isPrintable(event)) {
        event.preventDefault();
        const found = search(key, Math.max(selectedIndex, 0));
        if (found >= 0) openAt(found);
      }
      return;
    }

    // While a search is being typed, a space is part of it ("Gestão de…").
    const searching =
      typeahead.current.text !== "" &&
      Date.now() - typeahead.current.at < TYPEAHEAD_RESET_MS;
    const moves: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowUp: active - 1,
      Home: 0,
      End: count - 1,
      PageDown: active + PAGE_STEP,
      PageUp: active - PAGE_STEP,
    };

    if (key in moves) {
      event.preventDefault();
      setActiveIndex(Math.max(0, Math.min(moves[key], count - 1)));
    } else if (key === "Enter" || (key === " " && !searching)) {
      event.preventDefault();
      choose(active);
    } else if (key === "Escape") {
      // Also keeps a modal around the select from closing with it.
      event.preventDefault();
      close();
    } else if (key === "Tab") {
      close();
    } else if (isPrintable(event)) {
      event.preventDefault();
      const found = search(key, active);
      if (found >= 0) setActiveIndex(found);
    }
  }

  // Shown in the top layer and placed before paint, so it never flashes at
  // the popover's default position in the middle of the screen.
  useLayoutEffect(() => {
    const list = listRef.current;
    const trigger = triggerRef.current;
    if (!list || !trigger) return;
    if (open) {
      if (!list.matches(":popover-open")) list.showPopover();
      place(trigger, list);
    } else if (list.matches(":popover-open")) {
      list.hidePopover();
    }
  }, [open, count]);

  // Follows the trigger while the page scrolls under it, and closes on a
  // press anywhere outside — the list is `manual`, so nobody else will.
  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      if (triggerRef.current && listRef.current) {
        place(triggerRef.current, listRef.current);
      }
    };
    const dismiss = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !listRef.current?.contains(target)
      ) {
        close();
      }
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    document.addEventListener("pointerdown", dismiss, true);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      document.removeEventListener("pointerdown", dismiss, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      document
        .getElementById(`${listId}-${active}`)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [open, active, listId]);

  return {
    open,
    active,
    listId,
    optionId,
    triggerRef,
    listRef,
    selected: selectedIndex >= 0 ? options[selectedIndex] : undefined,
    toggle: () => (open ? close() : openAt(Math.max(selectedIndex, 0))),
    choose,
    highlight: setActiveIndex,
    onKeyDown,
    // A button fires `click` when Space is released; without this, the Space
    // that opened the list would close it again on the way up.
    onKeyUp: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === " ") event.preventDefault();
    },
  };
}
