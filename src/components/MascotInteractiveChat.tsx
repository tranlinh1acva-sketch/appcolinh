import React, { useState } from 'react';
import { Volume2, Sparkles, Send, RotateCcw, Heart, Smile, Star, ArrowRight } from 'lucide-react';
import { soundService } from '../services/soundService';
import { Student } from '../types';

interface MascotChatProps {
  student: Student;
  onBackToHub: () => void;
}

export const MascotInteractiveChat: React.FC<MascotChatProps> = ({ student, onBackToHub }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'mascot' | 'user'; text: string; emoji?: string }>>([
    {
      sender: 'mascot',
      text: `Xin chào ${student.nickname}! Mình là Mầm Xanh AI, bạn đồng hành đáng yêu của lớp 1A4 đây! Hôm nay bé muốn trò chuyện hay cùng giải câu đố vui với mình nào?`,
      emoji: '🌱',
    },
  ]);
  const [userInput, setUserInput] = useState('');

  const RIDDLES = [
    {
      q: 'Đố bé: Con gì mào đỏ gáy ò ó o mỗi sáng gọi mọi người thức dậy?',
      a: 'Con gà trống',
      reply: 'Chính xác rồi! Chú gà trống oai phong gáy ò ó o gọi bé dậy đi học ngoan!',
    },
    {
      q: 'Đố bé: Quả gì tròn vo, vỏ màu đỏ ngọt, cô hay cho bé điểm 10?',
      a: 'Quả táo',
      reply: 'Giỏi quá! Đó chính là quả táo ngọt lành giúp bé thêm thông minh!',
    },
    {
      q: 'Đố bé: Xòe bàn tay ra, bé đếm xem có mấy ngón tay trên một bàn tay?',
      a: '5 ngón tay',
      reply: 'Đúng rồi! 5 ngón tay ngoan trên một bàn tay xinh xắn của bé!',
    },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    soundService.playPop();

    const newMsgs = [...messages, { sender: 'user' as const, text }];
    setMessages(newMsgs);
    setUserInput('');

    // Cheerful simulated response
    setTimeout(() => {
      soundService.playCorrect();
      const randomRiddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
      const mascotResponse = {
        sender: 'mascot' as const,
        text: `Mầm Xanh khen bé ${student.nickname} nói chuyện rất ngoan! Bây giờ Mầm Xanh đố bé nhé: ${randomRiddle.q}`,
        emoji: '🌱✨',
      };
      setMessages((prev) => [...prev, mascotResponse]);
      soundService.speakVietnamese(mascotResponse.text);
    }, 800);
  };

  const handleAskRiddle = () => {
    soundService.playPop();
    const randomRiddle = RIDDLES[Math.floor(Math.random() * RIDDLES.length)];
    const msg = {
      sender: 'mascot' as const,
      text: randomRiddle.q,
      emoji: '🤔💡',
    };
    setMessages((prev) => [...prev, msg]);
    soundService.speakVietnamese(randomRiddle.q);
  };

  const handleCheerMe = () => {
    soundService.playBloom();
    const cheers = [
      `Bé ${student.nickname} ơi, mỗi ngày một bước tiến nhỏ, bé đang làm rất tuyệt vời!`,
      `Mầm Xanh rất tự hào về sự kiên trì của bé hôm nay! Cây tiến bộ đang lớn dần rồi đó!`,
      `Cô Thùy Linh và Mầm Xanh luôn ở bên cạnh động viên bé, hãy tự tin nhé!`,
    ];
    const cheer = cheers[Math.floor(Math.random() * cheers.length)];
    const msg = {
      sender: 'mascot' as const,
      text: cheer,
      emoji: '🌸🎉',
    };
    setMessages((prev) => [...prev, msg]);
    soundService.speakVietnamese(cheer);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-3xl">
            🌱
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-base">GẶP GỠ MẦM XANH AI</h3>
            <span className="text-xs text-emerald-600 font-bold">Bạn thân thiện của học sinh lớp 1A4</span>
          </div>
        </div>

        <button
          onClick={onBackToHub}
          className="text-xs font-bold text-slate-500 hover:text-slate-700"
        >
          ← Về Trang Chủ
        </button>
      </div>

      {/* Quick cheer buttons for 6yo */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleAskRiddle}
          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
        >
          🧩 Đố em một câu
        </button>
        <button
          onClick={handleCheerMe}
          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
        >
          💖 Động viên em đi
        </button>
        <button
          onClick={() => {
            soundService.playBloom();
            soundService.speakVietnamese(`Cây tiến bộ của bé ${student.nickname} hiện có ${student.treeLeaves} chiếc lá xanh và ${student.treeFlowers} bông hoa xinh xắn!`);
          }}
          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
        >
          🌳 Cây của em thế nào?
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="h-80 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'mascot' && (
              <span className="text-2xl flex-shrink-0">🌱</span>
            )}
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold max-w-xs sm:max-w-md leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm'
              }`}
            >
              {m.text}
              {m.sender === 'mascot' && (
                <button
                  onClick={() => soundService.speakVietnamese(m.text)}
                  className="ml-2 text-emerald-600 hover:text-emerald-800 inline-block align-middle"
                  title="Nghe lại"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(userInput)}
          placeholder="Nói chuyện hoặc trả lời câu đố cùng Mầm Xanh..."
          className="flex-1 text-xs sm:text-sm p-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={() => handleSend(userInput)}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
        >
          <Send className="w-4 h-4" /> Gửi
        </button>
      </div>
    </div>
  );
};
