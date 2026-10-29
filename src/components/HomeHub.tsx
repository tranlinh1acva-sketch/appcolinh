import React from 'react';
import {
  Play, ClipboardCheck, BookOpen, Compass, Heart, TreePine, Sparkles, Bot, BarChart3, TrendingUp, Layers, Home, Award
} from 'lucide-react';
import { ActiveView, Student, UserRole } from '../types';
import { soundService } from '../services/soundService';

interface HomeHubProps {
  student: Student;
  currentRole: UserRole;
  onNavigate: (view: ActiveView) => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({
  student,
  currentRole,
  onNavigate,
}) => {
  const handleCardClick = (view: ActiveView) => {
    soundService.playPop();
    onNavigate(view);
  };

  const HUB_ITEMS = [
    {
      id: 'quick_start' as ActiveView,
      title: '1. Em bắt đầu học',
      desc: `Luyện tập thích ứng cấp độ Mức ${student.learningLevel}`,
      icon: '🚀',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      badge: 'Khuyên dùng hôm nay',
      highlight: true,
      action: () => {
        if (student.id === 'HS15') onNavigate('inclusive');
        else if (student.learningLevel === 'A') onNavigate('vietnamese');
        else onNavigate('math');
      },
    },
    {
      id: 'diagnostic' as ActiveView,
      title: '2. Khảo sát đầu vào',
      desc: 'Đánh giá 7 kỹ năng Tiếng Việt & Toán chuẩn GDPT 2018',
      icon: '📋',
      gradient: 'from-amber-400 to-orange-500',
      badge: 'Đầu năm / Định kỳ',
      action: () => onNavigate('diagnostic'),
    },
    {
      id: 'vietnamese' as ActiveView,
      title: '3. Tiếng Việt vui',
      desc: '8 trò chơi: Tai ai tinh, Ghép vần, Nhìn tranh, Vòng quay',
      icon: '📖',
      gradient: 'from-teal-400 to-emerald-600',
      badge: '8 Trò chơi thật',
      action: () => onNavigate('vietnamese'),
    },
    {
      id: 'math' as ActiveView,
      title: '4. Toán học kỳ diệu',
      desc: '8 trò chơi: Bé đếm giỏi, Ngôi nhà số, Đoàn tàu số học',
      icon: '🔢',
      gradient: 'from-orange-400 to-rose-500',
      badge: '8 Trò chơi thật',
      action: () => onNavigate('math'),
    },
    {
      id: 'learning_path' as ActiveView,
      title: '5. Lộ trình của em',
      desc: 'Mức A (Củng cố) • Mức B (Tiến bộ) • Mức C (Mở rộng)',
      icon: '🧭',
      gradient: 'from-blue-500 to-indigo-600',
      badge: 'Thuật toán thích ứng',
      action: () => onNavigate('learning_path'),
    },
    {
      id: 'inclusive' as ActiveView,
      title: '6. Cùng em tiến bước',
      desc: 'Giáo dục hòa nhập: Bài tập chia nhỏ & Bông hoa tiến bộ',
      icon: '🌸',
      gradient: 'from-pink-500 to-rose-600',
      badge: 'Hòa nhập nhân văn',
      action: () => onNavigate('inclusive'),
    },
    {
      id: 'progress_tree' as ActiveView,
      title: '7. Cây tiến bộ',
      desc: 'Cây đơm hoa kết trái ghi nhận từng nỗ lực, không so sánh',
      icon: '🌳',
      gradient: 'from-emerald-600 to-green-700',
      badge: `${student.treeLeaves} Lá • ${student.treeFlowers} Hoa`,
      action: () => onNavigate('progress_tree'),
    },
    {
      id: 'mascot_chat' as ActiveView,
      title: '8. Mầm Xanh AI',
      desc: 'Bạn đồng hành lớp 1A4: Trò chuyện, đố chữ, động viên',
      icon: '🌱',
      gradient: 'from-teal-500 to-cyan-600',
      badge: 'Giọng nói tiếng Việt',
      action: () => onNavigate('mascot_chat'),
    },
    {
      id: 'teacher_assistant' as ActiveView,
      title: '9. Trợ lý giáo viên AI',
      desc: 'Trợ lý Cô Linh AI kết nối Gemini: Tạo đề, phân hóa 3 mức',
      icon: '🤖',
      gradient: 'from-purple-600 to-indigo-700',
      badge: 'Gemini API',
      action: () => onNavigate('teacher_assistant'),
    },
    {
      id: 'dashboard' as ActiveView,
      title: '10. Dashboard lớp 1A4',
      desc: 'Quản lý 30 học sinh, biểu đồ tiến độ & xuất CSV',
      icon: '📊',
      gradient: 'from-indigo-600 to-blue-700',
      badge: '30 Học sinh DEMO',
      action: () => onNavigate('dashboard'),
    },
    {
      id: 'pre_post_evaluation' as ActiveView,
      title: '11. Đánh giá trước – sau',
      desc: 'Đo lường tiến bộ thực nghiệm (Delta) phục vụ dự thi 2026',
      icon: '📈',
      gradient: 'from-cyan-600 to-teal-700',
      badge: 'Nghiên cứu sư phạm',
      action: () => onNavigate('pre_post_evaluation'),
    },
    {
      id: 'resources' as ActiveView,
      title: '12. Kho học liệu & Giao bài',
      desc: 'Ngân hàng đề GDPT 2018, giao bài theo nhóm phân hóa',
      icon: '📚',
      gradient: 'from-amber-500 to-yellow-600',
      badge: 'Soạn & Giao bài',
      action: () => onNavigate('resources'),
    },
    {
      id: 'parent_corner' as ActiveView,
      title: '13. Góc phụ huynh',
      desc: 'Lời khuyên đồng hành 5–10 phút, gửi tin nhắn đến cô Linh',
      icon: '🏡',
      gradient: 'from-rose-400 to-orange-500',
      badge: 'Đồng hành tại nhà',
      action: () => onNavigate('parent_corner'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 13 Active Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {HUB_ITEMS.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              soundService.playPop();
              item.action();
            }}
            className={`rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between border-2 transform hover:-translate-y-1 ${
              item.highlight
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-400 ring-2 ring-emerald-200'
                : 'bg-white border-slate-100 hover:border-emerald-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-2xl shadow-sm text-white group-hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-900 transition">
                  {item.badge}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-800 text-base group-hover:text-emerald-700 transition leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-600 group-hover:text-emerald-700">
              <span>Trải nghiệm ngay</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Classroom Information Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏫</span>
          <div>
            <span className="font-black text-slate-800 text-sm block">
              Trường Tiểu học Nguyễn Hiền • Lớp 1A4 • Năm học 2026–2027
            </span>
            <p className="mt-0.5">
              Giáo viên chủ nhiệm: <strong className="text-emerald-800">Nguyễn Thị Thùy Linh</strong> • Sĩ số: 30 học sinh (01 học sinh hòa nhập)
            </p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <div className="font-extrabold text-slate-700 italic">
            “Mỗi em một khả năng – Mỗi ngày một bước tiến – Không em nào bị bỏ lại phía sau.”
          </div>
        </div>
      </div>
    </div>
  );
};
