import { cn } from "@/lib/utils";
import { ChatIcon, CloseIcon, SendIcon } from "@/components/ui/icons";
import { CHAT_MAX_LENGTH } from "./constants";
import { useChatWidget } from "./hooks";
import type { ChatMessage } from "./types";

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const mine = message.role === "user";
  return (
    <p
      className={cn(
        "max-w-[85%] rounded-lg px-3 py-2 text-sm wrap-break-word whitespace-pre-wrap",
        mine
          ? "self-end rounded-br-sm bg-violeta-forte text-white"
          : "self-start rounded-bl-sm border border-linha bg-papel text-tinta",
      )}
    >
      {message.text}
    </p>
  );
};

/**
 * The assistant, docked to the corner of every screen inside the system.
 *
 * A panel rather than a modal on purpose: the point is to ask about the screen
 * you are on, so the page behind it has to stay readable and scrollable.
 * Rendered only when `VITE_CHAT_WS_URL` is set — see `AppLayout`.
 */
const ChatWidget: React.FC = () => {
  const {
    open,
    toggle,
    close,
    messages,
    replying,
    error,
    draft,
    setDraft,
    listRef,
    handleSubmit,
    handleKeyDown,
  } = useChatWidget();

  // Dots only until the first chunk lands; after that the text itself moves.
  const waitingFirstChunk =
    replying && messages[messages.length - 1]?.role === "user";

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Assistente"
          onKeyDown={(event) => event.key === "Escape" && close()}
          className="toast-entrada fixed inset-x-4 bottom-20 z-40 flex h-[min(560px,70dvh)] flex-col overflow-hidden rounded-xl border border-linha bg-papel-alto text-tinta shadow-xl sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-95"
        >
          <header className="flex items-center justify-between border-b border-linha px-4 py-3">
            <div>
              <h2 className="text-base font-semibold">Assistente</h2>
              <p className="text-2xs text-tinta-suave">
                Respostas geradas por IA — confira antes de usar.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Fechar assistente"
              className="rounded-md p-1.5 text-tinta-suave hover:bg-papel hover:text-tinta"
            >
              <CloseIcon size={18} />
            </button>
          </header>

          <div
            ref={listRef}
            aria-live="polite"
            className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4"
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {waitingFirstChunk && (
              <p
                role="status"
                className="self-start text-sm text-tinta-suave"
              >
                Digitando…
              </p>
            )}
            {error && (
              <p role="alert" className="self-start text-sm text-vermelho">
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t border-linha p-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              Sua mensagem
            </label>
            <textarea
              id="chat-input"
              autoFocus
              rows={1}
              maxLength={CHAT_MAX_LENGTH}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte alguma coisa…"
              className="max-h-32 min-h-10 flex-1 resize-none rounded-md border border-linha bg-papel px-3 py-2 text-base text-tinta placeholder:text-tinta-suave focus:border-violeta focus:outline-none"
            />
            <button
              type="submit"
              disabled={replying || !draft.trim()}
              aria-label="Enviar mensagem"
              className="flex size-10 shrink-0 items-center justify-center rounded-md bg-violeta-forte text-white hover:bg-violeta-escuro disabled:cursor-not-allowed disabled:opacity-55"
            >
              <SendIcon size={16} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Fechar assistente" : "Abrir assistente"}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-40 flex size-12 items-center justify-center rounded-full bg-violeta-forte text-white shadow-lg transition-colors hover:bg-violeta-escuro sm:right-6 sm:bottom-6"
      >
        {open ? <CloseIcon size={20} /> : <ChatIcon size={22} />}
      </button>
    </>
  );
};

export { ChatWidget };
