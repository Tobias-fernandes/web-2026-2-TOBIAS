import { Link } from "react-router-dom";
import { Button, Card, CardTitle, Note } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { StartingChecklist } from "./types";

/** The records an EJ that joined mid-term still has to register, in order. */
const StartingChecklistCard: React.FC<{ checklist: StartingChecklist }> = ({
  checklist,
}) => {
  const done = checklist.items.filter((item) => item.done).length;

  return (
    <Card className="mb-6">
      <CardTitle
        action={
          <Button type="button" variant="subtle" onClick={checklist.dismiss}>
            Dispensar
          </Button>
        }
      >
        Traga o que sua EJ já tem · {done} de {checklist.items.length}
      </CardTitle>

      <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 xl:grid-cols-5">
        {checklist.items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={cn(
                "block h-full rounded-lg border border-linha p-3 text-tinta no-underline hover:bg-papel",
                item.done && "opacity-60",
              )}
            >
              <span className="flex items-start gap-2 font-semibold">
                <span aria-hidden className="shrink-0">
                  {item.done ? "✓" : "○"}
                </span>
                {item.label}
                <span className="sr-only">
                  {item.done ? "(feito)" : "(pendente)"}
                </span>
              </span>
              <span className="mt-1 block text-sm text-tinta-suave">
                {item.text}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <Note>
        A gestão começou antes do sistema, então o saldo e o que já foi entregue
        vieram do cadastro. Cadastre aqui só o que ainda está em andamento, para
        nada ser contado duas vezes.
      </Note>
    </Card>
  );
};

export { StartingChecklistCard };
