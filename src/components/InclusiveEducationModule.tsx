import React, { useState } from 'react';
import { Volume2, Sparkles, Heart, CheckCircle2, RotateCcw, Edit3, Save, ShieldCheck, Flower2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';
import { Student, IndividualEducationPlan, UserRole } from '../types';

interface InclusiveProps {
  student: Student;
  currentRole: UserRole;
  onBackToHub: () => void;
}

export const InclusiveEducationModule: React.FC<InclusiveProps> = ({
  student,
  currentRole,
  onBackToHub,
}) => {
  const [activeTab, setActiveTab] = useState<'practice' | 'iep' | 'flower'>('practice');

  // Interactive 5-step broken-down task: "Đếm quả táo ngọt"
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [tappedApples, setTappedApples] = useState<number[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  // IEP State
  const [iep, setIep] = useState<IndividualEducationPlan>(() => storageService.getIEP());
  const [isEditingIEP, setIsEditingIEP] = useState(false);
  const [tempIEP, setTempIEP] = useState<IndividualEducationPlan>(iep);

  const APPLES_COUNT = 3;

  const handleAppleTap = (index: number) => {
    soundService.playPop();
    if (!tappedApples.includes(index)) {
      const next = [...tappedApples, index];
      setTappedApples(next);
      soundService.speakVietnamese(`${next.length}`);
      if (next.length === APPLES_COUNT) {
        soundService.playBloom();
        setTimeout(() => setStep(3), 800);
      }
    }
  };

  const handleSelectNumber = (num: number) => {
    setSelectedNumber(num);
    if (num === APPLES_COUNT) {
      soundService.playCorrect();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      // Increment flower petal
      storageService.recordAttempt({
        studentId: student.id,
        subject: 'inclusive',
        topic: 'Chia nhỏ nhiệm vụ: Đếm 3 quả táo',
        score: 3,
        total: 3,
        hintsUsed: 0,
        level: 'A',
        timeSpentSeconds: 90,
      });

      setStep(5);
    } else {
      soundService.playGentleRetry();
    }
  };

  const handleSaveIEP = () => {
    soundService.playPop();
    storageService.saveIEP(tempIEP);
    setIep(tempIEP);
    setIsEditingIEP(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-emerald-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black">CÙNG EM TIẾN BƯỚC</h2>
                <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Hỗ trợ Giáo dục Hòa nhập
                </span>
              </div>
              <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                Chia nhỏ bài học • Thao tác chạm trực quan • Bông hoa tiến bộ • Bảo mật nhân văn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHub}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition"
            >
              ← Về Trang Chủ
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-5 border-t border-white/20 pt-4 overflow-x-auto">
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('practice');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-1.5 ${
              activeTab === 'practice'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span>🧩</span> Bài tập chia nhỏ (Dễ tiếp cận)
          </button>
          <button
            onClick={() => {
              soundService.playPop();
              setActiveTab('flower');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-1.5 ${
              activeTab === 'flower'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span>🌸</span> Bông hoa tiến bộ ({iep.petalsCount}/6 cánh)
          </button>
          {currentRole === 'teacher' && (
            <button
              onClick={() => {
                soundService.playPop();
                setActiveTab('iep');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-1.5 ${
                activeTab === 'iep'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" /> Kế hoạch hỗ trợ cá nhân (Dành cho Cô)
            </button>
          )}
        </div>
      </div>

      {/* 1. PRACTICAL ACCESSIBLE 5-STEP TASK */}
      {activeTab === 'practice' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border-4 border-emerald-200 max-w-2xl mx-auto text-center">
          {/* Step Progress Indicator */}
          <div className="flex items-center justify-between max-w-md mx-auto mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-sm sm:text-base border-4 transition ${
                    step >= s
                      ? 'bg-emerald-500 border-emerald-300 text-white shadow-md'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  {s}
                </div>
                {s < 5 && (
                  <div
                    className={`w-6 sm:w-10 h-1.5 transition ${
                      step > s ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Quan sát hình */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 inline-block">
                <span className="text-xs font-black text-amber-800 uppercase">
                  Bước 1: Bé cùng quan sát tranh
                </span>
              </div>
              <div className="flex justify-center gap-6 my-6">
                {Array.from({ length: APPLES_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-rose-50 border-4 border-rose-300 flex items-center justify-center text-5xl sm:text-6xl shadow-sm"
                  >
                    🍎
                  </div>
                ))}
              </div>
              <p className="text-lg sm:text-xl font-bold text-slate-800">
                Ở đây có những quả táo đỏ thật là đẹp!
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => soundService.speakVietnamese('Ở đây có những quả táo đỏ thật là đẹp! Bé hãy bấm nút để cùng đếm nhé.')}
                  className="px-5 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-2xl font-black text-sm flex items-center gap-2 transition"
                >
                  <Volume2 className="w-5 h-5 text-emerald-700" /> Nghe cô nói
                </button>
                <button
                  onClick={() => {
                    soundService.playPop();
                    setStep(2);
                  }}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-base shadow-md flex items-center gap-2 transition"
                >
                  Bắt đầu đếm <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Chạm từng quả táo */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 inline-block">
                <span className="text-xs font-black text-emerald-800 uppercase">
                  Bước 2: Bé dùng ngón tay chạm vào từng quả táo
                </span>
              </div>
              <p className="text-slate-600 text-sm">
                Đã chạm được: {tappedApples.length} / {APPLES_COUNT} quả táo
              </p>

              <div className="flex justify-center gap-4 sm:gap-6 my-6">
                {Array.from({ length: APPLES_COUNT }).map((_, i) => {
                  const isTapped = tappedApples.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => handleAppleTap(i)}
                      className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-5xl sm:text-6xl border-4 transition transform active:scale-90 ${
                        isTapped
                          ? 'bg-amber-100 border-amber-500 scale-105 shadow-md ring-4 ring-amber-200'
                          : 'bg-white border-slate-300 hover:border-emerald-400 shadow-sm'
                      }`}
                    >
                      🍎
                      {isTapped && (
                        <span className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 text-white rounded-full text-sm font-black flex items-center justify-center shadow">
                          {tappedApples.indexOf(i) + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {tappedApples.length === APPLES_COUNT ? (
                <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 font-black animate-fade-in">
                  🎉 Hoan hô bé đã chạm đủ 3 quả táo!
                </div>
              ) : (
                <button
                  onClick={() => soundService.speakVietnamese('Bé chạm vào từng quả táo để đếm một, hai, ba nào.')}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" /> Nghe hướng dẫn
                </button>
              )}
            </div>
          )}

          {/* Step 3: Nghe các số được đọc */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-200 inline-block">
                <span className="text-xs font-black text-cyan-800 uppercase">
                  Bước 3: Nghe cô đọc số lượng
                </span>
              </div>
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex flex-col items-center justify-center text-white shadow-lg">
                <span className="text-5xl font-black">3</span>
                <span className="text-xs font-bold uppercase tracking-widest mt-1">Ba quả táo</span>
              </div>
              <p className="text-lg font-bold text-slate-800">
                "Một... Hai... Ba quả táo!"
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => soundService.speakVietnamese('Một, hai, ba. Có tất cả ba quả táo.')}
                  className="px-6 py-3 bg-cyan-100 hover:bg-cyan-200 text-cyan-900 rounded-2xl font-black text-sm flex items-center gap-2 transition"
                >
                  <Volume2 className="w-5 h-5" /> Nghe lại
                </button>
                <button
                  onClick={() => {
                    soundService.playPop();
                    setStep(4);
                  }}
                  className="px-8 py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-black text-base shadow-md transition"
                >
                  Chọn chữ số 3 <ArrowRight className="w-5 h-5 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Chọn số đúng (Ít phương án: 2 lựa chọn) */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 inline-block">
                <span className="text-xs font-black text-amber-800 uppercase">
                  Bước 4: Bé chọn số tương ứng với 3 quả táo
                </span>
              </div>

              <div className="flex justify-center gap-3 my-4">
                {Array.from({ length: APPLES_COUNT }).map((_, i) => (
                  <span key={i} className="text-4xl">🍎</span>
                ))}
              </div>

              <p className="text-base font-bold text-slate-700">
                Đâu là số <span className="text-2xl font-black text-emerald-700">3</span>?
              </p>

              {/* Only 2 choices to reduce cognitive overload */}
              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto my-6">
                {[2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleSelectNumber(num)}
                    className={`py-6 text-4xl sm:text-5xl font-black rounded-3xl border-4 transition transform active:scale-95 ${
                      selectedNumber === num
                        ? num === APPLES_COUNT
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-105 shadow-md'
                          : 'bg-rose-100 border-rose-400 text-rose-800'
                        : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-800 shadow-sm'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                onClick={() => soundService.speakVietnamese('Bé hãy chọn số ba có hai nét cong tròn xinh xắn nhé.')}
                className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 inline-flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" /> Gợi ý của cô
              </button>
            </div>
          )}

          {/* Step 5: Nhận lời động viên & Bông hoa nở thêm cánh */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-7xl animate-bounce">🌸</div>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-800">
                BÉ AN GIỎI QUÁ!
              </h3>
              <p className="text-slate-600 font-semibold max-w-md mx-auto text-sm sm:text-base">
                Em đã tự tay đếm được 3 quả táo và chọn đúng chữ số 3. Bông hoa tiến bộ của em vừa nở thêm 1 cánh hoa rực rỡ!
              </p>

              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 max-w-sm mx-auto shadow-inner flex items-center justify-around">
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase">Tiến độ</span>
                  <div className="text-2xl font-black text-emerald-700">100% Hoàn thành</div>
                </div>
                <div className="w-px h-10 bg-emerald-200"></div>
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase">Bông hoa</span>
                  <div className="text-2xl font-black text-rose-600 flex items-center gap-1">
                    <span>+1 Cánh</span> 🌸
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setStep(1);
                    setTappedApples([]);
                    setSelectedNumber(null);
                  }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-md transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Luyện tập lại
                </button>
                <button
                  onClick={() => setActiveTab('flower')}
                  className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-md transition flex items-center justify-center gap-2"
                >
                  <Flower2 className="w-5 h-5" /> Xem Bông hoa tiến bộ
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. BÔNG HOA TIẾN BỘ */}
      {activeTab === 'flower' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            🌸 Bông hoa tiến bộ của em
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800">
            MỖI NỖ LỰC NHỎ - MỘT CÁNH HOA NỞ
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Không đo bằng áp lực điểm số, mà trân trọng từng lần em tự làm, từng lần em kiên trì tham gia
          </p>

          {/* Interactive Progress Flower Graphic */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-8 flex items-center justify-center">
            {/* 6 Petals */}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const isBloomed = i < iep.petalsCount;
              const angle = i * 60;
              return (
                <div
                  key={i}
                  style={{
                    transform: `rotate(${angle}deg) translateY(-54px)`,
                  }}
                  className={`absolute w-16 h-24 rounded-full border-2 transition-all duration-700 ${
                    isBloomed
                      ? 'bg-gradient-to-t from-rose-400 to-pink-300 border-rose-400 shadow-md opacity-95 scale-100'
                      : 'bg-slate-100 border-dashed border-slate-300 opacity-30 scale-90'
                  }`}
                ></div>
              );
            })}

            {/* Flower Center with Sprout Face */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-amber-400 border-4 border-amber-500 shadow-lg flex flex-col items-center justify-center text-amber-950">
              <span className="text-2xl">😊</span>
              <span className="text-xs font-black mt-1">BÉ AN</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 max-w-md mx-auto border border-emerald-200 text-left space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Số cánh hoa đã nở:</span>
              <span className="text-base font-black text-rose-600">{iep.petalsCount} / 6 cánh</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(iep.petalsCount / 6) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-600 italic">
              "Em đã tự chạm đếm độc lập và tham gia đầy đủ các hoạt động học tập trong tuần!"
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setActiveTab('practice')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow"
            >
              Tiếp tục luyện tập để nở thêm cánh hoa 🌱
            </button>
          </div>
        </div>
      )}

      {/* 3. INDIVIDUAL EDUCATION PLAN (IEP) - TEACHER ONLY */}
      {activeTab === 'iep' && currentRole === 'teacher' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-emerald-200 max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  KẾ HOẠCH HỖ TRỢ CÁ NHÂN (IEP) - LỚP 1A4
                </h3>
                <span className="text-xs text-slate-500">
                  Mã hồ sơ: HS15 (Chế độ riêng tư của giáo viên - Không công khai)
                </span>
              </div>
            </div>
            {!isEditingIEP ? (
              <button
                onClick={() => {
                  soundService.playPop();
                  setTempIEP(iep);
                  setIsEditingIEP(true);
                }}
                className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa kế hoạch
              </button>
            ) : (
              <button
                onClick={handleSaveIEP}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition"
              >
                <Save className="w-3.5 h-3.5" /> Lưu kế hoạch
              </button>
            )}
          </div>

          {/* Form / View fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="text-xs font-black text-slate-700 uppercase block mb-1">
                1. Điểm mạnh của học sinh
              </label>
              {isEditingIEP ? (
                <textarea
                  value={tempIEP.strengths}
                  onChange={(e) => setTempIEP({ ...tempIEP, strengths: e.target.value })}
                  className="w-full text-xs p-2.5 border rounded-xl bg-white"
                  rows={3}
                />
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed">{iep.strengths}</p>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="text-xs font-black text-slate-700 uppercase block mb-1">
                2. Nhu cầu hỗ trợ cá nhân
              </label>
              {isEditingIEP ? (
                <textarea
                  value={tempIEP.needs}
                  onChange={(e) => setTempIEP({ ...tempIEP, needs: e.target.value })}
                  className="w-full text-xs p-2.5 border rounded-xl bg-white"
                  rows={3}
                />
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed">{iep.needs}</p>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="text-xs font-black text-slate-700 uppercase block mb-1">
                3. Mục tiêu học tập theo tuần
              </label>
              {isEditingIEP ? (
                <textarea
                  value={tempIEP.weeklyGoal}
                  onChange={(e) => setTempIEP({ ...tempIEP, weeklyGoal: e.target.value })}
                  className="w-full text-xs p-2.5 border rounded-xl bg-white"
                  rows={3}
                />
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed">{iep.weeklyGoal}</p>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="text-xs font-black text-slate-700 uppercase block mb-1">
                4. Mức độ gợi ý hiện tại
              </label>
              {isEditingIEP ? (
                <select
                  value={tempIEP.promptLevel}
                  onChange={(e: any) => setTempIEP({ ...tempIEP, promptLevel: e.target.value })}
                  className="w-full text-xs p-2.5 border rounded-xl bg-white"
                >
                  <option value="Hỗ trợ từng bước">Hỗ trợ từng bước</option>
                  <option value="Gợi ý trực quan">Gợi ý trực quan</option>
                  <option value="Nhắc nhở nhẹ">Nhắc nhở nhẹ</option>
                  <option value="Độc lập">Độc lập</option>
                </select>
              ) : (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-lg mt-1">
                  {iep.promptLevel}
                </span>
              )}
            </div>
          </div>

          {/* Teacher's pedagogical review notes */}
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
            <label className="text-xs font-black text-emerald-900 uppercase block mb-1">
              5. Nhận xét định kỳ của cô Thùy Linh (Theo Thông tư 27)
            </label>
            {isEditingIEP ? (
              <textarea
                value={tempIEP.teacherNotes}
                onChange={(e) => setTempIEP({ ...tempIEP, teacherNotes: e.target.value })}
                className="w-full text-xs p-2.5 border rounded-xl bg-white"
                rows={3}
              />
            ) : (
              <p className="text-xs text-emerald-900 leading-relaxed">{iep.teacherNotes}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
