import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { env } from "@/config/env";
import { useAuthStore, useCurrentUser } from "@/stores/auth";
import { toast, toastMutationError } from "@/stores/toast";
import { fetchProfile, saveProfile, type ProfileInput } from "./api";

const PROFILE_KEY = ["profile"] as const;

type FormState = Omit<ProfileInput, "photo">;

const EMPTY_FORM: FormState = { name: "", email: "", phone: "", course: "", bio: "" };

/**
 * The profile screen's state: what the API has stored, the form being edited
 * and the picture picked but not yet sent.
 */
export const useProfilePage = () => {
  const user = useCurrentUser();
  const queryClient = useQueryClient();
  const configured = Boolean(env.apiUrl);

  const profile = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: fetchProfile,
    enabled: configured && Boolean(user),
  });

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  /** `undefined` = picture untouched; a data URL or `null` = changed. */
  const [photo, setPhoto] = useState<string | null | undefined>(undefined);

  // Fill the form once the stored profile (or, the first time, the session) is known.
  useEffect(() => {
    if (!profile.isSuccess) return;
    const stored = profile.data;
    setForm({
      name: stored?.name || user?.name || "",
      email: stored?.email || user?.email || "",
      phone: stored?.phone ?? "",
      course: stored?.course ?? "",
      bio: stored?.bio ?? "",
    });
    setPhoto(undefined);
    if (stored) {
      useAuthStore.getState().updateUser({
        name: stored.name || user?.name,
        ...(stored.photo ? { avatarUrl: stored.photo } : {}),
      });
    }
    // Only when a new answer arrives — not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.data, profile.isSuccess]);

  const save = useMutation({
    mutationFn: () =>
      saveProfile({ ...form, ...(photo !== undefined ? { photo } : {}) }),
    onSuccess: (saved) => {
      queryClient.setQueryData(PROFILE_KEY, saved);
      useAuthStore.getState().updateUser({
        name: saved.name,
        avatarUrl: saved.photo ?? user?.providerAvatarUrl ?? null,
      });
      toast.success("Perfil atualizado.");
    },
    onError: (cause) => toastMutationError(cause, "Não foi possível salvar o perfil."),
  });

  const setField = (field: keyof FormState) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const shownPhoto =
    photo !== undefined ? photo : (profile.data?.photo ?? null);

  return {
    user,
    configured,
    profile,
    form,
    setField,
    photo: shownPhoto,
    setPhoto,
    save,
  };
};
