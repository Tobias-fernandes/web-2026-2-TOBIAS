import type { ChatMessage } from "./types";

/** Shown before the first question, so the panel never opens on a blank box. */
export const CHAT_GREETING: ChatMessage = {
  id: "greeting",
  role: "model",
  text: "Olá! Sou o assistente do AltoTech Manager. Como posso ajudar?",
};

/**
 * How many earlier messages travel with each question. The Lambda keeps no
 * memory of its own, so this is the conversation's whole context — and every
 * message sent is a token paid for.
 */
export const CHAT_HISTORY_LIMIT = 20;

/**
 * Gives up on a reply that never ends. A Lambda that crashes mid-answer sends
 * nothing more, and without this the input would stay locked forever.
 */
export const CHAT_REPLY_TIMEOUT_MS = 60_000;

export const CHAT_MAX_LENGTH = 2000;
