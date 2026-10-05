import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BrandLockup } from "./BrandLockup";
import type { BrandProps } from "./types";

/** The product's signature. Links to `/` on the public page and to `/app` inside the system. */
const Brand: React.FC<BrandProps> = ({ to = "/", className }) => {
  return (
    <Link
      to={to}
      className={cn("flex items-center text-tinta no-underline", className)}
    >
      <BrandLockup className="h-12 w-auto max-w-full" />
    </Link>
  );
};

export { Brand };
