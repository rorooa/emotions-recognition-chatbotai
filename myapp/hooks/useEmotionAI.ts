"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/lib/socket";

export function useEmotionAI() {
    const [emotion, setEmotion] = useState("neutral");
    const [status, setStatus] = useState("Disconnected");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // Refs for non-rendering variables
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouthInterval = useRef<NodeJS.Timeout | null>(null);

    // Initialize System
    const startSystem = async () => {
        setStatus("Initializing Request...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setStatus("Camera Ready");
                };
            }

            // Connect Socket
            const socket = getSocket();
            socket.on("connect", () => {
                setIsConnected(true);
                setStatus("System Online");
            });

            socket.on("emotion", (data: { emotion: string }) => {
                setEmotion(data.emotion);
            });

            // Start Frame Loop
            const interval = setInterval(() => {
                if (!videoRef.current || !canvasRef.current || !socket.connected) return;

                const ctx = canvasRef.current.getContext("2d");
                if (!ctx) return;

                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;

                ctx.drawImage(videoRef.current, 0, 0);

                const imageData = canvasRef.current.toDataURL("image/jpeg", 0.6);
                socket.emit("emotion", { image: imageData });

            }, 15000); // 15s interval

            return () => clearInterval(interval);

        } catch (err: any) {
            console.error("Camera Error details:", err);
            if (err.name === 'NotFoundError') {
                // Try one more time without constraints? often windows virtual cams hide things
                setStatus("Retrying Camera...");
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    // If we get here, it worked! recursion avoid
                    if (videoRef.current) videoRef.current.srcObject = stream;
                    setStatus("System Online (Fallback)");
                } catch (e) {
                    setStatus("No Camera Found (Check Hardware)");
                }
            } else if (err.name === 'NotAllowedError') {
                setStatus("Camera Denied (Check Browser Icons)");
            } else if (err.name === 'NotReadableError') {
                setStatus("Camera In Use by Other App");
            } else {
                setStatus(`Camera Error: ${err.name || "Unknown"}`);
            }
        }
    };

    // Text to Speech
    const speak = (text: string) => {
        window.speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 1.0;

        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utter);
    };

    // Chat with AI
    const chat = async (text: string) => {
        try {
            setStatus("Thinking...");
            // Assuming the backend is on port 8000
            const res = await fetch(`/chat?name=User&emotion=${emotion}&user_text=${encodeURIComponent(text)}`);
            const data = await res.json();

            // data structure: { reply: "...", recommendation: { type: "...", query: "..." } }

            setStatus("Speaking...");
            speak(data.reply);
            return data;
        } catch (e) {
            console.error(e);
            setStatus("Network Error");
            return { reply: "I couldn't reach my brain.", recommendation: { type: "none" } };
        }
    };

    return {
        emotion,
        status,
        isSpeaking,
        isConnected,
        videoRef,
        canvasRef, // Hidden canvas for processing
        startSystem,
        chat
    };
}
