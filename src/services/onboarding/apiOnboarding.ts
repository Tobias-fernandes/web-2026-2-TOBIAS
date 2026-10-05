import type { Session } from "@/domain/types";
import { api } from "@/lib/http";
import type { OnboardingService, SignUpInput } from "./types";

/**
 * Registering an enterprise against the API.
 *
 * Both calls are public — they run before anyone can be signed in, which is the
 * whole point of them — so neither carries a token.
 *
 * `POST /signup` writes the enterprise, its courses and areas, the first cycle
 * (with its starting point, when the EJ joins mid-term) and the president in
 * one transaction, and creates the Cognito user with the
 * enterprise stamped on it as a claim. That stamping is why registration cannot
 * happen in the browser: it needs AWS credentials, and a client that could
 * write its own tenant could write somebody else's.
 *
 * The API must also refuse (400) areas that break `workAreaConflict`: an area
 * with no function, or one function given to two areas.
 *
 * The API must refuse (409, with the message in the body) a CNPJ that already
 * has an enterprise, even though the form asks `isCnpjTaken` first: two people
 * registering the same EJ at once would both pass that check.
 *
 * It answers with no session. Cognito will not sign in an account that has not
 * confirmed its e-mail, so the screen sends the president to the login page and
 * they arrive through the normal door.
 */
export const apiOnboarding: OnboardingService = {
  async signUp(input: SignUpInput): Promise<Session | null> {
    await api.post<void>("/signup", input);
    return null;
  },

  isCnpjTaken(cnpj: string) {
    return api.get<boolean>("/signup/cnpj-taken", { cnpj });
  },
};
