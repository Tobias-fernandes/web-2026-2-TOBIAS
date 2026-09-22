import type {} from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { CardProps, CardTitleProps, CardLinkProps } from "./types";

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-linha bg-papel-alto p-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({ children, action }) => {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4">
      <h2 className="font-display text-md font-bold">{children}</h2>
      {action}
    </div>
  );
};

/**
 * "See the whole thing" link in a card's header.
 *
 * A card that summarises a screen always offers a way into it, and the four
 * that did were each carrying the same class string.
 */
const CardLink: React.FC<CardLinkProps> = ({ to, children }) => {
  return (
    <Link to={to} className="text-sm text-violeta no-underline">
      {children}
    </Link>
  );
};

export { Card };

export { CardTitle, CardLink };
