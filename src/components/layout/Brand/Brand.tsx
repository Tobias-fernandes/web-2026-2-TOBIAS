import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BrandLockup } from "./BrandLockup";
import type { BrandProps } from "./types";

/** Assinatura do produto. Aponta para `/` na página pública e para `/app` dentro do sistema. */
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
