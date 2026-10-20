/** `model` is Gemini's own name for the assistant's turn, kept so history goes out as-is. */
export type ChatRole = "user" | "model";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

export type ChatStatus = "idle" | "connecting" | "open" | "closed";

/**
 * What the Lambda pushes back over the socket for one question: a `start`, any
 * number of `chunk`s as Gemini streams, then an `end` — or an `error` at any
 * point instead.
 */
export type ChatServerEvent =
  | { type: "start" }
  | { type: "chunk"; message: string }
  | { type: "end" }
  | { type: "error"; message: string };

export interface ChatWidgetState {
  open: boolean;
  toggle: () => void;
  close: () => void;
  messages: ChatMessage[];
  /** `true` from the moment a question is sent until the reply ends. */
  replying: boolean;
  status: ChatStatus;
  error: string | null;
  draft: string;
  setDraft: (value: string) => void;
  send: () => void;
}
