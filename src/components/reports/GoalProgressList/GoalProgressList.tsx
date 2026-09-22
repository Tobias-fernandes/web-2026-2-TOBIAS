import { Note, ProgressBar } from "@/components/ui";
import type { Tone } from "@/domain/constants";
import type { GoalProgress } from "@/domain/types";
import { formatMoney, formatPercent, formatScore } from "@/lib/format";
import type { GoalProgressListProps } from "./types";

/** "R$ 18.900 de R$ 45.000" — the target is only useful next to the figure. */
function describe(goal: GoalProgress): string {
  if (goal.format === "money") {
    return `${formatMoney(goal.current)} de ${formatMoney(goal.target)}`;
  }
  if (goal.format === "score") {
    return goal.current > 0
      ? `${formatScore(goal.current)} · meta ${formatScore(goal.target)}`
      : "Sem avaliação ainda";
  }
  return `${Math.round(goal.current)} de ${goal.target}`;
}

/**
 * A goal is behind when it trails the share of the term already spent, not when
 * it is below 100% — in week three every goal is below 100%.
 */
function toneFor(goal: GoalProgress, elapsed: number): Tone {
  if (goal.ratio >= 1) return "green";
  return goal.ratio >= elapsed ? "violet" : "amber";
}

const GoalProgressList: React.FC<GoalProgressListProps> = ({
  progress,
}: GoalProgressListProps) => {
  return (
    <>
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {progress.goals.map((goal) => (
          <li key={goal.label}>
            <ProgressBar
              ratio={goal.ratio}
              tone={toneFor(goal, progress.elapsed)}
              label={goal.label}
              value={describe(goal)}
              reference={progress.elapsed}
              referenceLabel={`${formatPercent(progress.elapsed)} da gestão percorrida`}
            />
          </li>
        ))}
      </ul>

      <Note>
        A linha vertical marca os {formatPercent(progress.elapsed)} da gestão{" "}
        {progress.cycleName} já percorridos. Barra à esquerda dela é meta
        atrasada para o ritmo da gestão.
      </Note>
    </>
  );
};

export { GoalProgressList };
