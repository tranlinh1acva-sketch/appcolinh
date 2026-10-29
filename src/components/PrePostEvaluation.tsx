import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Award, Download, Printer, AlertTriangle, CheckCircle2, TrendingUp, HelpCircle, FileText } from 'lucide-react';
import { PrePostRecord } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

interface PrePostEvaluationProps {
  onBackToHub: () => void;
}

export const PrePostEvaluation: React.FC<PrePostEvaluationProps> = ({ onBackToHub }) => {
  const [records] = useState<PrePostRecord[]>(() => storageService.getPrePostRecords());
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');

  // Filter records
  const displayRecords = selectedStudentId === 'all'
    ? records
    : records.filter((r) => r.studentId === selectedStudentId);

  // Summary statistics
  const avgPre = Math.round(records.reduce((acc, r) => acc + r.prePercentage, 0) / records.length);
  const avgPost = Math.round(records.reduce((acc, r) => acc + r.postPercentage, 0) / records.length);
  const avgDelta = avgPost - avgPre;
  const avgHintsPre = (records.reduce((acc, r) => acc + r.hintsPre, 0) / records.length).toFixed(1);
  const avgHintsPost = (records.reduce((acc, r) => acc + r.hintsPost, 0) / records.length).toFixed(1);

  // Chart data: 10 sample students comparison
  const chartData = records.slice(0, 10).map((r) => ({
    name: r.studentId,
    Truoc: r.prePercentage,
    Sau: r.postPercentage,
    DoLech: r.deltaPercentage,
  }));

  const handleExportCSV = () => {
    soundService.playPop();
    const headers = 'Mã HS,Biệt danh,Nhóm kỹ năng,Đúng Trước,Tổng Trước,% Trước,Đúng Sau,Tổng Sau,% Sau,Mức Thay Đổi (%),Gợi ý Trước,Gợi ý Sau,Quan sát GV,Hài lòng PH,Ghi chú\n';
    const rows = records
      .map(
        (r) =>
          `"${r.studentId}","${r.studentNickname}","${r.skillGroup}",${r.preCorrect},${r.preTotal},${r.prePercentage}%,${r.postCorrect},${r.postTotal},${r.postPercentage}%,+${r.deltaPercentage}%,${r.hintsPre},${r.hintsPost},"${r.teacherObservation}",${r.parentFeedbackScore},"${r.notes}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Bao_cao_Danh_gia_Truoc_Sau_Lop_1A4.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    soundService.playPop();
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-cyan-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
              📈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">
                  ĐÁNH GIÁ TRƯỚC – SAU THỬ NGHIỆM
                </h2>
                <span className="bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                  Phục vụ Nghiên cứu Sư phạm & Dự thi 2026
                </span>
              </div>
              <p className="text-cyan-100 text-xs sm:text-sm mt-0.5">
                So sánh kết quả tương đương • Đo lường mức độ tự lập • Phản hồi đa chiều (GV & Phụ huynh)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> In Báo Cáo
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" /> Xuất CSV
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

      {/* Mandatory Scientific Disclosure Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 flex items-start gap-3 shadow-sm text-xs text-amber-950">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-black uppercase tracking-wider block">
            LƯU Ý KHOA HỌC & TÍNH TRUNG THỰC SƯ PHẠM (DỰ THI 2026):
          </span>
          <p className="leading-relaxed">
            Dữ liệu dưới đây là tập số liệu <strong>MÔ PHỎNG THỰC NGHIỆM (DEMO)</strong> cho 30 học sinh lớp 1A4 nhằm minh họa quy trình đo lường thích ứng. 
            Công thức tính: <code className="bg-amber-200/80 px-1.5 py-0.5 rounded font-mono font-bold">Tỷ lệ đúng = Số câu đúng / Tổng số câu × 100%</code>; 
            <code className="bg-amber-200/80 px-1.5 py-0.5 rounded font-mono font-bold">Mức thay đổi = Tỷ lệ sau − Tỷ lệ trước</code>. 
            Tuyệt đối không tự tạo số liệu ngụy tạo hiệu quả khi chưa tiến hành thực nghiệm thực tế tại cơ sở giáo dục.
          </p>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase block">Điểm khảo sát ban đầu</span>
          <div className="text-3xl font-black text-slate-700 mt-1">{avgPre}%</div>
          <span className="text-[11px] text-slate-400">Trung bình trước thử nghiệm</span>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase block">Điểm đánh giá sau</span>
          <div className="text-3xl font-black text-emerald-700 mt-1">{avgPost}%</div>
          <span className="text-[11px] text-emerald-600 font-bold">Sau khi học cá nhân hóa</span>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase block">Mức tăng trưởng (Delta)</span>
          <div className="text-3xl font-black text-indigo-700 mt-1">+{avgDelta}%</div>
          <span className="text-[11px] text-indigo-600 font-bold">Cải thiện rõ rệt</span>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase block">Số gợi ý cần dùng</span>
          <div className="text-3xl font-black text-amber-700 mt-1">{avgHintsPre} → {avgHintsPost}</div>
          <span className="text-[11px] text-amber-600 font-bold">Giảm phụ thuộc gợi ý</span>
        </div>
      </div>

      {/* Visual Delta Bar Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-800">
              BIỂU ĐỒ SO SÁNH TRƯỚC VÀ SAU (MẪU 10 HỌC SINH ĐIỂN HÌNH)
            </h3>
            <span className="text-xs text-slate-500">
              Màu xanh nhạt: Trước • Màu xanh đậm: Sau khi học bài thích ứng
            </span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Truoc" name="Khảo sát Trước (%)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Sau" name="Đánh giá Sau (%)" fill="#0D9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 30 Students Pre-Post Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-base">
            BẢNG DỮ LIỆU ĐO LƯỜNG TIẾN BỘ 30 HỌC SINH (DEMO DATASET)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-black uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Mã HS</th>
                <th className="py-3 px-3">Học sinh</th>
                <th className="py-3 px-3">Trước (Khảo sát)</th>
                <th className="py-3 px-3">Sau (Thử nghiệm)</th>
                <th className="py-3 px-3">Mức thay đổi (Δ)</th>
                <th className="py-3 px-3">Số gợi ý (Trước → Sau)</th>
                <th className="py-3 px-3">Quan sát GV</th>
                <th className="py-3 px-3">Hài lòng PH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayRecords.map((r) => (
                <tr key={r.studentId} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3 font-black text-slate-800">{r.studentId}</td>
                  <td className="py-3 px-3 font-bold text-slate-700">{r.studentNickname}</td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-600">
                      {r.preCorrect}/{r.preTotal} ({r.prePercentage}%)
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-black text-emerald-700">
                      {r.postCorrect}/{r.postTotal} ({r.postPercentage}%)
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded-full font-black text-[11px] bg-emerald-100 text-emerald-800">
                      +{r.deltaPercentage}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-bold">
                    {r.hintsPre} lần → <span className="text-emerald-700">{r.hintsPost} lần</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {r.teacherObservation}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-amber-500 font-black">
                      {'★'.repeat(r.parentFeedbackScore)}
                    </span>
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
