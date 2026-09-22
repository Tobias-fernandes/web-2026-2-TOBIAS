import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ZERO_FLOW } from "./constants";

/**
 * The walkthrough of an empty system, in dependency order.
 *
 * Numbered because the order is not a suggestion: each screen needs what the
 * one before it created, and the fastest way to see why the model is shaped
 * like this is to hit the wall — try to open a project before there is a
 * gestão to put it in.
 */
const ZeroFlow: React.FC = () => {
  return (
    <ol className="m-0 mb-8 flex list-none flex-col gap-2.5 p-0">
      {ZERO_FLOW.map((step, index) => (
        <li
          key={step.route + step.routeLabel}
          className="flex gap-3.5 rounded-lg border border-linha bg-papel-alto p-4"
        >
          <span
            aria-hidden
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violeta-lav font-display text-xs font-bold text-violeta"
          >
            {index + 1}
          </span>

          <div className="min-w-0">
            <Link
              to={step.route}
              className="inline-flex items-center gap-1.5 font-display font-bold text-violeta no-underline"
            >
              {step.routeLabel}
              <ArrowRightIcon size={14} />
            </Link>
            <p className="mt-1 mb-0 max-w-[72ch] text-base leading-relaxed text-tinta-suave">
              {step.what}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
};

export { ZeroFlow };
