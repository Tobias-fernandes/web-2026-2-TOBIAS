import { useId, useState } from "react";

/** Generates the label/input pairing id and drives the password reveal toggle. */
const useTextField = (type?: string) => {
  const id = useId();
  const [visible, setVisible] = useState(false);

  const isPassword = type === "password";
  const toggleVisible = () => setVisible((current) => !current);

  return { id, visible, isPassword, toggleVisible };
};

export { useTextField };
