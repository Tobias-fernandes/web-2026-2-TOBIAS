import { useState, type KeyboardEvent } from "react";
import type { SignUpFormState } from "../types";

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
