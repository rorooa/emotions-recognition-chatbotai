"use client";

import { useEffect, useRef } from "react";

export default function AudioVisualizer({ isActive }: { isActive: boolean }) {
    return (
        <div className="flex items-center justify-center gap-1 h-8">
            {isActive ? (
                <>
                    <div className="w-1 bg-indigo-500 rounded-full animate-wave-1 h-4"></div>
                    <div className="w-1 bg-indigo-400 rounded-full animate-wave-2 h-6"></div>
                    <div className="w-1 bg-indigo-300 rounded-full animate-wave-3 h-3"></div>
                    <div className="w-1 bg-purple-500 rounded-full animate-wave-4 h-5"></div>
                    <div className="w-1 bg-purple-400 rounded-full animate-wave-5 h-7"></div>
                </>
            ) : (
                <div className="text-xs text-muted-foreground font-medium tracking-widest">IDLE</div>
            )}
        </div>
    );
}
