import { isUsingMockData } from "@/config/env";
import { apiOnboarding } from "./apiOnboarding";
import { mockOnboarding } from "./mockOnboarding";
import type { OnboardingService } from "./types";

/**
 * Registering a junior enterprise.
 *
 * Chosen the same way the data layer is, by VITE_DATA_SOURCE, so the screen
 * never knows which one it is talking to.
 */
export const onboardingService: OnboardingService = isUsingMockData
  ? mockOnboarding
  : apiOnboarding;

export { SignUpError } from "./SignUpError";
export type { OnboardingService, SignUpInput } from "./types";
