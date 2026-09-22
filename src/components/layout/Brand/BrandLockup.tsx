import logo from "@/assets/brand/altotech-manager-v2.png";
import type { BrandLockupProps } from "./types";
import { useBrandLockup } from "./hooks";

/** The approved artwork, framed without its transparent outer margins. */
const BrandLockup: React.FC<BrandLockupProps> = ({ className }) => {
  const { textMaskId } = useBrandLockup();

  return (
    <svg
      viewBox="265 126 1690 484"
      width={1690}
      height={484}
      role="img"
      aria-label="AltoTech Manager"
      className={className}
    >
      <defs>
        {/* Only the lettering changes with the theme; the bird keeps its colors. */}
        <mask
          id={textMaskId}
          maskUnits="userSpaceOnUse"
          x={780}
          y={126}
          width={1175}
          height={484}
          style={{ maskType: "alpha" }}
        >
          <image href={logo} width={2172} height={724} />
        </mask>
      </defs>
      <image href={logo} width={2172} height={724} />
      <rect
        x={780}
        y={126}
        width={1175}
        height={484}
        fill="light-dark(transparent, #eae8f6)"
        mask={`url(#${textMaskId})`}
      />
    </svg>
  );
};

export { BrandLockup };
