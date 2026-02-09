"use client";

import { useState } from "react";
import ControlPanel from "@/components/ControlPanel";
import ChatInterface from "@/components/ChatInterface";
import AvatarScene from "@/components/AvatarScene";
import MediaOverlay from "@/components/MediaOverlay";
import { useEmotionAI } from "@/hooks/useEmotionAI";

export default function Home() {
  const {
    emotion,
    status,
    isSpeaking,
    isConnected,
    startSystem,
    chat,
    videoRef,
    canvasRef
  } = useEmotionAI();

  const [recommendation, setRecommendation] = useState<any>(null);

  const handleChat = async (text: string) => {
    const response = await chat(text);
    if (response && response.recommendation && response.recommendation.type !== "none") {
      setRecommendation(response.recommendation);
    }
    return response;
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-950 dark:to-black text-foreground relative flex flex-col md:flex-row p-4 md:p-8 gap-6 selection:bg-indigo-500/30">

      {/* Hidden Elements for Processing */}
      <div className="absolute opacity-0 pointer-events-none">
        <video ref={videoRef} autoPlay playsInline muted />
        <canvas ref={canvasRef} />
      </div>

      {/* Media Overlay */}
      {recommendation && (
        <MediaOverlay
          type={recommendation.type}
          query={recommendation.query}
          onClose={() => setRecommendation(null)}
        />
      )}

      {/* Left Sidebar */}
      <div className="z-10 relative">
        <ControlPanel
          status={status}
          emotion={emotion}
          isConnected={isConnected}
          onStart={startSystem}
          isSpeaking={isSpeaking}
        />
      </div>

      {/* Main 3D Stage */}
      <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/10 shadow-inner bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm">

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <AvatarScene emotion={emotion} isSpeaking={isSpeaking} />
        </div>

        {/* Bottom Interaction Bar */}
        <ChatInterface onChat={handleChat} isThinking={status === "Thinking..."} />
      </div>

      {/* Background Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
    </main>
  );
}
