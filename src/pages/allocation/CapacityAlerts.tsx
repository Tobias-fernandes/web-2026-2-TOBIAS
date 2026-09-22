import { Card } from "@/components/ui";
import type { MemberWorkload } from "@/domain/types";
import type { CapacityAlertsProps } from "./types";

const names = (rows: MemberWorkload[]) =>
  rows.map((row) => row.name).join(", ");

/** The two warnings a people director should read before the table. */
const CapacityAlerts: React.FC<CapacityAlertsProps> = ({
  overloaded,
  idle,
}) => {
  if (overloaded.length === 0 && idle.length === 0) return null;

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2">
      {overloaded.length > 0 && (
        <Card className="border-ambar-lav bg-ambar-lav p-4">
          <p className="m-0 text-base leading-relaxed text-ambar">
            <strong className="font-semibold">
              {overloaded.length} membro(s) sobrecarregado(s):
            </strong>{" "}
            {names(overloaded)}. A soma das alocações passa da carga que essas
            pessoas pactuaram.
          </p>
        </Card>
      )}

      {idle.length > 0 && (
        <Card className="p-4">
          <p className="m-0 text-base leading-relaxed text-tinta-suave">
            <strong className="font-semibold text-tinta">
              {idle.length} membro(s) sem projeto:
            </strong>{" "}
            {names(idle)}. Ficar de fora é o que antecede um desligamento.
          </p>
        </Card>
      )}
    </div>
  );
};

export { CapacityAlerts };
