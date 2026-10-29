import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, Compass, BookOpen, Layers, Edit2, Play, Star, ShieldCheck } from 'lucide-react';
import { Student, SupportLevel, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

interface LearningPathProps {
  student: Student;
  currentRole: UserRole;
  onStartActivity: (subject: 'vietnamese' | 'math' | 'inclusive') => void;
  onBackToHub: () => void;
}

export const StudentLearningPath: React.FC<LearningPathProps> = ({
  student,
  currentRole,
  onStartActivity,
  onBackToHub,
}) => {
  const [activeLevel, setActiveLevel] = useState<SupportLevel>(student.learningLevel);
  const [isEditingReason, setIsEditingReason] = useState(false);
  const [customReason, setCustomReason] = useState(student.supportReason);

  const handleLevelChange = (level: SupportLevel) => {
    soundService.playPop();
    setActiveLevel(level);
    storageService.updateStudent({
      id: student.id,
      learningLevel: level,
      supportReason: `Cô Linh đã điều chỉnh thủ công cho ${student.id} sang Mức ${level} để phù hợp tiến độ thực tế trên lớp.`,
    });
  };

  const handleSaveReason = () => {
    soundService.playPop();
    storageService.updateStudent({
      id: student.id,
      supportReason: customReason,
    });
    setIsEditingReason(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-5 sm:p-6 text-white shadow-md border-2 border-indigo-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
              🧭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">LỘ TRÌNH HỌC CỦA EM</h2>
                <span className="bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                  AI Thích ứng Cá nhân hóa
                </span>
              </div>
              <p className="text-indigo-100 text-xs sm:text-sm mt-0.5">
                Học sinh: <span className="font-black text-white">{student.nickname} ({student.id})</span> • Lớp 1A4 • Năm học 2026–2027
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

      {/* Pedagogical Adaptive Explanation Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            <span className="text-2xl">🌱</span>
            <div>
              <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                Lý do sư phạm & Khuyến nghị của AI:
              </span>
              {isEditingReason ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 border-2 border-amber-400 rounded-xl bg-white"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveReason}
                      className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow"
                    >
                      Lưu lý do
                    </button>
                    <button
                      onClick={() => setIsEditingReason(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm sm:text-base font-bold text-slate-800 mt-1 leading-relaxed">
                  "{student.supportReason}"
                </p>
              )}
            </div>
          </div>

          {currentRole === 'teacher' && !isEditingReason && (
            <button
              onClick={() => setIsEditingReason(true)}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-200/60 px-3 py-1.5 rounded-xl transition flex items-center gap-1 flex-shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5" /> Cô giáo chỉnh sửa
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-200/60 text-xs text-amber-950 font-bold">
          <span>Tiêu chuẩn vận hành:</span>
          <span className="bg-white/80 px-2 py-0.5 rounded-md border border-amber-300">≥80% độc lập: Mức C</span>
          <span className="bg-white/80 px-2 py-0.5 rounded-md border border-amber-300">40% - 79%: Mức B</span>
          <span className="bg-white/80 px-2 py-0.5 rounded-md border border-amber-300">&lt;40%: Mức A</span>
        </div>
      </div>

      {/* 3 SUPPORT LEVELS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* MỨC A */}
        <div
          className={`rounded-3xl p-5 border-4 transition flex flex-col justify-between ${
            activeLevel === 'A'
              ? 'bg-rose-50/70 border-rose-400 shadow-md ring-4 ring-rose-200'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full">
                Mức A
              </span>
              <span className="text-xl">🌱</span>
            </div>
            <h3 className="text-lg font-black text-rose-900">CẦN CỦNG CỐ</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Dành cho học sinh cần xây dựng nền tảng vững vàng, nhiều gợi ý trực quan và không bị áp lực.
            </p>

            <ul className="space-y-2 my-4 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>Bài tập ngắn (3–5 câu)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>Hình ảnh minh họa to rõ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>Có hướng dẫn từng bước</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>Ít phương án lựa chọn (2-3)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>Cho phép làm lại nhiều lần</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-200/60">
            {activeLevel === 'A' ? (
              <button
                onClick={() => onStartActivity(student.id === 'HS15' ? 'inclusive' : 'vietnamese')}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" /> Học ngay Mức A
              </button>
            ) : currentRole === 'teacher' ? (
              <button
                onClick={() => handleLevelChange('A')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Chuyển sang Mức A
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic block text-center">Chưa chọn</span>
            )}
          </div>
        </div>

        {/* MỨC B */}
        <div
          className={`rounded-3xl p-5 border-4 transition flex flex-col justify-between ${
            activeLevel === 'B'
              ? 'bg-amber-50/70 border-amber-400 shadow-md ring-4 ring-amber-200'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                Mức B
              </span>
              <span className="text-xl">🌿</span>
            </div>
            <h3 className="text-lg font-black text-amber-900">ĐANG TIẾN BỘ</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Dành cho học sinh đã nhận biết cơ bản, đang rèn luyện để chuyển sang mức độ làm bài độc lập.
            </p>

            <ul className="space-y-2 my-4 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Bài nhận biết & thông hiểu</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Số lượng: 5–7 câu hỏi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Giảm dần số lượng gợi ý</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Tăng nhẹ độ khó các phép tính</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Tự động cộng thêm lá xanh</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-200/60">
            {activeLevel === 'B' ? (
              <button
                onClick={() => onStartActivity('math')}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" /> Học ngay Mức B
              </button>
            ) : currentRole === 'teacher' ? (
              <button
                onClick={() => handleLevelChange('B')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Chuyển sang Mức B
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic block text-center">Chưa chọn</span>
            )}
          </div>
        </div>

        {/* MỨC C */}
        <div
          className={`rounded-3xl p-5 border-4 transition flex flex-col justify-between ${
            activeLevel === 'C'
              ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-4 ring-emerald-200'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                Mức C
              </span>
              <span className="text-xl">🍎</span>
            </div>
            <h3 className="text-lg font-black text-emerald-900">SẴN SÀNG MỞ RỘNG</h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Dành cho học sinh nắm chắc kiến thức, sẵn sàng làm quen các tình huống thực tế có lời văn.
            </p>

            <ul className="space-y-2 my-4 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Bài vận dụng phù hợp lớp 1</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Số lượng: 7–10 câu hỏi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Tình huống thực tế gần gũi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Phát triển tư duy ngôn ngữ & số</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Cây kết thêm quả đỏ sum suê</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-200/60">
            {activeLevel === 'C' ? (
              <button
                onClick={() => onStartActivity('math')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-white" /> Học ngay Mức C
              </button>
            ) : currentRole === 'teacher' ? (
              <button
                onClick={() => handleLevelChange('C')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Chuyển sang Mức C
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic block text-center">Chưa chọn</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
