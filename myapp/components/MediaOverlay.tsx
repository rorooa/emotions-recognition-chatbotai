"use client";

import { X, Play, Music, Gamepad2, Youtube } from "lucide-react";
import { useState, useEffect } from "react";

interface MediaOverlayProps {
    type: "song" | "video" | "game" | "none";
    query: string;
    onClose: () => void;
}

export default function MediaOverlay({ type, query, onClose }: MediaOverlayProps) {
    if (type === "none") return null;

    const [gameScore, setGameScore] = useState(0);

    // Simple Breath Game Logic
    const [breathScale, setBreathScale] = useState(1);
    useEffect(() => {
        if (type === "game") {
            const interval = setInterval(() => {
                setBreathScale(prev => (prev === 1 ? 1.5 : 1));
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [type]);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-white dark:bg-slate-900 border border-white/10 p-6 rounded-3xl w-full max-w-3xl shadow-2xl relative">

                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    {type === "song" && <Music className="text-pink-500" />}
                    {type === "video" && <Youtube className="text-red-500" />}
                    {type === "game" && <Gamepad2 className="text-indigo-500" />}

                    <span className="capitalize">
                        {type === "game" ? "Relaxation Game" : `Recommended ${type}`}
                    </span>
                </h2>

                <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-inner border border-white/5 relative">
                    {/* VIDEO / SONG */}
                    {(type === "video" || type === "song") && (
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}&autoplay=1`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}

                    {/* MINI GAME */}
                    {type === "game" && (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900 text-white cursor-pointer" onClick={() => setGameScore(s => s + 1)}>
                            <p className="mb-8 text-lg font-light opacity-80">Breathe in... Breathe out... (Click to relax)</p>

                            <div
                                className="w-32 h-32 rounded-full bg-indigo-500 blur-xl transition-all duration-[3000ms] ease-in-out"
                                style={{ transform: `scale(${breathScale})` }}
                            />

                            <div className="absolute bottom-4 text-sm opacity-50">
                                Relaxation Score: {gameScore}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 text-sm text-muted-foreground text-center">
                    Based on your emotion, I thought you might like this {type}.
                </div>
            </div>
        </div>
    );
}
