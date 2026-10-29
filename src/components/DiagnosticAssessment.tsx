import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, Lightbulb, ArrowRight, BookOpen, Layers, BarChart2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';
import { Student, TextbookSeries, QuestionItem } from '../types';
import { SAMPLE_QUESTIONS, SKILLS_CONFIG } from '../data/initialData';

interface DiagnosticProps {
  student: Student;
  onComplete: () => void;
  onBackToHub: () => void;
}

export const DiagnosticAssessment: React.FC<DiagnosticProps> = ({
  student,
  onComplete,
  onBackToHub,
}) => {
  // Setup options
  const [subject, setSubject] = useState<'vietnamese' | 'math'>('vietnamese');
  const [textbook, setTextbook] = useState<TextbookSeries>('ket_noi_tri_thuc');
  const [week, setWeek] = useState(6);
  const [questionCount, setQuestionCount] = useState<5 | 7 | 10>(5);
  const [isStarted, setIsStarted] = useState(false);

  // Assessment runtime state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [skillBreakdown, setSkillBreakdown] = useState<Record<string, { correct: number; total: number }>>({});

  // Filter sample questions by subject
  const currentQuestions = SAMPLE_QUESTIONS.filter((q) => q.subject === subject).slice(0, questionCount);

  const handleStart = () => {
    soundService.playPop();
    setIsStarted(true);
    setCurrentIndex(0);
    setScore(0);
    setHintsUsed(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsFinished(false);
    setSkillBreakdown({});
  };

  const currentQ = currentQuestions[currentIndex] || currentQuestions[0];

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optId);
    setIsAnswered(true);

    const isMatch = optId === currentQ.correctOptionId;
    if (isMatch) {
      soundService.playCorrect();
      setIsCorrect(true);
      setScore((prev) => prev + 1);
    } else {
      soundService.playGentleRetry();
      setIsCorrect(false);
    }

    // Update skill breakdown
    setSkillBreakdown((prev) => {
      const prevSkill = prev[currentQ.skillId] || { correct: 0, total: 0 };
      return {
        ...prev,
        [currentQ.skillId]: {
          correct: prevSkill.correct + (isMatch ? 1 : 0),
          total: prevSkill.total + 1,
        },
      };
    });
  };

  const handleNext = () => {
    soundService.playPop();
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      // Completed assessment
      setIsFinished(true);
      soundService.playBloom();
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      // Calculate final diagnostic score and save to student
      const finalScore = score + (isCorrect ? 1 : 0);
      const totalQ = currentQuestions.length;
      storageService.recordAttempt({
        studentId: student.id,
        subject,
        topic: `Khảo sát năng lực ${subject === 'vietnamese' ? 'Tiếng Việt' : 'Toán'} (Tuần ${week})`,
        score: finalScore,
        total: totalQ,
        hintsUsed,
        level: student.learningLevel,
        timeSpentSeconds: 120,
      });
    }
  };

  // View: Setup Form
  if (!isStarted) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <h2 className="text-xl font-black text-slate-800">
                KHẢO SÁT NĂNG LỰC ĐẦU VÀO
              </h2>
              <p className="text-xs text-slate-500">
                Thiết lập bài khảo sát thích ứng chuẩn GDPT 2018 cho {student.nickname} ({student.id})
              </p>
            </div>
          </div>
          <button
            onClick={onBackToHub}
            className="text-xs font-bold text-slate-500 hover:text-slate-700"
          >
            ← Quay lại
          </button>
        </div>

        {/* 1. Choose Subject */}
        <div>
          <label className="text-xs font-black text-slate-700 uppercase block mb-2">
            1. Chọn môn khảo sát
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundService.playPop();
                setSubject('vietnamese');
              }}
              className={`p-4 rounded-2xl border-4 text-left transition ${
                subject === 'vietnamese'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-700 font-bold'
              }`}
            >
              <div className="text-2xl mb-1">📖</div>
              <div className="text-base">Tiếng Việt Lớp 1</div>
              <div className="text-xs opacity-75 font-normal">7 kỹ năng: Âm, vần, tiếng, từ, đọc hiểu</div>
            </button>
            <button
              onClick={() => {
                soundService.playPop();
                setSubject('math');
              }}
              className={`p-4 rounded-2xl border-4 text-left transition ${
                subject === 'math'
                  ? 'bg-amber-50 border-amber-500 text-amber-950 font-black shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:border-amber-300 text-slate-700 font-bold'
              }`}
            >
              <div className="text-2xl mb-1">🔢</div>
              <div className="text-base">Toán Học Lớp 1</div>
              <div className="text-xs opacity-75 font-normal">7 kỹ năng: Đếm số, so sánh, cộng trừ</div>
            </button>
          </div>
        </div>

        {/* 2. Choose Textbook Series */}
        <div>
          <label className="text-xs font-black text-slate-700 uppercase block mb-2">
            2. Chọn bộ sách giáo khoa
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ket_noi_tri_thuc', name: 'Kết nối tri thức', icon: '🌱' },
              { id: 'chan_troi_sang_tao', name: 'Chân trời sáng tạo', icon: '🌅' },
              { id: 'canh_dieu', name: 'Cánh diều', icon: '🪁' },
            ].map((tb) => (
              <button
                key={tb.id}
                onClick={() => {
                  soundService.playPop();
                  setTextbook(tb.id as TextbookSeries);
                }}
                className={`p-3 rounded-2xl border-2 text-center text-xs font-black transition ${
                  textbook === tb.id
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-700'
                }`}
              >
                <span className="text-lg block mb-0.5">{tb.icon}</span>
                {tb.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Choose Week and Questions Count */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black text-slate-700 uppercase block mb-2">
              3. Tuần học đã dạy
            </label>
            <select
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="w-full p-3 rounded-2xl border-2 border-slate-200 text-sm font-bold bg-white"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  Tuần {w} (Kiến thức đã học)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 uppercase block mb-2">
              4. Số lượng câu hỏi
            </label>
            <div className="flex gap-2">
              {[5, 7, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num as 5 | 7 | 10)}
                  className={`flex-1 py-3 rounded-2xl border-2 text-xs font-black transition ${
                    questionCount === num
                      ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-amber-300 text-slate-700'
                  }`}
                >
                  {num} câu
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Bắt đầu khảo sát</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // View: Finished Results & Radar / Skill Profile
  if (isFinished) {
    const finalPct = Math.round((score / currentQuestions.length) * 100);

    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg text-center max-w-2xl mx-auto border-4 border-emerald-300 space-y-6">
        <div className="text-6xl animate-bounce">📊</div>
        <h3 className="text-2xl font-black text-slate-800">
          KẾT QUẢ KHẢO SÁT NĂNG LỰC ĐẦU VÀO
        </h3>
        <p className="text-slate-600 text-sm">
          Học sinh: <span className="font-bold text-emerald-800">{student.nickname} ({student.id})</span> • Lớp 1A4 • Tuần {week}
        </p>

        {/* Score Overview */}
        <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-200 flex items-center justify-around max-w-md mx-auto">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Điểm số</div>
            <div className="text-4xl font-black text-emerald-700">
              {score} / {currentQuestions.length}
            </div>
          </div>
          <div className="w-px h-12 bg-emerald-200"></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Mức đề xuất</div>
            <div className="text-2xl font-black text-amber-600">
              {finalPct >= 80 ? 'Mức C (Mở rộng)' : finalPct >= 40 ? 'Mức B (Tiến bộ)' : 'Mức A (Củng cố)'}
            </div>
          </div>
        </div>

        {/* Skill Profile Bars */}
        <div className="text-left bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-black text-slate-700 uppercase flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-emerald-600" /> Hồ sơ năng lực theo kỹ năng:
          </h4>
          {(subject === 'vietnamese' ? SKILLS_CONFIG.vietnamese : SKILLS_CONFIG.math).slice(0, 5).map((sk) => {
            const skillData = skillBreakdown[sk.id];
            const pct = skillData ? Math.round((skillData.correct / skillData.total) * 100) : 75;
            return (
              <div key={sk.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{sk.name}</span>
                  <span className="text-emerald-700">{pct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 80 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setIsStarted(false)}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition"
          >
            Khảo sát lại
          </button>
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-md transition"
          >
            Xem lộ trình cá nhân hóa →
          </button>
        </div>
      </div>
    );
  }

  // View: Questions Runtime
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <span className="font-black text-slate-800 text-sm sm:text-base">
            Khảo sát {subject === 'vietnamese' ? 'Tiếng Việt' : 'Toán'} • Tuần {week}
          </span>
        </div>
        <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full">
          Câu {currentIndex + 1} / {currentQuestions.length}
        </span>
      </div>

      {/* Question Prompt */}
      <div className="text-center my-4 space-y-3">
        {currentQ.imageEmoji && (
          <div className="text-5xl my-2 p-3 bg-emerald-50/50 rounded-2xl inline-block border border-emerald-100">
            {currentQ.imageEmoji}
          </div>
        )}
        <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
          {currentQ.prompt}
        </h3>

        <button
          onClick={() => {
            soundService.playPop();
            soundService.speakVietnamese(currentQ.audioPrompt || currentQ.prompt);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-black transition"
        >
          <Volume2 className="w-4 h-4 text-amber-600" /> Nghe hướng dẫn
        </button>
      </div>

      {/* Options List */}
      <div className="grid grid-cols-1 gap-3 my-6">
        {currentQ.options.map((opt) => (
          <button
            key={opt.id}
            disabled={isAnswered}
            onClick={() => handleSelectOption(opt.id)}
            className={`p-4 rounded-2xl border-4 text-left transition transform active:scale-98 flex items-center justify-between ${
              selectedOptionId === opt.id
                ? opt.id === currentQ.correctOptionId
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-sm'
                  : 'bg-rose-100 border-rose-400 text-rose-900'
                : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-800'
            }`}
          >
            <span className="text-base font-extrabold">{opt.text}</span>
            {selectedOptionId === opt.id && (
              <span className="text-xl">
                {opt.id === currentQ.correctOptionId ? '✅' : '❌'}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Feedback banner */}
      {isAnswered && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-start gap-2.5 animate-fade-in ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <span className="text-xl">{isCorrect ? '🌟' : '💡'}</span>
          <div>
            <div>{isCorrect ? 'Đúng rồi! Bé làm rất tốt.' : 'Chưa chính xác nhưng không sao cả, cùng xem giải thích nhé!'}</div>
            <div className="font-normal opacity-90 mt-0.5">{currentQ.explanation}</div>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          onClick={() => {
            setShowHint(!showHint);
            setHintsUsed((prev) => prev + 1);
            soundService.playPop();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200"
        >
          <Lightbulb className="w-3.5 h-3.5" /> Gợi ý của Mầm Xanh
        </button>

        {isAnswered && (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-md flex items-center gap-1.5"
          >
            {currentIndex + 1 < currentQuestions.length ? 'Câu tiếp theo' : 'Hoàn thành khảo sát'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {showHint && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl">
          🌱 {currentQ.hint}
        </div>
      )}
    </div>
  );
};
