"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Settings,
  RotateCcw,
  Copy,
  Check,
  Key,
  ShieldCheck,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 **Namaste! I'm DreamPGbot**, your AI Assistant for Dream Homes PG.\n\nAsk me anything about PG rooms, rent prices, amenities, complaints, or room availability. You can also use **Voice Commands** by tapping the microphone button below!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Voice & Audio States
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  // Settings & Context States
  const [showSettings, setShowSettings] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-IN"; // English (India) with Hindi understanding

        recognition.onresult = (event) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          setInput(currentTranscript);
        };

        recognition.onerror = (event) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Voice Command Toggle
  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Text to Speech (TTS) Output
  const speakText = (text, msgIndex) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingMsgId === msgIndex) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any active speech

    // Clean markdown formatting for speech
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/#/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN";
    utterance.rate = 1.0;

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgIndex);
    window.speechSynthesis.speak(utterance);
  };

  // Copy Message to Clipboard
  const handleCopy = (text, idx) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  // Clear Chat History
  const handleClearHistory = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat history cleared. How can I assist you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Quick Suggestion Chips
  const suggestions = [
    "💰 Show room rent prices",
    "📍 What are PG locations?",
    "🍲 Tell me about Mess food",
    "🔧 How to raise complaint?",
    "🔔 Check room availability",
  ];

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.reply) {
        const assistantMessage = {
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Auto read out if TTS is enabled
        if (ttsEnabled) {
          speakText(data.reply, messages.length + 1);
        }
      } else {
        throw new Error(data.error || "No response received");
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Sorry, I encountered an issue connecting to the assistant. Please try again or call our team directly.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Hide AI chatbot on login page and root landing screen (AFTER ALL HOOKS ARE CALLED!)
  if (pathname === "/login" || pathname === "/") {
    return null;
  }

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/30"
          aria-label="Open DreamPGbot Assistant"
        >
          <div className="relative">
            <Bot className="w-7 h-7 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div className="hidden sm:flex flex-col text-left pr-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> AI Assistant
            </span>
            <span className="text-sm font-extrabold leading-none">DreamPGbot</span>
          </div>
        </button>
      )}

      {/* Expandable Chat Container */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-purple-700 to-indigo-800 text-white p-4 flex items-center justify-between shadow-md relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-primary rounded-full"></span>
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base leading-tight flex items-center gap-1.5">
                  DreamPGbot
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300/30">
                    AI Active
                  </span>
                </h3>
                <p className="text-[11px] text-white/80 font-medium">Jodhpur PG Virtual Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`p-2 rounded-xl transition-all ${
                  ttsEnabled ? "bg-white/20 text-amber-300" : "text-white/70 hover:bg-white/10"
                }`}
                title={ttsEnabled ? "Disable Auto-Voice Output" : "Enable Auto-Voice Output"}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-xl text-white/70 hover:bg-white/10 transition-all"
                title="Settings & Options"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-white/80 hover:bg-white/20 hover:text-white transition-all ml-1"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Sub-Menu Drawer */}
          {showSettings && (
            <div className="bg-purple-950 text-white p-3 text-xs flex items-center justify-between border-b border-purple-800 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>24/7 AI Smart Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 text-purple-200 hover:text-white bg-purple-900/60 px-2.5 py-1 rounded-lg transition-all"
                >
                  <RotateCcw className="w-3 h-3" /> Clear Chat
                </button>
              </div>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                } items-start animate-fadeIn`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-secondary-container to-secondary text-white"
                      : "bg-gradient-to-br from-primary to-primary-container text-white"
                  }`}
                >
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`group relative max-w-[80%] space-y-1`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-none font-medium"
                        : "bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-gray-100/50"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>

                  {/* Actions Bar (Copy & Voice Speak) */}
                  <div
                    className={`flex items-center gap-2 text-[10px] text-gray-400 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    } px-1`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.role === "assistant" && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => speakText(msg.content, idx)}
                          className={`hover:text-primary transition-colors ${
                            speakingMsgId === idx ? "text-primary font-bold animate-pulse" : ""
                          }`}
                          title="Read Aloud"
                        >
                          {speakingMsgId === idx ? "🔊 Speaking..." : "📢 Speak"}
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => handleCopy(msg.content, idx)}
                          className="hover:text-primary transition-colors flex items-center gap-0.5"
                          title="Copy text"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-2.5 animate-fadeIn">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3.5 text-xs text-gray-500 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <span className="font-semibold text-primary ml-1">DreamPGbot is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                className="whitespace-nowrap bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Voice Input Indicator Banner */}
          {isListening && (
            <div className="bg-amber-50 border-t border-amber-200 p-2 text-center text-xs font-bold text-amber-800 flex items-center justify-center gap-2 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              Listening... Speak your question clearly into your microphone
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening ? "Listening to your voice..." : "Ask DreamPGbot anything..."
              }
              className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-primary focus:bg-white transition-all"
            />

            {/* Voice Input Button */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-2xl transition-all ${
                  isListening
                    ? "bg-red-500 text-white shadow-md shadow-red-500/30 animate-pulse"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-primary hover:bg-primary-container text-white p-2.5 rounded-2xl shadow-md transition-all disabled:opacity-40"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
