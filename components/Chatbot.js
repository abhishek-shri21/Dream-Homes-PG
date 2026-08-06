"use client";

import { useState, useEffect, useRef } from "react";
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

  // Settings & API Key
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("groq_api_key") || localStorage.getItem("grok_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          setInput(currentTranscript);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
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

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isListening]);

  // Handle Speech Recognition Toggle
  const toggleListening = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  // Text-To-Speech (TTS) response reader
  const speakText = (text, index) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingMsgId === index) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`•]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN";
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(index);
    window.speechSynthesis.speak(utterance);
  };

  // Save Settings to localStorage
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem("groq_api_key", apiKey.trim());
    setShowSettings(false);
  };

  // Send message to server backend API
  const handleSend = async (customText = null) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessage = {
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setTranscript("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
          userApiKey: apiKey,
        }),
      });

      const data = await response.json();
      const botReply =
        data?.reply ||
        "Sorry, I couldn't process your request right now. Please try calling us at +91 98765 43210.";

      const botMessage = {
        role: "assistant",
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (ttsEnabled) {
        speakText(botReply, newMessages.length);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Network connection error. Please try again or call owner Ramesh Sharma at +91 98765 43210.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Copy message text
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Render markdown formatting cleanly
  const renderFormattedText = (text) => {
    return text.split("\n").map((line, i) => {
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <span
          key={i}
          className="block min-h-[1.2em]"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  const quickPrompts = [
    "🔍 PGs under ₹5,000",
    "👧 Girls PGs in Jodhpur",
    "🛠️ How to raise complaint?",
    "⚡ Amenities included?",
    "📞 Owner contact details",
  ];

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
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base tracking-tight text-white">DreamPGbot</h3>
                  <span className="bg-white/20 text-white border border-white/30 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                    AI Assistant
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/90 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Voice Enabled & Online
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`p-2 rounded-xl transition-all ${
                  ttsEnabled ? "bg-white/25 text-amber-300" : "hover:bg-white/10 text-purple-200"
                }`}
                title={ttsEnabled ? "Sound Enabled (Click to Mute)" : "Sound Muted (Click to Enable Voice Response)"}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition-all ${
                  showSettings ? "bg-white/25 text-white" : "hover:bg-white/10 text-purple-200"
                }`}
                title="AI Settings"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                onClick={() =>
                  setMessages([
                    {
                      role: "assistant",
                      content: "Chat history cleared. How can I assist you now?",
                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    },
                  ])
                }
                className="p-2 hover:bg-white/10 text-purple-200 hover:text-white rounded-xl transition-all"
                title="Clear Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 text-purple-200 hover:text-white rounded-xl transition-all"
                title="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Modal Bar */}
          {showSettings && (
            <form
              onSubmit={handleSaveSettings}
              className="bg-purple-950 text-white p-3.5 border-b border-purple-800 animate-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold flex items-center gap-1.5 text-purple-200">
                  <Key className="w-3.5 h-3.5 text-amber-400" /> AI Assistant Settings
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Optional custom API key"
                  className="flex-1 bg-purple-900/60 border border-purple-700/60 text-xs text-white placeholder-purple-400 rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-purple-950 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors"
                >
                  Save Settings
                </button>
              </div>
              <p className="text-[10px] text-purple-300 mt-1.5">
                DreamPGbot provides instant intelligent responses for Dream Homes PG.
              </p>
            </form>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                  }`}
                >
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] space-y-1 group`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-none font-medium"
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                    }`}
                  >
                    {renderFormattedText(msg.content)}
                  </div>

                  {/* Timestamp & Actions */}
                  <div
                    className={`flex items-center gap-2 text-[10px] text-gray-400 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.role === "assistant" && (
                      <button
                        onClick={() => copyToClipboard(msg.content, index)}
                        className="opacity-0 group-hover:opacity-100 hover:text-gray-600 transition-opacity"
                        title="Copy text"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                    {msg.role === "assistant" && ttsEnabled && (
                      <button
                        onClick={() => speakText(msg.content, index)}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                          speakingMsgId === index ? "text-amber-500 opacity-100" : "hover:text-gray-600"
                        }`}
                        title="Listen to response"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-700">DreamPGbot is thinking</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-2 bg-gray-50/80 border-t border-gray-100 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-medium bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-700 border border-gray-200/80 hover:border-purple-200 px-2.5 py-1 rounded-full shadow-2xs transition-all flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Ask about PG rooms, rent, facilities..."}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-4 pr-10 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                />

                {/* Voice mic button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-purple-700 text-white flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-40 transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
