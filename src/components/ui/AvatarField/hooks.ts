import { useId, useState } from "react";
import { toSquareDataUrl } from "@/lib/image";

/**
 * Validates and shrinks the chosen file before it reaches the form.
 *
 * The error lives here rather than in the parent form: it is about this file
 * pick, not about the field's value, and it clears on the next attempt.
 */
const useAvatarField = (onChange: (value: string | null) => void) => {
  const id = useId();
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Escolha um arquivo de imagem.");
      return;
    }

    try {
      onChange(await toSquareDataUrl(file));
    } catch {
      setError("Não foi possível ler esta imagem.");
    }
  };

  const clear = () => onChange(null);

  return { id, error, handleFile, clear };
};

export { useAvatarField };
