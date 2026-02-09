"use client";

import { useTheme } from "next-themes";
import { Mic, Moon, Sun, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import AudioVisualizer from "./AudioVisualizer";

interface ControlPanelProps {
    status: string;
    emotion: string;
    onStart: () => void;
    isConnected: boolean;
    isSpeaking: boolean;
}

export default function ControlPanel({ status, emotion, onStart, isConnected, isSpeaking }: ControlPanelProps) {
    const { theme, setTheme } = useTheme();

    return (
        <aside className="w-full md:w-80 h-auto md:h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-300">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
                        Emotion AI
                    </h1>
                </div>

                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Status</p>
                    <div className="flex items-center gap-2 mb-4">
                        <span className={cn("h-2.5 w-2.5 rounded-full animate-pulse", isConnected ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-rose-500")} />
                        <span className="text-sm font-medium">{status}</span>
                    </div>

                    {/* Visualizer */}
                    <AudioVisualizer isActive={isSpeaking} />
                </div>
            </div>

            {/* Main Stats */}
            <div className="py-10 text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Current Emotion</p>
                <div className="text-5xl font-light capitalize transition-all duration-500 ease-out transform">
                    {emotion}
                </div>
                {/* Decorative bar */}
                <div className="h-1 w-20 mx-auto mt-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80" />
            </div>

            {/* Footer / Controls */}
            <div className="space-y-4">
                {!isConnected && (
                    <button
                        onClick={onStart}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95"
                    >
                        Initialize System
                    </button>
                )}

                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    Toggle Theme
                </button>
            </div>
        </aside>
    );
}
