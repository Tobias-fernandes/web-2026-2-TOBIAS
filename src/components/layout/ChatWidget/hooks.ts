import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { env } from "@/config/env";
import { generateId } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";
import {
  CHAT_GREETING,
  CHAT_HISTORY_LIMIT,
  CHAT_REPLY_TIMEOUT_MS,
} from "./constants";
import type {
  ChatMessage,
  ChatServerEvent,
  ChatStatus,
  ChatWidgetState,
} from "./types";

/**
 * The socket address with the Cognito access token on it.
 *
 * A query string because a browser WebSocket cannot set an `Authorization`
 * header. The Lambda verifies the token on `$connect` and refuses the
 * connection otherwise, so this is the only place the token travels — every
 * message after that rides the connection it already opened.
 */
const buildSocketUrl = (): string => {
  const url = new URL(env.chatUrl);
  const token = useAuthStore.getState().session?.accessToken;
  if (token) url.searchParams.set("token", token);
  return url.toString();
};

const parseEvent = (raw: unknown): ChatServerEvent | null => {
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw) as ChatServerEvent;
  } catch {
    return null;
  }
};

/**
 * Everything the chat knows: the socket, the conversation and the reply being
 * streamed in.
 *
 * The socket opens on the first time the panel opens, not on page load — most
 * sessions never touch the assistant, and each open connection is billed by
 * API Gateway. If it drops (API Gateway closes idle ones after ten minutes),
 * the next question simply opens a new one.
 */
const useChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([CHAT_GREETING]);
  const [replying, setReplying] = useState(false);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const socketRef = useRef<WebSocket | null>(null);
  /** Id of the assistant message the incoming chunks are appended to. */
  const replyIdRef = useRef<string | null>(null);
  /** Set while a reply is pending; doubles as "is a reply pending?" in socket callbacks. */
  const timeoutRef = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const finishReply = (failure?: string) => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;

    const replyId = replyIdRef.current;
    replyIdRef.current = null;
    setReplying(false);

    if (failure) {
      setError(failure);
      // A reply that failed before saying anything leaves no empty bubble behind.
      setMessages((current) =>
        current.filter((message) => message.id !== replyId || message.text),
      );
    }
  };

  const appendToReply = (text: string) => {
    let replyId = replyIdRef.current;
    if (!replyId) {
      replyId = generateId("msg");
      replyIdRef.current = replyId;
      const id = replyId;
      setMessages((current) => [...current, { id, role: "model", text }]);
      return;
    }
    const id = replyId;
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, text: message.text + text } : message,
      ),
    );
  };

  const handleEvent = (event: ChatServerEvent) => {
    switch (event.type) {
      case "start":
        appendToReply("");
        break;
      case "chunk":
        appendToReply(event.message);
        break;
      case "end":
        finishReply();
        break;
      case "error":
        finishReply(event.message);
        break;
    }
  };

  const connect = (): WebSocket => {
    const socket = new WebSocket(buildSocketUrl());
    socketRef.current = socket;
    setStatus("connecting");
    let opened = false;

    socket.onopen = () => {
      opened = true;
      setStatus("open");
    };
    socket.onmessage = (message) => {
      const event = parseEvent(message.data);
      if (event) handleEvent(event);
    };
    socket.onclose = () => {
      if (socketRef.current === socket) socketRef.current = null;
      setStatus("closed");
      // Closed before it ever opened: API Gateway refused the handshake, and
      // the only reason $connect refuses is the token.
      if (!opened) {
        finishReply(
          "Não foi possível conectar ao assistente. Se o problema continuar, saia e entre de novo.",
        );
        return;
      }
      if (timeoutRef.current !== null) {
        finishReply("A conexão com o assistente caiu. Tente de novo.");
      }
    };

    return socket;
  };

  /** Reuses the live socket, or opens a new one when there is none. */
  const ensureSocket = (): WebSocket => {
    const current = socketRef.current;
    if (
      current &&
      (current.readyState === WebSocket.OPEN ||
        current.readyState === WebSocket.CONNECTING)
    ) {
      return current;
    }
    return connect();
  };

  const send = () => {
    const text = draft.trim();
    if (!text || replying) return;

    // The greeting is ours, not the model's: sending it back would put words
    // in Gemini's mouth.
    const history = messages
      .filter((message) => message.id !== CHAT_GREETING.id && message.text)
      .slice(-CHAT_HISTORY_LIMIT)
      .map(({ role, text: body }) => ({ role, text: body }));
    // No `action`: the route selection finds no match and API Gateway hands the
    // message to `$default`, the route the Lambda answers questions on.
    const payload = JSON.stringify({
      message: text,
      history,
    });

    setMessages((current) => [
      ...current,
      { id: generateId("msg"), role: "user", text },
    ]);
    setDraft("");
    setError(null);
    setReplying(true);
    timeoutRef.current = window.setTimeout(
      () => finishReply("O assistente demorou demais para responder."),
      CHAT_REPLY_TIMEOUT_MS,
    );

    const socket = ensureSocket();
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(payload);
    } else {
      socket.addEventListener("open", () => socket.send(payload), {
        once: true,
      });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    send();
  };

  /** Enter sends, Shift+Enter breaks the line — the convention of every chat. */
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  };

  const toggle = () => {
    if (!open) ensureSocket();
    setOpen(!open);
  };

  const close = () => setOpen(false);

  // Follow the reply as it streams in.
  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, open]);

  useEffect(
    () => () => {
      socketRef.current?.close();
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const state: ChatWidgetState = {
    open,
    toggle,
    close,
    messages,
    replying,
    status,
    error,
    draft,
    setDraft,
    send,
  };

  return { ...state, listRef, handleSubmit, handleKeyDown };
};

export { useChatWidget };
