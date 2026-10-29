import React from 'react';
import { Sparkles, Award, Calendar, Clock, Trophy, Heart, ArrowRight } from 'lucide-react';
import { Student } from '../types';
import { soundService } from '../services/soundService';

interface ProgressTreeProps {
  student: Student;
  onContinueLearning: () => void;
  onBackToHub: () => void;
}

export const ProgressTree: React.FC<ProgressTreeProps> = ({
  student,
  onContinueLearning,
  onBackToHub,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl p-5 sm:p-6 text-white shadow-md border-2 border-emerald-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
              🌳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">CÂY TIẾN BỘ CỦA EM</h2>
                <span className="bg-amber-300 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                  Không so sánh • Tôn vinh nỗ lực
                </span>
              </div>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                Cây xanh của <span className="font-black text-white">{student.nickname} ({student.id})</span> • Lớp 1A4
              </p>
            </div>
          </div>

          <button
            onClick={onBackToHub}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition"
          >
            ← Về Trang Chủ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Tree Illustration */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-emerald-200 text-center flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Khu vườn học tập của {student.nickname}
            </span>
            <div className="flex items-center gap-3 text-xs font-extrabold">
              <span className="flex items-center gap-1 text-emerald-700">🌱 {student.treeLeaves} Lá</span>
              <span className="flex items-center gap-1 text-pink-600">🌸 {student.treeFlowers} Hoa</span>
              <span className="flex items-center gap-1 text-rose-600">🍎 {student.treeFruits} Quả</span>
            </div>
          </div>

          {/* Large SVG Growth Tree */}
          <div className="relative w-72 h-80 sm:w-80 sm:h-96 my-2">
            <svg viewBox="0 0 300 360" className="w-full h-full">
              {/* Soil and Grassy mound */}
              <ellipse cx="150" cy="335" rx="120" ry="20" fill="#E2E8F0" />
              <ellipse cx="150" cy="330" rx="110" ry="16" fill="#A7F3D0" />
              <path d="M70 330 Q150 310 230 330 Z" fill="#34D399" />

              {/* Main Trunk */}
              <path
                d="M140 330 C135 250 120 180 150 120 C180 180 165 250 160 330 Z"
                fill="#92400E"
                stroke="#78350F"
                strokeWidth="3"
              />
              {/* Major Branches */}
              <path
                d="M142 210 Q90 190 70 140"
                stroke="#92400E"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M158 190 Q210 170 230 130"
                stroke="#92400E"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M148 140 Q130 90 110 60"
                stroke="#92400E"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M152 140 Q170 90 190 60"
                stroke="#92400E"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />

              {/* Foliage Clouds */}
              <circle cx="150" cy="90" r="45" fill="#10B981" opacity="0.9" />
              <circle cx="95" cy="120" r="38" fill="#34D399" opacity="0.9" />
              <circle cx="205" cy="120" r="38" fill="#059669" opacity="0.9" />
              <circle cx="130" cy="60" r="32" fill="#34D399" opacity="0.95" />
              <circle cx="170" cy="60" r="32" fill="#10B981" opacity="0.95" />

              {/* Dynamic Leaves based on student.treeLeaves */}
              {Array.from({ length: Math.min(student.treeLeaves, 14) }).map((_, i) => {
                const angle = (i * 26) % 360;
                const radius = 35 + (i * 5) % 40;
                const lx = 150 + radius * Math.cos((angle * Math.PI) / 180);
                const ly = 100 + radius * Math.sin((angle * Math.PI) / 180);
                return (
                  <g key={`leaf_${i}`} transform={`translate(${lx}, ${ly})`}>
                    <ellipse cx="0" cy="0" rx="8" ry="4" fill="#6EE7B7" stroke="#047857" strokeWidth="1" />
                  </g>
                );
              })}

              {/* Dynamic Flowers based on student.treeFlowers */}
              {Array.from({ length: Math.min(student.treeFlowers, 6) }).map((_, i) => {
                const fx = [100, 190, 145, 130, 175, 80][i % 6];
                const fy = [105, 110, 50, 115, 85, 130][i % 6];
                return (
                  <g key={`flower_${i}`} transform={`translate(${fx}, ${fy})`} className="animate-pulse">
                    <circle cx="-4" cy="0" r="4" fill="#F472B6" />
                    <circle cx="4" cy="0" r="4" fill="#F472B6" />
                    <circle cx="0" cy="-4" r="4" fill="#F472B6" />
                    <circle cx="0" cy="4" r="4" fill="#F472B6" />
                    <circle cx="0" cy="0" r="3" fill="#FBBF24" />
                  </g>
                );
              })}

              {/* Dynamic Apples based on student.treeFruits */}
              {Array.from({ length: Math.min(student.treeFruits, 4) }).map((_, i) => {
                const ax = [120, 170, 85, 215][i % 4];
                const ay = [80, 75, 115, 115][i % 4];
                return (
                  <g key={`fruit_${i}`} transform={`translate(${ax}, ${ay})`}>
                    <circle cx="0" cy="0" r="9" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                    <circle cx="-2" cy="-2" r="2.5" fill="#FCA5A5" />
                    <path d="M0 -9 Q2 -13 5 -12" stroke="#065F46" strokeWidth="1.5" fill="none" />
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-xs text-slate-500 italic mt-2">
            "Mỗi bài tập hoàn thành giúp cây của {student.nickname} thêm xum xuê và đơm hoa kết trái!"
          </p>

          <button
            onClick={onContinueLearning}
            className="w-full sm:w-auto mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            Tiếp tục học để tưới cây 🌱
          </button>
        </div>

        {/* Right: Progress Stats & Attempt History */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Metrics */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-emerald-100">
            <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> CỘT MỐC CỦA {student.nickname.toUpperCase()}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Bài đã hoàn thành</span>
                <div className="text-2xl font-black text-emerald-800">{student.totalAttempts} bài</div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Mức độ học tập</span>
                <div className="text-2xl font-black text-amber-800">Mức {student.learningLevel}</div>
              </div>
            </div>

            {/* Next Milestone */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl">
              <span className="text-xs font-bold text-blue-900 block mb-0.5">🎯 Mục tiêu tiếp theo:</span>
              <p className="text-xs text-blue-800">
                Hoàn thành thêm 2 bài tập độc lập để cây kết thêm 01 quả táo đỏ!
              </p>
            </div>
          </div>

          {/* Attempt Log */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-emerald-100">
            <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" /> NHẬT KÝ LUYỆN TẬP GẦN ĐÂY
            </h3>

            {student.history && student.history.length > 0 ? (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {student.history.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{att.topic}</div>
                      <div className="text-[10px] text-slate-500">
                        {att.date} • Dùng {att.hintsUsed} gợi ý
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-700 text-sm">
                        {att.score}/{att.total}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {Math.round((att.score / att.total) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                Chưa có lượt làm bài nào. Hãy bắt đầu bài tập đầu tiên nhé!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
