import { useId } from "react";

const useBrandLockup = () => {
  const textMaskId = useId();

  return { textMaskId };
};

export { useBrandLockup };
