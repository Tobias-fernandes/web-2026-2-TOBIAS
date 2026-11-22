import { api, ApiError } from "@/lib/http";

/** What `GET/PUT /profile` answers — see aws/lambda/profile. */
export interface Profile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  bio: string;
  /** S3 key of the stored picture, when there is one. */
  photoKey: string | null;
  /** The picture itself, as a data URL. */
  photo: string | null;
  updatedAt: string | null;
}

export interface ProfileInput {
  name: string;
  email: string;
  phone: string;
  course: string;
  bio: string;
  /** A new picture as a data URL; `null` removes it; omitted keeps it. */
  photo?: string | null;
}

/** `null` while the user has never saved a profile (the API answers 404). */
export async function fetchProfile(): Promise<Profile | null> {
  try {
    return await api.get<Profile>("/profile");
  } catch (cause) {
    if (cause instanceof ApiError && cause.status === 404) return null;
    throw cause;
  }
}

export const saveProfile = (input: ProfileInput) =>
  api.put<Profile>("/profile", input);
