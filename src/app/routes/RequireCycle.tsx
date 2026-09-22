import { Outlet } from "react-router-dom";
import { NoCycle } from "@/components/layout";
import { useActiveCycle } from "@/queries";

/**
 * Guards the screens that can only be read inside a management.
 *
 * Every query scoped to a cycle stays disabled while there is no cycle to scope
 * it to, so without this each of those screens would sit forever on a skeleton
 * waiting for a request that is never sent — the state a freshly installed
 * system is in, and the worst possible first impression.
 *
 * A route guard rather than a check inside each page, for the same reason
 * `RequireAuth` is one: the decision is about which screens may be opened, and
 * repeating it in eight components means eight places to forget it in the
 * ninth. It also stands in front of the "new record" buttons — a project saved
 * with an empty `cycleId` belongs to no management, and no report finds it
 * again.
 *
 * While the cycles are still loading it renders the screen, which shows its own
 * skeleton. "Loading" and "there is none" are different states and only the
 * second one belongs here.
 */
const RequireCycle: React.FC = () => {
  const { missing } = useActiveCycle();

  return missing ? <NoCycle /> : <Outlet />;
};

export { RequireCycle };
