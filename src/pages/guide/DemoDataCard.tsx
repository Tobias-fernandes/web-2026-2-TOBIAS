import { Button, Card, CardTitle, Modal, Note } from "@/components/ui";
import type { DemoAction } from "./types";
import type { DemoDataCardProps } from "./types";

const CONFIRMATION: Record<
  DemoAction,
  { title: string; text: string; label: string }
> = {
  clear: {
    title: "Zerar os dados",
    text: "Apaga tudo que está gravado neste navegador: gestões, membros, clientes, negociações, projetos, alocações, horas, lançamentos e compromissos. O sistema reabre vazio, como no primeiro dia de uma EJ.",
    label: "Zerar tudo",
  },
  restore: {
    title: "Restaurar a demonstração",
    text: "Descarta o que você cadastrou e traz de volta os dados de exemplo: a gestão de 2026, os doze membros, os projetos em andamento, o funil, o caixa e o calendário.",
    label: "Restaurar",
  },
};

/**
 * The switch between an empty system and the demonstration.
 *
 * Lives on this page because the question it answers is this page's question:
 * how the system works. Reading the seven steps of a contract explains the
 * model; starting from nothing and being asked for a gestão before anything
 * else will accept a record is what makes it stick.
 */
const DemoDataCard: React.FC<DemoDataCardProps> = ({ demo }) => {
  if (!demo.available) return null;

  const confirmation = demo.confirming && CONFIRMATION[demo.confirming];

  return (
    <>
      <Card className="mb-8">
        <CardTitle>Testar o sistema do zero</CardTitle>

        <p className="mt-0 mb-4 max-w-[72ch] text-base leading-relaxed text-tinta-suave">
          Os dados que você está vendo são uma demonstração — uma EJ inventada,
          com um ano de histórico, para que nenhuma tela apareça vazia. Para
          entender de verdade como o sistema funciona, vale apagar tudo e
          percorrer o caminho na ordem em que uma EJ o percorreria. Os dois
          botões abaixo vão e voltam quantas vezes você quiser.
        </p>

        <div className="flex flex-wrap gap-2">
          <Button variant="danger" onClick={() => demo.ask("clear")}>
            Zerar os dados
          </Button>
          <Button variant="subtle" onClick={() => demo.ask("restore")}>
            Restaurar a demonstração
          </Button>
        </div>

        <Note>
          Vale só para este navegador: a demonstração é gravada localmente, e
          nada disso alcança outra pessoa que abrir o sistema. Sua sessão
          continua aberta — o login de demonstração é uma identidade, não um
          cadastro de membro, e segue funcionando com o sistema vazio.
        </Note>
      </Card>

      <Modal
        open={demo.confirming !== null}
        title={confirmation?.title ?? ""}
        onClose={demo.dismiss}
      >
        <div className="flex flex-col gap-5">
          <p className="m-0 text-base leading-relaxed text-tinta-suave">
            {confirmation?.text}
          </p>

          <div className="flex justify-end gap-2">
            <Button variant="subtle" onClick={demo.dismiss}>
              Cancelar
            </Button>
            <Button
              variant={demo.confirming === "clear" ? "dangerSolid" : "solid"}
              disabled={demo.running}
              onClick={demo.confirm}
            >
              {demo.running ? "Aplicando…" : (confirmation?.label ?? "")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export { DemoDataCard };
