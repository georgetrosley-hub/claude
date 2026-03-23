"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Square, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useApiKey } from "@/app/context/api-key-context";
import { cn } from "@/lib/utils";
import { readApiErrorMessage } from "@/lib/client/api";
import { SnowflakeLogoIcon } from "@/components/ui/snowflake-logo";
import type { Account, Competitor } from "@/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
  competitors: Competitor[];
  activeSection: string;
  /** When set, opens Deal Desk with this user message and streams the reply (POV Plan, etc.) */
  pendingUserMessage?: string | null;
  onPendingUserMessageConsumed?: () => void;
}

export function ChatPanel({
  isOpen,
  onClose,
  account,
  competitors,
  activeSection,
  pendingUserMessage,
  onPendingUserMessageConsumed,
}: ChatPanelProps) {
  const { hasApiKey, getRequestHeaders } = useApiKey();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const streamReply = useCallback(
    async (newMessages: Message[]) => {
      if (isStreaming) return;

      setMessages(newMessages);
      setIsStreaming(true);
      setStreamingContent("");

      const controller = new AbortController();
      abortRef.current = controller;
      let fullText = "";

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getRequestHeaders(),
          },
          body: JSON.stringify({
            messages: newMessages,
            account,
            competitors,
            section: activeSection,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(await readApiErrorMessage(response));
        }
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setStreamingContent(fullText);
                }
              } catch {
                // skip
              }
            }
          }
        }

        setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
        setStreamingContent("");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                error instanceof Error
                  ? error.message
                  : "Add API key to enable Deal Desk.",
            },
          ]);
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, account, competitors, activeSection, getRequestHeaders]
  );

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];
    setInput("");
    await streamReply(newMessages);
  }, [input, messages, isStreaming, streamReply]);

  useEffect(() => {
    if (!isOpen || !pendingUserMessage?.trim()) return;
    const content = pendingUserMessage.trim();
    onPendingUserMessageConsumed?.();
    setMessages((prev) => {
      const next = [...prev, { role: "user" as const, content }];
      queueMicrotask(() => {
        void streamReply(next);
      });
      return next;
    });
  }, [isOpen, pendingUserMessage, onPendingUserMessageConsumed, streamReply]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    if (streamingContent) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: streamingContent },
      ]);
      setStreamingContent("");
    }
    setIsStreaming(false);
  }, [streamingContent]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const assistantMarkdownComponents = {
    h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
      <h1 className="mt-2 text-[14px] font-semibold text-text-primary" {...props} />
    ),
    h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
      <h2 className="mt-2 text-[13px] font-semibold text-text-primary" {...props} />
    ),
    h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
      <h3 className="mt-2 text-[13px] font-medium text-text-primary" {...props} />
    ),
    p: (props: React.ComponentPropsWithoutRef<"p">) => (
      <p className="mt-1.5 first:mt-0 text-[13px] leading-relaxed text-text-secondary" {...props} />
    ),
    strong: (props: React.ComponentPropsWithoutRef<"strong">) => (
      <strong className="font-semibold text-text-primary" {...props} />
    ),
    ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
      <ul className="mt-1.5 list-disc space-y-1 pl-4" {...props} />
    ),
    ol: (props: React.ComponentPropsWithoutRef<"ol">) => (
      <ol className="mt-1.5 list-decimal space-y-1 pl-4" {...props} />
    ),
    li: (props: React.ComponentPropsWithoutRef<"li">) => (
      <li className="text-[13px] leading-relaxed text-text-secondary" {...props} />
    ),
    a: (props: React.ComponentPropsWithoutRef<"a">) => (
      <a
        {...props}
        target="_blank"
        rel="noreferrer"
        className="text-accent/90 underline decoration-accent/40 underline-offset-2 hover:text-accent"
      />
    ),
    code: (props: React.ComponentPropsWithoutRef<"code">) => (
      <code className="rounded bg-surface-muted/50 px-1 py-0.5 text-[12px] text-text-primary" {...props} />
    ),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] sm:bg-black/35"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden border-l border-surface-border/30 bg-surface/98 shadow-panel backdrop-blur-md sm:max-w-[480px] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          >
            {/* Header */}
            <div className="flex min-h-[52px] shrink-0 items-center justify-between border-b border-surface-border/45 bg-surface/80 px-4 py-3 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset]">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-surface-border/45 bg-surface-muted/25">
                  <SnowflakeLogoIcon size={18} />
                </span>
                <div className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold tracking-tight text-text-primary">
                    Deal Desk
                  </span>
                  <span className="truncate text-[10px] font-medium leading-tight text-text-faint">
                    {account.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      setMessages([]);
                      setStreamingContent("");
                    }}
                    className="ds-focus-ring rounded-lg p-2 text-text-muted transition-colors duration-150 hover:bg-surface-muted/50 hover:text-text-secondary active:scale-[0.97]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="ds-focus-ring rounded-lg p-2 text-text-muted transition-colors duration-150 hover:bg-surface-muted/50 hover:text-text-secondary active:scale-[0.97]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && !streamingContent && (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-4 text-center sm:px-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-border/50 bg-surface-muted/20 shadow-card">
                    <SnowflakeLogoIcon size={36} className="opacity-95" />
                  </div>
                  <p className="mb-1.5 text-[15px] font-semibold tracking-tight text-text-primary">
                    Deal Desk
                  </p>
                  <p
                    className={cn(
                      "max-w-sm text-[13px] leading-relaxed text-text-muted",
                      hasApiKey ? "mb-6" : "mb-4"
                    )}
                  >
                    {account.id === "na"
                      ? "Discovery, POV, and expansion — account-sharp answers."
                      : `${account.name}: discovery angles, POV proof, expansion motion.`}
                  </p>
                  {!hasApiKey && (
                    <div className="mb-6 rounded-lg border border-accent/25 bg-accent/[0.07] px-3 py-2 text-[11px] font-medium text-accent/95 shadow-[0_1px_0_rgb(255_255_255/0.04)_inset]">
                      Add API key to enable Deal Desk.
                    </div>
                  )}
                  <p className="mb-3 text-label text-text-faint/90">
                    Quick prompts
                  </p>
                  <div className="w-full max-w-sm space-y-2">
                    {[
                      `Land motion for ${account.name}`,
                      `Map stakeholders — ${account.name}`,
                      "Security & legal objections",
                      "Fastest credible pilot",
                      "Procurement & governance path",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                          setTimeout(() => inputRef.current?.focus(), 0);
                        }}
                        className="ds-focus-ring w-full rounded-xl border border-surface-border/45 bg-surface-elevated/35 px-3 py-2.5 text-left text-[12px] font-medium text-text-secondary shadow-[0_1px_0_rgb(255_255_255/0.03)_inset] transition-all duration-200 hover:border-accent/25 hover:bg-surface-muted/30 hover:text-text-primary active:scale-[0.99]"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-md">
                      <SnowflakeLogoIcon size={20} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2.5 text-[13px] leading-relaxed shadow-[0_1px_0_rgb(255_255_255/0.03)_inset]",
                      msg.role === "user"
                        ? "border border-accent/20 bg-accent/[0.09] text-text-primary"
                        : "border border-surface-border/35 bg-surface-elevated/55 text-text-secondary"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <div className="min-w-0">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={assistantMarkdownComponents}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>
                </div>
              ))}

              {isStreaming && streamingContent && (
                <div className="flex gap-3 justify-start">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/10">
                    <SnowflakeLogoIcon
                      size={20}
                      className="animate-pulse opacity-90"
                    />
                  </div>
                  <div className="max-w-[85%] rounded-xl border border-surface-border/35 bg-surface-elevated/55 px-3 py-2.5 text-[13px] leading-relaxed text-text-secondary shadow-[0_1px_0_rgb(255_255_255/0.03)_inset]">
                    <div className="min-w-0">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={assistantMarkdownComponents}
                      >
                        {streamingContent}
                      </ReactMarkdown>
                      <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse align-text-bottom bg-accent/50" />
                    </div>
                  </div>
                </div>
              )}

              {isStreaming && !streamingContent && (
                <div className="flex gap-3 justify-start">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/10">
                    <SnowflakeLogoIcon
                      size={20}
                      className="animate-pulse opacity-90"
                    />
                  </div>
                  <div className="rounded-xl border border-surface-border/35 bg-surface-elevated/50 px-3 py-2.5 shadow-[0_1px_0_rgb(255_255_255/0.03)_inset]">
                    <div className="flex gap-1.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent/45" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent/35" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent/30" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-surface-border/45 bg-surface/90 px-4 pb-6 pt-4 shadow-[0_-1px_0_rgb(255_255_255/0.03)_inset] sm:p-4">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask about ${account.name}...`}
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-surface-border/50 bg-surface-elevated/45 px-3 py-2.5 text-[13px] text-text-primary shadow-[0_1px_0_rgb(255_255_255/0.04)_inset] placeholder:text-text-muted/60 transition-colors duration-150 focus:border-accent/35 focus:outline-none focus:ring-2 focus:ring-accent/15"
                  style={{
                    maxHeight: "120px",
                    minHeight: "40px",
                    height: "auto",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                  }}
                />
                {isStreaming ? (
                  <button
                    onClick={stopStreaming}
                    className="ds-focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-border/45 bg-surface-muted/55 text-text-muted transition-colors duration-150 hover:bg-surface-muted hover:text-text-secondary active:scale-[0.97]"
                  >
                    <Square className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className={cn(
                      "ds-focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200",
                      input.trim()
                        ? "border-accent/30 bg-accent text-white shadow-[0_1px_0_rgb(255_255_255/0.15)_inset] hover:bg-accent/95 active:scale-[0.97]"
                        : "cursor-not-allowed border-transparent bg-surface-muted/35 text-text-muted/35"
                    )}
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
