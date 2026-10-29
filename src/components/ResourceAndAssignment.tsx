import React, { useState } from 'react';
import { BookOpen, Plus, Send, CheckCircle2, Filter, Upload, FileText, Image as ImageIcon, Sparkles, Layers } from 'lucide-react';
import { Assignment, QuestionItem, SupportLevel } from '../types';
import { SAMPLE_QUESTIONS } from '../data/initialData';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

interface ResourceProps {
  onBackToHub: () => void;
}

export const ResourceAndAssignment: React.FC<ResourceProps> = ({ onBackToHub }) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'assignments' | 'create_assignment'>('questions');
  const [questions, setQuestions] = useState<QuestionItem[]>(SAMPLE_QUESTIONS);
  const [assignments, setAssignments] = useState<Assignment[]>(() => storageService.getAssignments());

  // Filter
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'vietnamese' | 'math'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | SupportLevel>('all');

  // New Question modal / form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState('');
  const [newSubject, setNewSubject] = useState<'vietnamese' | 'math'>('vietnamese');
  const [newLevel, setNewLevel] = useState<SupportLevel>('B');
  const [newCorrect, setNewCorrect] = useState('');
  const [newEmoji, setNewEmoji] = useState('🌟');

  // File upload state notification
  const [uploadNote, setUploadNote] = useState<string | null>(null);

  // New Assignment form state
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubject, setAsgSubject] = useState<'vietnamese' | 'math' | 'inclusive'>('vietnamese');
  const [asgAudience, setAsgAudience] = useState<'all' | 'level_A' | 'level_B' | 'level_C' | 'hs15'>('level_A');
  const [asgDesc, setAsgDesc] = useState('');

  const filteredQuestions = questions.filter((q) => {
    if (subjectFilter !== 'all' && q.subject !== subjectFilter) return false;
    if (levelFilter !== 'all' && q.level !== levelFilter) return false;
    return true;
  });

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim() || !newCorrect.trim()) return;
    soundService.playCorrect();

    const created: QuestionItem = {
      id: `q_custom_${Date.now()}`,
      subject: newSubject,
      skillId: newSubject === 'vietnamese' ? 'tv_nhan_biet_tieng' : 'toan_cong_pham_vi',
      prompt: newPrompt,
      imageEmoji: newEmoji,
      options: [
        { id: 'opt_1', text: newCorrect },
        { id: 'opt_2', text: 'Phương án B' },
        { id: 'opt_3', text: 'Phương án C' },
      ],
      correctOptionId: 'opt_1',
      hint: 'Hãy nhìn kỹ hình minh họa và gợi ý của cô nhé.',
      explanation: 'Đúng rồi! Bé làm rất chính xác.',
      level: newLevel,
    };

    setQuestions([created, ...questions]);
    setShowAddModal(false);
    setNewPrompt('');
    setNewCorrect('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      soundService.playPop();
      setUploadNote(`Đã tiếp nhận tệp "${file.name}". Hệ thống AI trích xuất nội dung câu hỏi và hỗ trợ cô biên tập vào ngân hàng đề.`);
      setTimeout(() => setUploadNote(null), 5000);
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;
    soundService.playBloom();

    const newAsg: Assignment = {
      id: `asg_${Date.now()}`,
      title: asgTitle,
      subject: asgSubject,
      targetAudience: asgAudience,
      targetStudentIds: asgAudience === 'hs15' ? ['HS15'] : ['HS01', 'HS03', 'HS06', 'HS15'],
      week: 6,
      level: asgAudience === 'level_C' ? 'C' : asgAudience === 'level_B' ? 'B' : 'A',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: '2026-11-05',
      completedCount: 0,
      description: asgDesc || 'Nhiệm vụ học tập được cá nhân hóa bởi cô Thùy Linh.',
    };

    storageService.addAssignment(newAsg);
    setAssignments([newAsg, ...assignments]);
    setActiveTab('assignments');
    setAsgTitle('');
    setAsgDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-teal-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">
                  KHO HỌC LIỆU VÀ GIAO NHIỆM VỤ
                </h2>
                <span className="bg-amber-300 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                  Phân hóa 3 Mức
                </span>
              </div>
              <p className="text-teal-100 text-xs sm:text-sm mt-0.5">
                Ngân hàng câu hỏi bám sát GDPT 2018 • Giao bài linh hoạt cho cá nhân hoặc nhóm
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

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 mt-5 border-t border-white/20 pt-4 overflow-x-auto">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('questions');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
              activeTab === 'questions' ? 'bg-white text-emerald-950 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Ngân hàng câu hỏi ({questions.length})
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('assignments');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
              activeTab === 'assignments' ? 'bg-white text-emerald-950 shadow-md' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Nhiệm vụ đã giao ({assignments.length})
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('create_assignment');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-1.5 ${
              activeTab === 'create_assignment' ? 'bg-white text-emerald-950 shadow-md' : 'bg-amber-400 text-amber-950 hover:bg-amber-300'
            }`}
          >
            <Plus className="w-4 h-4" /> Giao nhiệm vụ mới
          </button>
        </div>
      </div>

      {uploadNote && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold animate-fade-in flex items-center gap-2">
          <span>✅</span>
          <span>{uploadNote}</span>
        </div>
      )}

      {/* 1. QUESTIONS BANK */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Controls: Filter & Add */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={subjectFilter}
                onChange={(e: any) => setSubjectFilter(e.target.value)}
                className="text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">Tất cả môn</option>
                <option value="vietnamese">Tiếng Việt Lớp 1</option>
                <option value="math">Toán Học Lớp 1</option>
              </select>

              <select
                value={levelFilter}
                onChange={(e: any) => setLevelFilter(e.target.value)}
                className="text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="A">Mức A (Cần củng cố)</option>
                <option value="B">Mức B (Đang tiến bộ)</option>
                <option value="C">Mức C (Sẵn sàng mở rộng)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
                <Upload className="w-3.5 h-3.5" /> Tải tệp câu hỏi (Word/PDF)
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Thêm câu hỏi mới
              </button>
            </div>
          </div>

          {/* Question Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q) => (
              <div key={q.id} className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {q.subject === 'vietnamese' ? '📖 Tiếng Việt' : '🔢 Toán Học'}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      q.level === 'C'
                        ? 'bg-emerald-100 text-emerald-800'
                        : q.level === 'B'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Mức {q.level}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  {q.imageEmoji && (
                    <div className="text-3xl p-2 bg-slate-50 rounded-xl border border-slate-200 flex-shrink-0">
                      {q.imageEmoji}
                    </div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm leading-snug">
                      {q.prompt}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Đáp án đúng: <span className="font-bold text-emerald-700">{q.options.find(o => o.id === q.correctOptionId)?.text}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 italic">
                  Gợi ý: {q.hint}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ASSIGNMENTS LIST */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => (
              <div key={asg.id} className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {asg.subject === 'inclusive' ? '🌸 Hòa nhập' : asg.subject === 'vietnamese' ? '📖 Tiếng Việt' : '🔢 Toán'}
                  </span>
                  <span className="text-xs text-slate-400">Hạn: {asg.dueDate}</span>
                </div>

                <h4 className="font-black text-slate-800 text-base">{asg.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{asg.description}</p>

                <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Đối tượng: {asg.targetAudience}</span>
                  <span className="text-emerald-700">Đã hoàn thành: {asg.completedCount} em</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CREATE ASSIGNMENT FORM */}
      {activeTab === 'create_assignment' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto space-y-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-600" /> GIAO NHIỆM VỤ PHÂN HÓA LỚP 1A4
          </h3>

          <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs font-bold">
            <div>
              <label className="text-slate-700 block mb-1">Tiêu đề nhiệm vụ:</label>
              <input
                type="text"
                required
                value={asgTitle}
                onChange={(e) => setAsgTitle(e.target.value)}
                placeholder="Ví dụ: Ôn tập ghép vần an, at và phép cộng phạm vi 5..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-normal"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 block mb-1">Môn học:</label>
                <select
                  value={asgSubject}
                  onChange={(e: any) => setAsgSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="vietnamese">Tiếng Việt</option>
                  <option value="math">Toán Học</option>
                  <option value="inclusive">Chế độ hòa nhập (Cùng em tiến bước)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Nhóm học sinh nhận bài:</label>
                <select
                  value={asgAudience}
                  onChange={(e: any) => setAsgAudience(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">Tất cả lớp 1A4 (30 em)</option>
                  <option value="level_A">Nhóm Mức A (Cần củng cố)</option>
                  <option value="level_B">Nhóm Mức B (Đang tiến bộ)</option>
                  <option value="level_C">Nhóm Mức C (Sẵn sàng mở rộng)</option>
                  <option value="hs15">Học sinh hòa nhập (HS15)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Mô tả và dặn dò của cô:</label>
              <textarea
                value={asgDesc}
                onChange={(e) => setAsgDesc(e.target.value)}
                rows={3}
                placeholder="Lời dặn dịu dàng, khích lệ các em học vui vẻ..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-normal"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-md transition"
            >
              Phát hành nhiệm vụ ngay
            </button>
          </form>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-emerald-300 space-y-4">
            <h3 className="font-black text-base text-slate-800">THÊM CÂU HỎI MỚI VÀO KHO</h3>
            <form onSubmit={handleAddQuestion} className="space-y-3 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Nội dung câu hỏi:</label>
                <input
                  type="text"
                  required
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Ví dụ: Bé hãy đếm số lượng quả táo..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 block mb-1">Môn:</label>
                  <select
                    value={newSubject}
                    onChange={(e: any) => setNewSubject(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="vietnamese">Tiếng Việt</option>
                    <option value="math">Toán Học</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Mức độ:</label>
                  <select
                    value={newLevel}
                    onChange={(e: any) => setNewLevel(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="A">Mức A</option>
                    <option value="B">Mức B</option>
                    <option value="C">Mức C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Đáp án đúng:</label>
                <input
                  type="text"
                  required
                  value={newCorrect}
                  onChange={(e) => setNewCorrect(e.target.value)}
                  placeholder="Ví dụ: 3 quả táo"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-xs shadow"
                >
                  Lưu vào kho
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
