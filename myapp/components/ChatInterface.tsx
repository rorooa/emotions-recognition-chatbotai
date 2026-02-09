"use client";

import { useState } from "react";
import { Mic, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
    onChat: (text: string) => Promise<any>;
    isThinking: boolean;
}

export default function ChatInterface({ onChat, isThinking }: ChatInterfaceProps) {
    const [history, setHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([
        { role: 'ai', text: "Hello! I'm listening. Press the mic to chat." }
    ]);
    const [isListening, setIsListening] = useState(false);

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

        recognition.onresult = async (event: any) => {
            const text = event.results[0][0].transcript;

            // Add User Message
            setHistory(prev => [...prev, { role: 'user', text }]);

            // Send to AI
            const response = await onChat(text);

            // Add AI Message
            setHistory(prev => [...prev, { role: 'ai', text: response.reply || response }]);
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

                <button
                    onClick={startListening}
                    disabled={isThinking || isListening}
                    className={cn(
                        "h-20 w-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-4 text-white",
                        isListening
                            ? "bg-rose-500 border-rose-300 animate-pulse scale-110"
                            : "bg-gradient-to-tr from-indigo-500 to-purple-600 border-white/20 hover:scale-105 hover:shadow-indigo-500/50"
                    )}
                >
                    {isListening ? (
                        <div className="h-5 w-5 bg-white rounded-sm animate-spin" />
                    ) : (
                        <Mic size={32} strokeWidth={2.5} />
                    )}
                </button>

                <p className="text-white/60 text-xs font-medium">Tap microphone to speak</p>
            </div>
        </div>
    );
}
