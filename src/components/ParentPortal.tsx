import React, { useState } from 'react';
import { Heart, Send, Sparkles, BookOpen, Clock, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import { Student } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

interface ParentPortalProps {
  student: Student;
  onBackToHub: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ student, onBackToHub }) => {
  const [messages, setMessages] = useState(() => storageService.getParentMessages());
  const [feedbackText, setFeedbackText] = useState('');
  const [parentName, setParentName] = useState(`Phụ huynh ${student.nickname}`);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    soundService.playCorrect();

    storageService.addParentMessage({
      studentId: student.id,
      parentName,
      text: feedbackText,
    });

    setMessages(storageService.getParentMessages());
    setFeedbackText('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-amber-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
              🏡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">GÓC PHỤ HUYNH ĐỒNG HÀNH</h2>
                <span className="bg-white/20 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                  Bảo mật chỉ xem riêng con
                </span>
              </div>
              <p className="text-amber-100 text-xs sm:text-sm mt-0.5">
                Đồng hành cùng bé <span className="font-black text-white">{student.nickname} ({student.id})</span> • Lớp 1A4
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
        {/* Left: 5-10 min home guidance tips */}
        <div className="lg:col-span-7 space-y-5">
          {/* Daily 5-10 min tips */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-amber-200 space-y-4">
            <h3 className="text-sm font-black text-amber-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" /> LỜI KHUYÊN ĐỒNG HÀNH 5–10 PHÚT MỖI TỐI
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <span className="font-black text-amber-900 block">1. Trò chơi Đố chữ vui vẻ</span>
                <p className="text-slate-600 leading-relaxed">
                  Cùng con tìm chữ cái đã học trên bao bì hộp sữa, biển báo hoặc tờ lịch treo tường.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <span className="font-black text-emerald-900 block">2. Đếm đồ vật lúc ăn cơm</span>
                <p className="text-slate-600 leading-relaxed">
                  Nhờ con lấy giúp 4 chiếc bát, 4 đôi đũa để rèn phản xạ đếm số tự nhiên.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
                <span className="font-black text-blue-900 block">3. Lời khen đúng cách</span>
                <p className="text-slate-600 leading-relaxed">
                  Khen sự kiên trì ("Mẹ thấy con rất cố gắng đọc hết dòng!") thay vì chỉ khen điểm số.
                </p>
              </div>

              <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
                <span className="font-black text-rose-900 block">4. Không tạo áp lực thời gian</span>
                <p className="text-slate-600 leading-relaxed">
                  Mỗi tối chỉ cần học 10–15 phút vui vẻ và đi ngủ trước 9h tối để con minh mẫn.
                </p>
              </div>
            </div>
          </div>

          {/* Child's Assigned Tasks */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100 space-y-3">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" /> NHIỆM VỤ CÔ LINH DẶN BÉ HÔM NAY
            </h3>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900">
                  {student.id === 'HS15'
                    ? 'Chạm đếm 3 quả táo và nghe cô đọc chữ "a"'
                    : student.learningLevel === 'C'
                    ? 'Đoàn tàu số học & Nhìn tranh đoán từ Mức C'
                    : 'Ôn tập ghép vần "b, c, a" và làm bài đếm số Mức A'}
                </span>
                <span className="bg-emerald-200 text-emerald-950 font-black px-2 py-0.5 rounded-full text-[10px]">
                  Hạn tuần này
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Ba mẹ mở điện thoại cho bé chạm màn hình khoảng 5 phút là hoàn thành nhiệm vụ và giúp cây tiến bộ của bé nở thêm hoa.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Feedback to Teacher */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rose-500" /> GỬI PHẢN HỒI CHO CÔ THÙY LINH
            </h3>
            <p className="text-xs text-slate-500">
              Chia sẻ cảm xúc, niềm vui hoặc khó khăn của con khi luyện tập ở nhà để cô Linh kịp thời điều chỉnh bài học.
            </p>

            <form onSubmit={handleSendFeedback} className="space-y-3 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Tên phụ huynh:</label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Nội dung nhắn cô:</label>
                <textarea
                  required
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  placeholder="Ví dụ: Tối qua bé rất thích nghe Mầm Xanh đọc bài..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-normal"
                />
              </div>

              {sentSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold animate-fade-in flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tin nhắn đã được gửi đến cô Thùy Linh!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl font-black text-xs shadow transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Gửi phản hồi cho cô giáo
              </button>
            </form>

            {/* Recent Messages list */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-black uppercase text-slate-400 block">
                Phản hồi gần đây:
              </span>
              {messages.filter(m => m.studentId === student.id).map((m) => (
                <div key={m.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span className="font-bold text-slate-700">{m.parentName}</span>
                    <span>{m.date}</span>
                  </div>
                  <p className="text-slate-600">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
