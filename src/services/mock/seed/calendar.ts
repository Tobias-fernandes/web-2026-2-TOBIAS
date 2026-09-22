import type {
  CalendarEvent,
  Directorate,
  EventKind,
  IsoDate,
} from "@/domain/types";
import { CURRENT_CYCLE_ID } from "./cycles";

const ROOM = "Sala da EJ — Bloco IV, UFERSA";

/**
 * Demo agenda for the 2026 management.
 *
 * Written out one instance at a time because the model has no recurrence: a
 * weekly board meeting is four records, which is also how an EJ actually treats
 * it — one of the four gets moved, and two of them have a different agenda.
 */
function event(
  id: string,
  title: string,
  kind: EventKind,
  directorate: Directorate,
  startsAt: IsoDate,
  extra: Partial<CalendarEvent> = {},
): CalendarEvent {
  return {
    id,
    cycleId: CURRENT_CYCLE_ID,
    title,
    kind,
    directorate,
    audience: "enterprise",
    startsAt,
    endsAt: startsAt,
    allDay: false,
    startTime: "19:00",
    endTime: "20:30",
    location: ROOM,
    onlineUrl: null,
    description: "",
    projectId: null,
    status: "scheduled",
    createdBy: "mem-1",
    createdAt: "2026-08-24",
    ...extra,
  };
}

export const SEED_CALENDAR_EVENTS: CalendarEvent[] = [
  event(
    "evt-1",
    "Reunião de diretoria executiva",
    "meeting",
    "presidency",
    "2026-09-07",
    {
      audience: "directorate",
      startTime: "19:00",
      endTime: "20:30",
      description:
        "Fechamento de agosto: metas da gestão contra o ritmo do ano, caixa e carga da equipe.",
    },
  ),
  event(
    "evt-2",
    "Alinhamento semanal de projetos",
    "meeting",
    "projects",
    "2026-09-09",
    {
      audience: "directorate",
      startTime: "18:30",
      endTime: "19:30",
      onlineUrl: "https://meet.google.com/altotech-projetos",
      createdBy: "mem-3",
      description:
        "Status de cada projeto em execução e consumo do orçamento de horas.",
    },
  ),
  event(
    "evt-3",
    "Capacitação: escrita de proposta comercial",
    "training",
    "commercial",
    "2026-09-10",
    {
      startTime: "19:00",
      endTime: "21:00",
      createdBy: "mem-10",
      description:
        "Como transformar um diagnóstico em proposta: escopo, precificação por hora e prazos. Lance como hora de capacitação.",
    },
  ),
  event(
    "evt-4",
    "Reunião de diretoria executiva",
    "meeting",
    "presidency",
    "2026-09-14",
    {
      audience: "directorate",
      description: "Pauta fixa: funil, projetos, caixa e pessoas.",
    },
  ),
  event(
    "evt-5",
    "Visita técnica — Transportes Vale Verde",
    "commercial",
    "commercial",
    "2026-09-16",
    {
      startTime: "14:00",
      endTime: "16:00",
      location: "Sede do cliente — BR-405, Pau dos Ferros",
      projectId: "prj-2",
      createdBy: "mem-10",
      description:
        "Validação em campo do app de vistoria com os motoristas. Levar dois celulares para o teste offline.",
    },
  ),
  event(
    "evt-6",
    "Entrega do painel de indicadores da frota",
    "deadline",
    "projects",
    "2026-09-30",
    {
      allDay: true,
      startTime: null,
      endTime: null,
      location: "Remoto",
      projectId: "prj-3",
      createdBy: "mem-11",
      description: "Apresentação final ao cliente e coleta do NPS de entrega.",
    },
  ),
  event(
    "evt-7",
    "Abertura do processo seletivo 2026.2",
    "selection",
    "people",
    "2026-09-21",
    {
      endsAt: "2026-09-25",
      allDay: true,
      startTime: null,
      endTime: null,
      location: "Campus Pau dos Ferros",
      createdBy: "mem-9",
      description:
        "Semana de divulgação e inscrições. Marketing cobre as redes, gestão de pessoas recebe os candidatos.",
    },
  ),
  event(
    "evt-8",
    "Dinâmica em grupo do processo seletivo",
    "selection",
    "people",
    "2026-09-29",
    {
      startTime: "18:00",
      endTime: "21:00",
      createdBy: "mem-9",
      description:
        "Três rodadas de dinâmica. Cada diretor acompanha uma bancada.",
    },
  ),
  event(
    "evt-9",
    "Reunião geral de membros",
    "meeting",
    "presidency",
    "2026-09-24",
    {
      startTime: "19:00",
      endTime: "20:00",
      description:
        "Prestação de contas do trimestre para toda a EJ: faturamento, projetos entregues e o que vem no último trimestre.",
    },
  ),
  event(
    "evt-10",
    "Integração de novos membros",
    "social",
    "people",
    "2026-09-26",
    {
      startTime: "18:00",
      endTime: "22:00",
      location: "Espaço de convivência do campus",
      createdBy: "mem-9",
      description:
        "Boas-vindas aos aprovados e confraternização de fim de trimestre.",
    },
  ),
  event(
    "evt-11",
    "Planejamento editorial de outubro",
    "meeting",
    "marketing",
    "2026-09-28",
    {
      audience: "directorate",
      startTime: "18:30",
      endTime: "20:00",
      onlineUrl: "https://meet.google.com/altotech-marketing",
      createdBy: "mem-4",
      description:
        "Pauta do mês nas redes, ligada às origens que mais converteram no funil.",
    },
  ),
  event(
    "evt-12",
    "Fechamento contábil de setembro",
    "deadline",
    "finance",
    "2026-10-05",
    {
      allDay: true,
      startTime: null,
      endTime: null,
      location: "Remoto",
      createdBy: "mem-8",
      description:
        "Conciliar parcelas recebidas e pagas, dar baixa no que entrou e fechar o mês antes da reunião de diretoria.",
    },
  ),
  event(
    "evt-13",
    "Entrega do site institucional",
    "deadline",
    "projects",
    "2026-10-09",
    {
      allDay: true,
      startTime: null,
      endTime: null,
      location: "Remoto",
      projectId: "prj-1",
      createdBy: "mem-5",
      description: "Publicação, treinamento do cliente e coleta do NPS.",
    },
  ),
  event(
    "evt-14",
    "ENEJ — Encontro Nacional de Empresas Juniores",
    "external",
    "presidency",
    "2026-10-22",
    {
      endsAt: "2026-10-25",
      allDay: true,
      startTime: null,
      endTime: null,
      location: "A definir pela federação",
      description:
        "Quatro dias de encontro nacional. Quem for tem as horas lançadas como evento.",
    },
  ),
  event(
    "evt-15",
    "Reunião de diretoria executiva",
    "meeting",
    "presidency",
    "2026-09-21",
    {
      audience: "directorate",
      status: "cancelled",
      description:
        "Cancelada por conta da abertura do processo seletivo na mesma semana. Pauta remanejada para o dia 28.",
    },
  ),
];
