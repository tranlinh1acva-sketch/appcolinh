import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, CheckCircle, Clock, BookOpen, AlertCircle, Filter, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import { Student, SupportLevel } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

interface DashboardProps {
  onSelectStudent: (id: string) => void;
  onNavigateInclusive: () => void;
  onBackToHub: () => void;
}

export const ClassroomDashboard: React.FC<DashboardProps> = ({
  onSelectStudent,
  onNavigateInclusive,
  onBackToHub,
}) => {
  const [students] = useState<Student[]>(() => storageService.getStudents());
  const [filterLevel, setFilterLevel] = useState<'all' | SupportLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students
  const filteredStudents = students.filter((s) => {
    if (filterLevel !== 'all' && s.learningLevel !== filterLevel) return false;
    if (searchQuery && !s.id.toLowerCase().includes(searchQuery.toLowerCase()) && !s.nickname.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Calculate metrics
  const totalStudents = students.length;
  const surveyedCount = students.filter((s) => s.hasDiagnostic).length;
  const levelACount = students.filter((s) => s.learningLevel === 'A').length;
  const levelBCount = students.filter((s) => s.learningLevel === 'B').length;
  const levelCCount = students.filter((s) => s.learningLevel === 'C').length;

  const totalCompletedAttempts = students.reduce((sum, s) => sum + s.totalAttempts, 0);

  // Distribution chart data
  const distributionData = [
    { name: 'Mức A (Cần củng cố)', count: levelACount, color: '#F43F5E' },
    { name: 'Mức B (Đang tiến bộ)', count: levelBCount, color: '#F59E0B' },
    { name: 'Mức C (Sẵn sàng mở rộng)', count: levelCCount, color: '#10B981' },
  ];

  // Subject Skills comparison data
  const skillsComparisonData = [
    { name: 'Nhận biết chữ', Viet: 78, Toan: 84 },
    { name: 'Ghép vần / Số', Viet: 68, Toan: 76 },
    { name: 'Từ / So sánh', Viet: 74, Toan: 79 },
    { name: 'Câu / Cộng', Viet: 62, Toan: 71 },
    { name: 'Đọc hiểu / Trừ', Viet: 58, Toan: 66 },
  ];

  // Export CSV
  const handleExportCSV = () => {
    soundService.playPop();
    const headers = 'Mã HS,Biệt danh,Mức học tập,Bài đã làm,Gợi ý đã dùng,Lá cây,Hoa,Quả,Lý do đề xuất\n';
    const rows = students
      .map(
        (s) =>
          `"${s.id}","${s.nickname}","Mức ${s.learningLevel}",${s.totalAttempts},${s.hintsUsed},${s.treeLeaves},${s.treeFlowers},${s.treeFruits},"${s.supportReason.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Bao_cao_Lop_1A4_Moi_Em_Mot_Buoc_Tien.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-5 sm:p-6 text-white shadow-md border-2 border-emerald-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">DASHBOARD LỚP 1A4</h2>
                <span className="bg-amber-300 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                  Năm học 2026–2027
                </span>
              </div>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                GV: <span className="font-bold text-white">Nguyễn Thị Thùy Linh</span> • Trường TH Nguyễn Hiền, Phường Vĩnh Tế, An Giang
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-black text-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" /> Xuất dữ liệu CSV
            </button>
            <button
              onClick={onBackToHub}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition"
            >
              ← Về Trang Chủ
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Sĩ số lớp 1A4</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-800">{totalStudents}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            Đã khảo sát 100% ({surveyedCount} học sinh)
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Mức C (Mở rộng)</span>
            <span className="text-xl">🍎</span>
          </div>
          <div className="text-3xl font-black text-emerald-700">{levelCCount}</div>
          <div className="text-[11px] text-slate-500 font-bold mt-1">
            {Math.round((levelCCount / totalStudents) * 100)}% học sinh vững vàng
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Mức B (Tiến bộ)</span>
            <span className="text-xl">🌿</span>
          </div>
          <div className="text-3xl font-black text-amber-700">{levelBCount}</div>
          <div className="text-[11px] text-slate-500 font-bold mt-1">
            {Math.round((levelBCount / totalStudents) * 100)}% tiếp tục rèn luyện
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase">Mức A (Cần củng cố)</span>
            <span className="text-xl">🌱</span>
          </div>
          <div className="text-3xl font-black text-rose-600">{levelACount}</div>
          <div className="text-[11px] text-rose-700 font-bold mt-1">
            Gồm 01 em hỗ trợ hòa nhập (HS15)
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Phân bố 3 Mức Học tập */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100">
          <h3 className="text-sm font-black text-slate-800 mb-1">
            PHÂN BỐ LỘ TRÌNH 3 MỨC ĐỘ (LỚP 1A4)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Đề xuất thích ứng của hệ thống dựa trên khảo sát và các lượt độc lập
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Kỹ năng Tiếng Việt vs Toán */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100">
          <h3 className="text-sm font-black text-slate-800 mb-1">
            TIẾN ĐỘ THÀNH THẠO THEO NHÓM KỸ NĂNG (%)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            So sánh mức độ làm chủ giữa môn Tiếng Việt và Toán Lớp 1
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Viet" name="Tiếng Việt" fill="#0D9488" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Toan" name="Toán Học" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Special Card for Inclusive Education Student HS15 */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl shadow-md">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800 text-base">HỒ SƠ GIÁO DỤC HÒA NHẬP (HS15)</span>
              <span className="bg-rose-200 text-rose-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                Riêng tư giáo viên
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Bé An đã hoàn thành 8 bài tập chia nhỏ, Bông hoa tiến bộ nở được 4/6 cánh, giảm 65% số lần cần cô nhắc.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateInclusive}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5 flex-shrink-0"
        >
          <ShieldCheck className="w-4 h-4" /> Xem kế hoạch cá nhân & Bông hoa
        </button>
      </div>

      {/* 30 Students Roster Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-800 text-base">
              DANH SÁCH 30 HỌC SINH LỚP 1A4 ({filteredStudents.length} em)
            </h3>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Tìm mã hoặc tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
            />
            <select
              value={filterLevel}
              onChange={(e: any) => setFilterLevel(e.target.value)}
              className="text-xs font-bold p-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="A">Mức A (Củng cố)</option>
              <option value="B">Mức B (Tiến bộ)</option>
              <option value="C">Mức C (Mở rộng)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-black uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Mã HS</th>
                <th className="py-3 px-3">Biệt danh</th>
                <th className="py-3 px-3">Mức hỗ trợ</th>
                <th className="py-3 px-3">Cây tiến bộ</th>
                <th className="py-3 px-3">Lý do gợi ý sư phạm</th>
                <th className="py-3 px-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 font-black text-slate-800">{st.id}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{st.avatar}</span>
                      <span className="font-bold text-slate-700">{st.nickname}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full font-black text-[10px] ${
                        st.learningLevel === 'C'
                          ? 'bg-emerald-100 text-emerald-800'
                          : st.learningLevel === 'B'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Mức {st.learningLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-700">
                      🌱 {st.treeLeaves} • 🌸 {st.treeFlowers} • 🍎 {st.treeFruits}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={st.supportReason}>
                    {st.supportReason}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectStudent(st.id)}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg transition"
                    >
                      Xem hồ sơ →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
