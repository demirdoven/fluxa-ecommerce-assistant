"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";

type Msg = { id: number; text: string; sender: "user" | "bot" };

type ActionState = { reply: string | null; ts: number };

export default function ChatboxClient() {
  const TEST_USER_ID = process.env.NEXT_PUBLIC_SENSAY_TEST_USER_ID as string | undefined;
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [pending, setPending] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isFullSize, setIsFullSize] = useState(false);
  const [unread, setUnread] = useState(0);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<number>(1); // last used id
  const pendingBotIdRef = useRef<number | null>(null);

  function scrollToBottom(immediate = false) {
    const el = scrollRef.current;
    if (!el) return;
    const doScroll = () => {
      el.scrollTop = el.scrollHeight;
    };
    if (immediate) doScroll();
    else requestAnimationFrame(doScroll);
  }

  // Load existing history on mount
  useEffect(() => {
    let aborted = false;
    async function loadHistory() {
      try {
        const qs = new URLSearchParams();
        qs.set("limit", "30");
        if (TEST_USER_ID) qs.set("userId", TEST_USER_ID);
        const resp = await fetch(`/api/sensay/history?${qs.toString()}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        // Try to extract an array of messages with role/content
        const candidates: any[] = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.messages)
          ? data.messages
          : [];

        const parsed: Msg[] = candidates
          .map((m: any) => ({
            role: m?.role ?? m?.sender,
            content: m?.content ?? m?.text ?? "",
          }))
          .filter((m: any) => typeof m.content === "string" && m.content.trim() !== "")
          .map((m: any, idx: number) => ({
            id: idx + 1,
            text: m.content,
            sender: m.role === "user" ? "user" : "bot",
          }));

        // Keep only the last 30 to show the most recent conversation
        const limited = parsed.length > 30 ? parsed.slice(-30) : parsed;

        if (!aborted && limited.length > 0) {
          setMessages(limited);
          idRef.current = limited[limited.length - 1]?.id ?? 1;
          setHistoryLoaded(true);
          // unread from localStorage baseline using signature when available
          try {
            const LAST_SEEN_KEY = `sensay:lastSeen:${TEST_USER_ID || "default"}`;
            const LAST_SEEN_SIG_KEY = `sensay:lastSeenSig:${TEST_USER_ID || "default"}`;
            const lastSeen = Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
            const lastSeenSig = localStorage.getItem(LAST_SEEN_SIG_KEY);
            const hasBaseline = !!lastSeenSig || lastSeen > 0;
            let lastSeenIndex = 0;
            if (lastSeenSig) {
              try {
                const sig = JSON.parse(lastSeenSig) as { sender: Msg["sender"]; text: string };
                for (let i = limited.length - 1; i >= 0; i--) {
                  const m = limited[i];
                  if (m.sender === sig.sender && m.text === sig.text) {
                    lastSeenIndex = i + 1; // messages after this index are unread
                    break;
                  }
                }
              } catch {}
            }
            // Fallback to numeric id if signature didn't match
            if (lastSeenIndex === 0 && lastSeen > 0) {
              lastSeenIndex = limited.findIndex((m) => m.id === lastSeen) + 1;
            }
            const unreadCount = hasBaseline
              ? limited.filter((m, idx) => idx >= lastSeenIndex && m.sender === "bot" && m.text !== "…").length
              : 0;
            setUnread(unreadCount);
          } catch {}
          // Ensure we start at the latest message when history loads
          setTimeout(() => scrollToBottom(true), 50);
        }
      } catch (e) {
        // Fail-soft: keep default greeting
        console.warn("History load failed:", e);
      }
    }
    loadHistory();
    return () => {
      aborted = true;
    };
  }, [TEST_USER_ID]);

  // Maintain lastSeen and unread based on visibility and new messages
  useEffect(() => {
    if (!historyLoaded) return; // avoid flicker before history arrives
    const LAST_SEEN_KEY = `sensay:lastSeen:${TEST_USER_ID || "default"}`;
    const LAST_SEEN_SIG_KEY = `sensay:lastSeenSig:${TEST_USER_ID || "default"}`;
    // Find latest REAL message id (exclude bot placeholder '…')
    const latestRealId = (() => {
      for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i];
        if (m.sender === "bot" && m.text === "…") continue;
        return m.id;
      }
      return 0;
    })();
    if (!isMinimized && (isExpanded || isFullSize)) {
      // When visible, mark all as seen
      try {
        localStorage.setItem(LAST_SEEN_KEY, String(latestRealId));
        // Persist a signature of the latest real message for cross-refresh stability
        const latestRealMsg = (() => {
          for (let i = messages.length - 1; i >= 0; i--) {
            const m = messages[i];
            if (m.sender === "bot" && m.text === "…") continue;
            return m;
          }
          return undefined;
        })();
        if (latestRealMsg) {
          localStorage.setItem(
            LAST_SEEN_SIG_KEY,
            JSON.stringify({ sender: latestRealMsg.sender, text: latestRealMsg.text })
          );
        }
      } catch {}
      if (unread !== 0) setUnread(0);
    } else {
      // When hidden, count bot messages after last seen
      try {
        const lastSeen = Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
        const lastSeenSig = localStorage.getItem(LAST_SEEN_SIG_KEY);
        const hasBaseline = !!lastSeenSig || lastSeen > 0;
        let lastSeenIndex = 0;
        if (lastSeenSig) {
          try {
            const sig = JSON.parse(lastSeenSig) as { sender: Msg["sender"]; text: string };
            for (let i = messages.length - 1; i >= 0; i--) {
              const m = messages[i];
              if (m.sender === sig.sender && m.text === sig.text) {
                lastSeenIndex = i + 1;
                break;
              }
            }
          } catch {}
        }
        if (lastSeenIndex === 0 && lastSeen > 0) {
          lastSeenIndex = messages.findIndex((m) => m.id === lastSeen) + 1;
        }
        const count = hasBaseline
          ? messages.filter((m, idx) => idx >= lastSeenIndex && m.sender === "bot" && m.text !== "…").length
          : 0;
        setUnread(count);
      } catch {}
    }
  }, [messages, isExpanded, isFullSize, isMinimized, TEST_USER_ID, unread, historyLoaded]);

  // yeni mesaj geldikçe veya pencere açılınca alta kaydır (deferred for layout)
  useEffect(() => {
    scrollToBottom();
  }, [messages, isExpanded, isFullSize]);

  // chatbox dışına tıklayınca minimize
  useEffect(() => {
    if (isMinimized) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isMinimizedIcon = target.closest(".chatbox-minimized-icon");
      if (isMinimizedIcon) return;
      if (chatboxRef.current && !chatboxRef.current.contains(target)) {
        setIsFullSize(false);
        setIsExpanded(false);
        setIsMinimized(true);
      }
    };
    if (isExpanded || isFullSize) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded, isFullSize, isMinimized]);

  // Focus input when chat becomes visible/open
  useEffect(() => {
    if (isMinimized) return;
    if (isExpanded || isFullSize) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [isExpanded, isFullSize, isMinimized]);

  // After open/resize transitions (300ms in inline style), force scroll to bottom
  useEffect(() => {
    if (isMinimized) return;
    if (isExpanded || isFullSize) {
      const id = setTimeout(() => scrollToBottom(true), 330);
      return () => clearTimeout(id);
    }
  }, [isExpanded, isFullSize, isMinimized]);

  const toggleFullSize = () => {
    setIsFullSize((v) => !v);
    // After toggling size, ensure we snap to bottom
    setTimeout(() => scrollToBottom(true), 0);
  };
  const handleRestore = () => {
    setIsMinimized(false);
    setIsExpanded(true);
    // Mark all current as seen immediately on open
    try {
      const LAST_SEEN_KEY = `sensay:lastSeen:${TEST_USER_ID || "default"}`;
      const LAST_SEEN_SIG_KEY = `sensay:lastSeenSig:${TEST_USER_ID || "default"}`;
      // Use latest real id (exclude placeholder)
      let latestRealId = 0;
      let latestRealMsg: Msg | undefined = undefined;
      for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i];
        if (m.sender === "bot" && m.text === "…") continue;
        latestRealId = m.id;
        latestRealMsg = m;
        break;
      }
      localStorage.setItem(LAST_SEEN_KEY, String(latestRealId));
      if (latestRealMsg) {
        localStorage.setItem(
          LAST_SEEN_SIG_KEY,
          JSON.stringify({ sender: latestRealMsg.sender, text: latestRealMsg.text })
        );
      }
      setUnread(0);
    } catch {}
    // Ensure we scroll after the element mounts
    setTimeout(() => scrollToBottom(true), 0);
  };

  // Form submit olmadan hemen önce UI'ı optimistik güncelle
  function handleSubmitPrep() {
    const text = inputValue.trim();
    if (!text) return false;

    // user mesajı
    const userId = ++idRef.current;
    const userMsg: Msg = { id: userId, text, sender: "user" };
    // bot placeholder
    const botId = ++idRef.current;
    pendingBotIdRef.current = botId;

    setMessages((prev) => [...prev, userMsg, { id: botId, text: "…", sender: "bot" }]);
    setInputValue("");
    return true;
  }

  // Client-side submit to our API route
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const textToSend = inputValue.trim();
    if (!textToSend) return;

    // Optimistic UI update
    const ok = handleSubmitPrep();
    if (!ok) return; // safety

    setPending(true);
    const botId = pendingBotIdRef.current!;
    try {
      const resp = await fetch("/api/sensay/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSend,
          ...(TEST_USER_ID ? { userId: TEST_USER_ID } : {}),
        }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const replyText = await resp.text();
      setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, text: replyText || "(no reply)" } : m)));
    } catch (err: any) {
      setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, text: `Error: ${err?.message || "failed"}` } : m)));
    } finally {
      pendingBotIdRef.current = null;
      setPending(false);
    }
  }

  // Minimized icon
  if (isMinimized) {
    return (
      <div
        className="chatbox-minimized-icon fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center cursor-pointer z-[9999] transform transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
        onClick={handleRestore}
        title="Open chat"
        aria-label="Open chat"
        role="button"
      >
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-[11px] leading-5 text-center font-semibold shadow-md select-none">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      <div
        className={`chatbox-backdrop fixed inset-0 bg-black/25 z-[9998] transition-opacity duration-700 ease-out ${
          isExpanded || isFullSize
            ? "opacity-100 pointer-events-auto backdrop-blur"
            : "opacity-0 pointer-events-none backdrop-blur-none"
        }`}
        onClick={() => (isFullSize ? toggleFullSize() : setIsExpanded(false))}
      />

      <div
        ref={chatboxRef}
        className={`fixed bg-white rounded-xl shadow-xl flex flex-col ${
          isFullSize
            ? "w-3/4 h-[80vh] z-[9999]"
            : isExpanded
            ? "w-96 h-[600px] z-[9999]"
            : "w-96 h-16 overflow-hidden z-[9999]"
        } transition-all duration-300`}
        style={{
          opacity: isExpanded || isFullSize ? 1 : 0,
          transform: isFullSize
            ? "translate(-50%, -50%)"
            : isExpanded
            ? "translateY(0)"
            : "translateY(20px)",
          top: isFullSize ? "50%" : "auto",
          left: isFullSize ? "50%" : "auto",
          bottom: isFullSize ? "auto" : "24px",
          right: isFullSize ? "auto" : "24px",
          animation: isExpanded || isFullSize ? "fadeIn 0.3s ease-out forwards" : "none",
          transformOrigin: "bottom right",
        }}
      >
        {/* Header */}
        <div
          className="bg-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center cursor-pointer"
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          <h3 className="font-semibold text-lg">Chat Support</h3>
          <div className="flex space-x-2">
            <button
              className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullSize();
              }}
              aria-label={isFullSize ? "Exit full screen" : "Expand to full screen"}
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-gray-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
            <button
              className="w-6 h-6 rounded-full bg-red-400 hover:bg-red-500 transition-colors flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
                setIsExpanded(false);
                setIsFullSize(false);
              }}
              aria-label="Minimize to icon"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        {isExpanded ? (
          <>
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      m.sender === "user"
                        ? "bg-indigo-100 text-gray-800 rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={listEndRef} />
            </div>

            <div className="p-4 border-top border-gray-200">
              <form className="flex gap-2" onSubmit={handleSubmit}>
                <input
                  name="text"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  autoComplete="off"
                  aria-label="Type your message"
                  disabled={pending}
                  ref={inputRef}
                />
                <button
                  type="submit"
                  disabled={pending || inputValue.trim() === ""}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
                  aria-busy={pending}
                  aria-label="Send message"
                >
                  {pending ? "..." : "Send"}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by Fluxa AI Assistant
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-gray-600 text-sm">Click to chat with us!</p>
          </div>
        )}
      </div>
    </>
  );
}
