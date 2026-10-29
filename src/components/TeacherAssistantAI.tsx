import React, { useState } from 'react';
import { Sparkles, Send, Copy, Check, Save, Share2, Layers, BookOpen, UserCheck, RefreshCw, FileText } from 'lucide-react';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';
import { Assignment } from '../types';

interface TeacherAssistantAIProps {
  onBackToHub: () => void;
}

export const TeacherAssistantAI: React.FC<TeacherAssistantAIProps> = ({ onBackToHub }) => {
  const [taskType, setTaskType] = useState('differentiated');
  const [subject, setSubject] = useState('Tiếng Việt & Toán');
  const [week, setWeek] = useState('Tuần 6');
  const [prompt, setPrompt] = useState('Tạo 5 bài tập phân hóa 3 mức độ về ghép vần an, at và phép cộng phạm vi 5 cho lớp 1A4.');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [sourceBadge, setSourceBadge] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);

  // Quick preset templates
  const PRESETS = [
    {
      label: 'Bài tập 3 mức phân hóa',
      type: 'differentiated',
      subject: 'Tiếng Việt',
      prompt: 'Tạo 5 bài tập phân hóa 3 mức độ: Mức A củng cố âm b, c; Mức B nhận biết từ; Mức C câu ngắn vận dụng.',
    },
    {
      label: 'Dự thảo nhận xét TT27',
      type: 'tt27_comment',
      subject: 'Đánh giá học sinh',
      prompt: 'Soạn dự thảo nhận xét theo Thông tư 27/2020 cho học sinh có tiến bộ rõ rệt ở môn Toán nhưng còn chậm khi đọc vần.',
    },
    {
      label: 'Kế hoạch hòa nhập tuần',
      type: 'inclusive_plan',
      subject: 'Giáo dục hòa nhập',
      prompt: 'Gợi ý kế hoạch hỗ trợ 1 tuần chia nhỏ bài học đếm số 1 đến 5 và ghép tiếng cho học sinh khuyết tật trí tuệ nhẹ.',
    },
    {
      label: 'Phiếu bài tập về nhà',
      type: 'homework',
      subject: 'Toán',
      prompt: 'Soạn 5 câu trắc nghiệm vui về phép trừ trong phạm vi 10 kèm lời khuyên phụ huynh hướng dẫn con 10 phút.',
    },
  ];

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    soundService.playPop();
    setTaskType(preset.type);
    setSubject(preset.subject);
    setPrompt(preset.prompt);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    soundService.playPop();
    setIsLoading(true);
    setIsAssigned(false);

    try {
      const res = await fetch('/api/gemini/teacher-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType,
          subject,
          week,
          prompt,
          targetLevel: 'Phân hóa 3 mức A-B-C',
          studentNotes: 'Lớp 1A4, 30 học sinh, Trường TH Nguyễn Hiền',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedContent(data.result);
        setSourceBadge(data.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash (Server API)' : 'Chuyên gia GDPT 2018 (Hệ tri thức sư phạm)');
        soundService.playCorrect();
      } else {
        alert(data.error || 'Đã có lỗi xảy ra.');
      }
    } catch (e) {
      console.error(e);
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    soundService.playPop();
    navigator.clipboard.writeText(generatedContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAssignNow = () => {
    soundService.playBloom();
    const newAssignment: Assignment = {
      id: `asg_${Date.now()}`,
      title: `Nhiệm vụ AI: ${prompt.slice(0, 35)}...`,
      subject: subject.toLowerCase().includes('toán') ? 'math' : 'vietnamese',
      targetAudience: 'all',
      targetStudentIds: ['HS01', 'HS02', 'HS03', 'HS04', 'HS05', 'HS15'],
      week: 6,
      level: 'B',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: '2026-11-05',
      completedCount: 0,
      description: generatedContent.slice(0, 160) + '...',
    };
    storageService.addAssignment(newAssignment);
    setIsAssigned(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-purple-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">TRỢ LÝ CÔ LINH AI</h2>
                <span className="bg-amber-400 text-amber-950 text-xs px-2.5 py-0.5 rounded-full font-black">
                  Gemini API Server-Side
                </span>
              </div>
              <p className="text-purple-100 text-xs sm:text-sm mt-0.5">
                Thiết kế bài tập phân hóa • Kế hoạch hòa nhập • Dự thảo nhận xét TT27 • Soạn giáo án lớp 1
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
        {/* Left: Prompt Builder */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-md border-2 border-purple-100 space-y-4">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" /> CÔNG CỤ SOẠN THẢO SƯ PHẠM
          </h3>

          {/* Presets */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
              Gợi ý mẫu thông dụng:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100 text-left text-xs font-bold text-purple-950 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject & Week */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Môn học</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Tiếng Việt">Tiếng Việt Lớp 1</option>
                <option value="Toán">Toán Lớp 1</option>
                <option value="Tiếng Việt & Toán">Cả hai môn</option>
                <option value="Giáo dục hòa nhập">Giáo dục hòa nhập (HS15)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tuần học</label>
              <select
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={`Tuần ${i + 1}`}>
                    Tuần {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Prompt */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Yêu cầu cụ thể của cô Linh:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Ví dụ: Tạo 5 bài tập ghép vần an, at cho học sinh lớp 1 cần củng cố..."
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <button
            disabled={isLoading || !prompt.trim()}
            onClick={handleGenerate}
            className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-md transition flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Đang soạn thảo sư phạm...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" /> Soạn thảo cùng Trợ lý AI
              </>
            )}
          </button>
        </div>

        {/* Right: Generated Result & Approval */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-md border-2 border-purple-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="font-black text-slate-800 text-sm">BẢN NHÁP SƯ PHẠM</span>
                {sourceBadge && (
                  <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                    {sourceBadge}
                  </span>
                )}
              </div>
              {generatedContent && (
                <button
                  onClick={handleCopy}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? 'Đã sao chép' : 'Sao chép'}
                </button>
              )}
            </div>

            {/* Editable Content Area */}
            {generatedContent ? (
              <textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={14}
                className="w-full text-xs sm:text-sm font-mono leading-relaxed p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none"
              />
            ) : (
              <div className="py-20 text-center text-slate-400 space-y-2">
                <span className="text-4xl block">✨</span>
                <p className="text-xs sm:text-sm">
                  Chọn một gợi ý mẫu bên trái hoặc nhập yêu cầu để Trợ lý Cô Linh AI soạn thảo ngay!
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  *Nội dung tạo bởi AI là bản nháp, giáo viên luôn duyệt và chỉnh sửa trước khi sử dụng.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {generatedContent && (
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
              <span className="text-[11px] text-slate-500 italic">
                Cô Linh có thể chỉnh sửa trực tiếp nội dung ở trên trước khi phê duyệt.
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleAssignNow}
                  disabled={isAssigned}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 ${
                    isAssigned
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                  }`}
                >
                  {isAssigned ? (
                    <>
                      <Check className="w-4 h-4" /> Đã giao cho lớp 1A4!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" /> Duyệt & Giao bài ngay
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
