"use client";

import { useState, useEffect } from "react";
import { Mic, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
    onChat: (messages: { role: string; content: string }[]) => Promise<any>;
    isThinking: boolean;
    proactiveEmotion: string | null;
    onProactiveHandled: () => void;
}

export default function ChatInterface({ onChat, isThinking, proactiveEmotion, onProactiveHandled }: ChatInterfaceProps) {
    const [history, setHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
        { role: 'ai', text: "Hello! I'm listening. Press the mic to chat." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isListening, setIsListening] = useState(false);

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        const text = inputValue;
        setInputValue("");

        // 1. Create new history with User message
        const newHistory = [...history, { role: 'user' as const, text }];
        setHistory(newHistory);

        // 2. Format for API
        const apiMessages = newHistory.map(msg => ({
            role: msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.text
        }));

        // 3. Send to AI
        const response = await onChat(apiMessages);

        // 4. Add AI Response to UI
        setHistory(current => [...current, { role: 'ai', text: response.reply || response }]);
    };

    // Watch for proactive triggers
    useEffect(() => {
        if (proactiveEmotion) {
            handleProactiveChat(proactiveEmotion);
        }
    }, [proactiveEmotion]);

    const handleProactiveChat = async (emotion: string) => {
        // Clear the trigger immediately to prevent double-firing
        onProactiveHandled();

        // Construct a "system" style user message to prompt the AI (hidden from UI or shown as context)
        // Or better: Just Ask the AI to respond to the situation.
        // We will simulate a user context message, but NOT show it in the UI history if we want to be subtle.
        // BUT, for simplicity and context, let's just send the context.

        const contextMessage = `(System: The user appears to be feeling ${emotion}. Please initiate a comforting conversation or ask if they want music.)`;

        // We don't verify "isThinking" here strictly, or we might miss it.

        // 1. Prepare history for API
        const apiMessages = history.map(msg => ({
            role: msg.role === 'ai' ? 'assistant' : 'user',
            content: msg.text
        }));

        // Add the context
        apiMessages.push({ role: 'user', content: contextMessage });

        // 2. Send to AI
        try {
            const response = await onChat(apiMessages);

            // 3. Add AI Response to UI
            setHistory(current => [...current, { role: 'ai', text: response.reply || response }]);
        } catch (e) {
            console.error("Proactive chat failed", e);
        }
    };

    // ... rest of component


    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.start();

        setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onresult = async (event: any) => {
            const text = event.results[0][0].transcript;

            // 1. Create new history with User message
            const newHistory = [...history, { role: 'user' as const, text }];
            setHistory(newHistory);

            // 2. Format for API (map 'ai' -> 'assistant', 'text' -> 'content')
            const apiMessages = newHistory.map(msg => ({
                role: msg.role === 'ai' ? 'assistant' : 'user',
                content: msg.text
            }));

            // 3. Send to AI
            const response = await onChat(apiMessages);

            // 4. Add AI Response to UI
            setHistory(current => [...current, { role: 'ai', text: response.reply || response }]);
        };
    };

    return (
        <div className="absolute inset-y-0 right-0 w-full md:w-1/2 flex flex-col items-center justify-center p-6 pointer-events-none">

            {/* Chat History Section - "Other section for text" */}
            <div className="w-full max-w-lg mb-8 space-y-4 max-h-[60vh] overflow-y-auto pointer-events-auto px-4 scrollbar-hide flex flex-col justify-end">
                {history.map((msg, i) => (
                    <div
                        key={i}
                        className={cn(
                            "p-5 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 text-lg font-medium animate-in slide-in-from-bottom-2 fade-in duration-300",
                            msg.role === 'ai'
                                ? "bg-indigo-600/95 text-white self-start rounded-tl-none mr-12"
                                : "bg-white/95 text-indigo-900 self-end rounded-tr-none ml-12 text-right"
                        )}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* Input Controls - Bright and Visible */}
            <div className="pointer-events-auto flex flex-col items-center gap-4 bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-2xl w-full max-w-sm">
                <div className="text-white font-bold tracking-wide text-lg">
                    {isListening ? "Listening..." : isThinking ? "Thinking..." : "Ready to Chat"}
                </div>

                <div className="flex w-full items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Type a message..."
                        disabled={isThinking || isListening}
                        suppressHydrationWarning
                        className="flex-1 bg-white/20 border border-white/30 text-white placeholder-white/50 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    />

                    <button
                        onClick={handleSend}
                        disabled={isThinking || isListening || !inputValue.trim()}
                        className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-colors disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>

                    <button
                        onClick={startListening}
                        disabled={isThinking || isListening}
                        className={cn(
                            "p-3 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border-2 text-white",
                            isListening
                                ? "bg-rose-500 border-rose-300 animate-pulse"
                                : "bg-gradient-to-tr from-indigo-500 to-purple-600 border-white/20 hover:scale-105"
                        )}
                    >
                        {isListening ? (
                            <div className="h-5 w-5 bg-white rounded-sm animate-spin" />
                        ) : (
                            <Mic size={20} />
                        )}
                    </button>
                </div>

                <p className="text-white/60 text-xs font-medium">Type or tap mic to speak</p>
            </div>
        </div>
    );
}
