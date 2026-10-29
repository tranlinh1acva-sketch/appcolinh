import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, MessageCircle } from 'lucide-react';
import { soundService } from '../services/soundService';

interface MascotProps {
  message?: string;
  expression?: 'happy' | 'cheering' | 'thinking' | 'caring' | 'celebrating';
  onQuickChat?: () => void;
  compact?: boolean;
}

export const MascotMamXanh: React.FC<MascotProps> = ({
  message = 'Xin chào! Mình là Mầm Xanh AI. Hôm nay chúng mình cùng học thật vui và tiến bộ từng ngày nhé!',
  expression = 'happy',
  onQuickChat,
  compact = false,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(!soundService.isSoundEnabled());

  const handleSpeak = () => {
    if (isSpeaking) {
      soundService.stopSpeech();
      setIsSpeaking(false);
      return;
    }
    soundService.playPop();
    setIsSpeaking(true);
    soundService.speakVietnamese(message, () => {
      setIsSpeaking(false);
    });
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isMuted;
    setIsMuted(next);
    soundService.setSoundEnabled(!next);
    if (next) {
      setIsSpeaking(false);
    } else {
      soundService.playPop();
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-300 rounded-full px-3 py-1.5 shadow-sm">
        <span className="text-xl animate-bounce">🌱</span>
        <span className="text-xs font-bold text-emerald-800">Mầm Xanh AI</span>
        <button
          onClick={handleSpeak}
          title="Nghe Mầm Xanh đọc"
          className="p-1 hover:bg-emerald-100 rounded-full text-emerald-700 transition"
        >
          {isSpeaking ? (
            <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-4 sm:p-6 text-white shadow-lg overflow-hidden border-4 border-emerald-300">
      {/* Decorative background sparkles */}
      <div className="absolute top-2 right-4 text-emerald-200/40 text-4xl select-none pointer-events-none">✨</div>
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10">
        {/* Animated Sprout Mascot SVG & Badge */}
        <div className="relative group cursor-pointer" onClick={handleSpeak}>
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full p-2 flex items-center justify-center shadow-md border-4 border-amber-300 transition-transform duration-300 transform group-hover:scale-105">
            <svg
              className={`w-16 h-16 sm:w-20 sm:h-20 ${
                expression === 'cheering' || expression === 'celebrating'
                  ? 'animate-bounce'
                  : 'animate-pulse'
              }`}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground & pot */}
              <ellipse cx="50" cy="85" rx="36" ry="10" fill="#E2E8F0" />
              <path
                d="M26 80 L32 94 C33 96 37 98 50 98 C63 98 67 96 68 94 L74 80 Z"
                fill="#F59E0B"
                stroke="#D97706"
                strokeWidth="2"
              />
              {/* Sprout Stem */}
              <path
                d="M50 82 Q49 55 50 42"
                stroke="#10B981"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Left Leaf */}
              <path
                d="M48 48 C28 42 20 28 32 20 C42 25 46 36 48 48 Z"
                fill="#34D399"
                stroke="#059669"
                strokeWidth="2"
              />
              {/* Right Leaf */}
              <path
                d="M52 48 C72 42 80 28 68 20 C58 25 54 36 52 48 Z"
                fill="#10B981"
                stroke="#047857"
                strokeWidth="2"
              />
              {/* Mascot Friendly Face on Sprout Center */}
              <circle cx="50" cy="56" r="19" fill="#A7F3D0" stroke="#059669" strokeWidth="2.5" />
              {/* Eyes */}
              <circle cx="43" cy="53" r="3.5" fill="#064E3B" />
              <circle cx="57" cy="53" r="3.5" fill="#064E3B" />
              <circle cx="44.2" cy="51.8" r="1.2" fill="#FFFFFF" />
              <circle cx="58.2" cy="51.8" r="1.2" fill="#FFFFFF" />
              {/* Pink Rosy Cheeks */}
              <ellipse cx="38" cy="58" rx="2.5" ry="1.5" fill="#F472B6" />
              <ellipse cx="62" cy="58" rx="2.5" ry="1.5" fill="#F472B6" />
              {/* Smile expression */}
              {expression === 'cheering' || expression === 'celebrating' ? (
                <path
                  d="M42 59 Q50 69 58 59"
                  stroke="#064E3B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="#EF4444"
                />
              ) : expression === 'caring' ? (
                <path
                  d="M43 60 Q50 66 57 60"
                  stroke="#064E3B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M43 59 Q50 65 57 59"
                  stroke="#064E3B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
              {/* Little Flower on top if celebrating */}
              {(expression === 'cheering' || expression === 'celebrating') && (
                <circle cx="50" cy="22" r="5" fill="#FBBF24" />
              )}
            </svg>
          </div>
          <span className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 bg-amber-400 text-amber-950 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap border border-amber-200">
            MẦM XANH AI
          </span>
        </div>

        {/* Speech Bubble */}
        <div className="flex-1 bg-white/95 text-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm border-2 border-emerald-200 relative">
          {/* Arrow */}
          <div className="hidden sm:block absolute top-1/2 -left-3 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white/95 border-b-8 border-b-transparent"></div>

          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-800">
                {message}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-emerald-700 font-bold">
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Bạn đồng hành lớp 1A4
                </span>
                <span className="hidden sm:inline text-slate-400">•</span>
                <span className="hidden sm:inline text-slate-500">Trường TH Nguyễn Hiền</span>
              </div>
            </div>

            {/* Audio & Interaction Buttons */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button
                onClick={handleSpeak}
                className={`p-2.5 rounded-xl transition flex items-center justify-center font-bold text-xs ${
                  isSpeaking
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                }`}
                title="Nghe Mầm Xanh đọc to"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              {onQuickChat && (
                <button
                  onClick={onQuickChat}
                  className="p-2.5 bg-cyan-100 text-cyan-800 hover:bg-cyan-200 rounded-xl transition active:scale-95 text-xs font-bold flex items-center justify-center"
                  title="Trò chuyện cùng Mầm Xanh"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
