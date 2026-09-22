import { clearTenant, markEmpty } from "./tenantStorage";

/**
 * Emptying the demo, and putting it back.
 *
 * Both exist so the system can be walked from the first day of a junior
 * enterprise: no gestão, no members, no contracts — which is the only way to
 * see what each screen asks for and in what order.
 *
 * Neither touches the session or the theme. Signing out whoever pressed the
 * button would be a strange reward for it, and the demo login is an identity,
 * not a member record — it keeps working against an empty system.
 *
 * Neither knows which registers exist, either. Clearing drops whatever the
 * enterprise had stored and raises its empty mark; every repository reads that
 * mark when it finds nothing, so a register added tomorrow is emptied by the
 * same call without anyone updating a list.
 *
 * Both act on the signed-in enterprise alone. Emptying the demo in one tab must
 * not empty the EJ that registered in another.
 */

/** Wipes what this enterprise stored and marks the emptiness as deliberate. */
export function clearDemoData(): void {
  clearTenant();
  markEmpty();
}

/** Drops the stored copy and the mark, so each register falls back to its seed. */
export function restoreDemoData(): void {
  clearTenant();
}
