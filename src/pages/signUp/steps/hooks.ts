import { useState, type KeyboardEvent } from "react";
import { DIRECTORATE_LABELS } from "@/domain/constants";
import type { Directorate } from "@/domain/types";
import type { SignUpFormState, WorkAreaDraft } from "../types";

const DIRECTORATES = Object.keys(DIRECTORATE_LABELS) as Directorate[];

/** Drafting, de-duplicating and removing the courses an EJ admits from. */
const useCoursesStep = (
  value: SignUpFormState,
  onChange: (value: SignUpFormState) => void,
) => {
  const [draft, setDraft] = useState("");

  const add = () => {
    const name = draft.trim();
    if (!name) return;
    // Case-insensitive, because "Engenharia de Software" and "engenharia de
    // software" would otherwise become two courses that split every report.
    const exists = value.courses.some(
      (course) => course.toLowerCase() === name.toLowerCase(),
    );
    if (!exists) onChange({ ...value, courses: [...value.courses, name] });
    setDraft("");
  };

  const remove = (name: string) => {
    onChange({
      ...value,
      courses: value.courses.filter((item) => item !== name),
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    // Enter adds the course instead of submitting the step: the list is the
    // point of this screen, and advancing from it by accident loses what was
    // being typed.
    event.preventDefault();
    add();
  };

  return { draft, setDraft, add, remove, handleKeyDown };
};

export { useCoursesStep };

/**
 * Areas as cards that each hold their own functions.
 *
 * A function only ever leaves an area through that area's own "move" menu, so
 * nothing changes on a card the president did not touch. The earlier version
 * showed every function on every card and moved a function silently when it
 * was ticked elsewhere — which read as a bug.
 */
const useAreasStep = (
  value: SignUpFormState,
  onChange: (value: SignUpFormState) => void,
) => {
  const setAreas = (workAreas: WorkAreaDraft[]) =>
    onChange({ ...value, workAreas });

  const rename = (index: number, name: string) =>
    setAreas(
      value.workAreas.map((area, at) =>
        at === index ? { ...area, name } : area,
      ),
    );

  /** Takes a function off every area, then gives it to `target` (none when null). */
  const assign = (directorate: Directorate, target: number | null) =>
    setAreas(
      value.workAreas.map((area, at) => {
        const rest = area.directorates.filter((item) => item !== directorate);
        return at === target
          ? { ...area, directorates: [...rest, directorate] }
          : { ...area, directorates: rest };
      }),
    );

  // Removing an area leaves its functions without one, listed below the cards,
  // instead of quietly handing them to a neighbour.
  const remove = (index: number) =>
    setAreas(value.workAreas.filter((_, at) => at !== index));

  const add = () =>
    setAreas([...value.workAreas, { name: "", directorates: [] }]);

  const applyPreset = (areas: WorkAreaDraft[]) =>
    setAreas(
      areas.map((area) => ({ ...area, directorates: [...area.directorates] })),
    );

  const unassigned = DIRECTORATES.filter(
    (directorate) =>
      !value.workAreas.some((area) => area.directorates.includes(directorate)),
  );

  return {
    areas: value.workAreas,
    rename,
    assign,
    remove,
    add,
    applyPreset,
    unassigned,
  };
};

export { useAreasStep };
