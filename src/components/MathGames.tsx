import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, Lightbulb, ArrowRight, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';
import { Student } from '../types';

interface MathGamesProps {
  student: Student;
  onGameComplete?: () => void;
  onBackToHub: () => void;
}

type MathGameType =
  | 'be_dem_gioi'
  | 'ngoi_nha_so'
  | 'ai_lon_hon'
  | 'doan_tau'
  | 'khu_vuon'
  | 'o_cua_cong'
  | 'thu_thach_tru'
  | 'nha_tham_hiem';

export const MathGames: React.FC<MathGamesProps> = ({
  student,
  onGameComplete,
  onBackToHub,
}) => {
  const [selectedGame, setSelectedGame] = useState<MathGameType | null>(null);

  // Common game state
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Specific state for Bé đếm giỏi (tap counting)
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);

  // Specific state for Khu vườn phép tính
  const [selectedGardenEquations, setSelectedGardenEquations] = useState<string[]>([]);

  const resetGameState = () => {
    setScore(0);
    setQuestionIndex(0);
    setHintsUsed(0);
    setShowHint(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsFinished(false);
    setTappedIndices([]);
    setSelectedGardenEquations([]);
  };

  const handleSelectGame = (game: MathGameType) => {
    soundService.playPop();
    setSelectedGame(game);
    resetGameState();
  };

  const fireCelebration = () => {
    soundService.playBloom();
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  const finishGame = (finalScore: number, totalQ: number, gameTitle: string) => {
    setIsFinished(true);
    fireCelebration();
    storageService.recordAttempt({
      studentId: student.id,
      subject: 'math',
      topic: gameTitle,
      score: finalScore,
      total: totalQ,
      hintsUsed,
      level: student.learningLevel,
      timeSpentSeconds: 60,
    });
    if (onGameComplete) onGameComplete();
  };

  // 1. BÉ ĐẾM GIỎI DATA
  const BE_DEM_GIOI_QUESTIONS = [
    { count: 3, itemEmoji: '🍎', itemName: 'quả táo', options: ['3', '2', '4'], hint: 'Chạm vào từng quả táo để cùng đếm 1, 2, 3 nhé!' },
    { count: 5, itemEmoji: '⭐', itemName: 'ngôi sao', options: ['5', '4', '6'], hint: 'Có 5 cánh tay của sao biển, bé cùng đếm nhé.' },
    { count: 4, itemEmoji: '🐥', itemName: 'chú gà con', options: ['4', '3', '5'], hint: 'Những chú gà con lông vàng óng xíu.' },
    { count: 6, itemEmoji: '🌸', itemName: 'bông hoa', options: ['6', '5', '7'], hint: 'Khu vườn có 6 bông hoa đang khoe sắc thắm.' },
  ];

  // 2. NGÔI NHÀ CỦA SỐ (Cấu tạo số / Tách - Gộp)
  const NGOI_NHA_SO_QUESTIONS = [
    { roofNumber: 5, left: 2, correctRight: '3', options: ['3', '2', '4'], hint: '5 gồm 2 và mấy nhỉ? Xòe 5 ngón tay, gập 2 ngón lại.' },
    { roofNumber: 4, left: 1, correctRight: '3', options: ['3', '2', '1'], hint: 'Gộp 1 và 3 ta được 4.' },
    { roofNumber: 6, left: 4, correctRight: '2', options: ['2', '3', '1'], hint: '6 gồm 4 và 2.' },
    { roofNumber: 7, left: 5, correctRight: '2', options: ['2', '1', '3'], hint: '7 gồm 5 và 2.' },
  ];

  // 3. AI LỚN HƠN? (So sánh số)
  const AI_LON_HON_QUESTIONS = [
    { num1: 4, num2: 7, correct: '<', hint: '4 ít hơn 7, đầu nhọn hướng về số bé hơn.' },
    { num1: 9, num2: 5, correct: '>', hint: '9 nhiều hơn 5, miệng mở về phía số lớn hơn.' },
    { num1: 6, num2: 6, correct: '=', hint: 'Hai bên đều có 6, bằng nhau.' },
    { num1: 8, num2: 3, correct: '>', hint: '8 lớn hơn 3.' },
    { num1: 2, num2: 8, correct: '<', hint: '2 bé hơn 8.' },
  ];

  // 4. ĐOÀN TÀU SỐ HỌC
  const DOAN_TAU_QUESTIONS = [
    { train: ['1', '2', '?', '4', '5'], missingIdx: 2, correct: '3', options: ['3', '6', '1'], hint: 'Sau số 2 và trước số 4 là số nào?' },
    { train: ['6', '7', '8', '?', '10'], missingIdx: 3, correct: '9', options: ['9', '5', '7'], hint: 'Sau số 8 là số nào nhỉ?' },
    { train: ['?', '2', '3', '4', '5'], missingIdx: 0, correct: '1', options: ['1', '0', '6'], hint: 'Đoàn tàu bắt đầu từ số đầu tiên.' },
  ];

  // 5. KHU VƯỜN PHÉP TÍNH
  const KHU_VUON_QUESTIONS = [
    {
      targetNumber: 5,
      flowers: [
        { eq: '3 + 2', val: 5 },
        { eq: '4 + 1', val: 5 },
        { eq: '1 + 2', val: 3 },
        { eq: '5 + 0', val: 5 },
        { eq: '2 + 2', val: 4 },
      ],
      targetCount: 3,
      hint: 'Tìm các bông hoa có kết quả bằng 5 (ví dụ 3+2, 4+1, 5+0).'
    },
  ];

  // 6. Ô CỬA PHÉP CỘNG
  const O_CUA_CONG_QUESTIONS = [
    { eq: '3 + 2 = ?', tokensA: 3, tokensB: 2, correct: '5', options: ['5', '4', '6'], hint: '3 thêm 2 bằng 5.' },
    { eq: '4 + 3 = ?', tokensA: 4, tokensB: 3, correct: '7', options: ['7', '6', '8'], hint: '4 thêm 3 bằng 7.' },
    { eq: '2 + 6 = ?', tokensA: 2, tokensB: 6, correct: '8', options: ['8', '7', '9'], hint: '2 thêm 6 bằng 8.' },
    { eq: '5 + 4 = ?', tokensA: 5, tokensB: 4, correct: '9', options: ['9', '8', '10'], hint: '5 thêm 4 bằng 9.' },
  ];

  // 7. THỬ THÁCH PHÉP TRỪ
  const THU_THACH_TRU_QUESTIONS = [
    { totalApples: 5, removeApples: 2, eq: '5 - 2 = ?', correct: '3', options: ['3', '2', '4'], hint: 'Có 5 quả táo, bớt đi 2 quả táo thì còn lại mấy quả?' },
    { totalApples: 6, removeApples: 3, eq: '6 - 3 = ?', correct: '3', options: ['3', '2', '4'], hint: '6 bớt 3 còn 3.' },
    { totalApples: 4, removeApples: 1, eq: '4 - 1 = ?', correct: '3', options: ['3', '2', '4'], hint: '4 bớt 1 còn 3.' },
    { totalApples: 7, removeApples: 2, eq: '7 - 2 = ?', correct: '5', options: ['5', '4', '6'], hint: '7 bớt 2 còn 5.' },
  ];

  // 8. NHÀ THÁM HIỂM TOÁN HỌC (Lời văn có hình ảnh)
  const NHA_THAM_HIEM_QUESTIONS = [
    {
      story: 'Bể cá có 3 chú cá vàng xinh xắn. Bé thả thêm vào bể 2 chú cá bảy màu. Hỏi trong bể có tất cả bao nhiêu chú cá?',
      emoji: '🐠 🐠 🐠  +  🐟 🐟',
      mathEq: '3 + 2 = 5 chú cá',
      correct: '5',
      options: ['5 chú cá', '4 chú cá', '6 chú cá'],
      hint: 'Thả thêm nghĩa là làm phép cộng: 3 cộng 2.'
    },
    {
      story: 'Trên đĩa có 6 chiếc bánh quy. Bạn Thỏ đã ăn mất 2 chiếc bánh. Hỏi trên đĩa còn lại bao nhiêu chiếc bánh?',
      emoji: '🍪 🍪 🍪 🍪 🍪 🍪',
      mathEq: '6 - 2 = 4 chiếc bánh',
      correct: '4',
      options: ['4 chiếc bánh', '5 chiếc bánh', '3 chiếc bánh'],
      hint: 'Ăn mất nghĩa là bớt đi, làm phép tính trừ: 6 trừ 2.'
    },
  ];

  const handleMultipleChoice = (chosen: string, correct: string, totalQ: number, title: string) => {
    setSelectedAnswer(chosen);
    setIsAnswered(true);

    if (chosen === correct || chosen.startsWith(correct)) {
      soundService.playCorrect();
      setIsCorrect(true);
      setScore(prev => prev + 1);
    } else {
      soundService.playGentleRetry();
      setIsCorrect(false);
    }
  };

  const handleNext = (totalQ: number, title: string) => {
    if (questionIndex + 1 < totalQ) {
      setQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHint(false);
      setIsCorrect(false);
      setTappedIndices([]);
    } else {
      finishGame(score + (isCorrect ? 1 : 0), totalQ, title);
    }
  };

  // Menu view
  if (!selectedGame) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 rounded-3xl text-white shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔢</span>
              <h2 className="text-xl sm:text-2xl font-black">KHO TRÒ CHƠI TOÁN HỌC KỲ DIỆU</h2>
            </div>
            <p className="text-amber-100 text-sm mt-1">
              8 trò chơi sinh động bám sát GDPT 2018 lớp 1 - Đếm số, so sánh, tách gộp, cộng trừ trực quan
            </p>
          </div>
          <button
            onClick={onBackToHub}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition"
          >
            ← Về Trang Chủ
          </button>
        </div>

        {/* 8 Game Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'be_dem_gioi', title: '1. Bé đếm giỏi', desc: 'Chạm đếm trực quan kèm giọng đọc', icon: '🍎', color: 'from-rose-400 to-red-500' },
            { id: 'ngoi_nha_so', title: '2. Ngôi nhà của số', desc: 'Cấu tạo số, tách và gộp số', icon: '🏠', color: 'from-amber-400 to-yellow-500' },
            { id: 'ai_lon_hon', title: '3. Ai lớn hơn?', desc: 'So sánh số với dấu <, >, =', icon: '⚖️', color: 'from-emerald-400 to-teal-500' },
            { id: 'doan_tau', title: '4. Đoàn tàu số học', desc: 'Điền số còn thiếu vào toa tàu', icon: '🚂', color: 'from-cyan-400 to-blue-500' },
            { id: 'khu_vuon', title: '5. Khu vườn phép tính', desc: 'Thu hoạch phép tính có kết quả đúng', icon: '🌻', color: 'from-lime-400 to-emerald-500' },
            { id: 'o_cua_cong', title: '6. Ô cửa phép cộng', desc: 'Cộng trực quan với đồ vật', icon: '➕', color: 'from-blue-400 to-indigo-500' },
            { id: 'thu_thach_tru', title: '7. Thử thách phép trừ', desc: 'Bớt đồ vật và tính số còn lại', icon: '➖', color: 'from-purple-400 to-pink-500' },
            { id: 'nha_tham_hiem', title: '8. Nhà thám hiểm Toán', desc: 'Giải toán qua tranh truyện sinh động', icon: '🧭', color: 'from-orange-400 to-amber-600' },
          ].map(game => (
            <div
              key={game.id}
              onClick={() => handleSelectGame(game.id as MathGameType)}
              className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border-2 border-slate-100 hover:border-amber-300 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform mb-3`}>
                  {game.icon}
                </div>
                <h3 className="font-extrabold text-slate-800 text-base group-hover:text-amber-700 transition">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{game.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
                <span>Chơi ngay</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Finished Screen
  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg text-center max-w-lg mx-auto border-4 border-amber-300">
        <div className="text-6xl animate-bounce mb-3">🌟</div>
        <h3 className="text-2xl font-black text-amber-800">BÉ THẬT XUẤT SẮC!</h3>
        <p className="text-slate-600 mt-2 text-sm">
          Bé đã chinh phục được các thử thách Toán học kỳ diệu hôm nay!
        </p>

        <div className="bg-amber-50 rounded-2xl p-4 my-6 flex items-center justify-around border-2 border-amber-200">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Điểm số</div>
            <div className="text-3xl font-black text-amber-700">{score}</div>
          </div>
          <div className="w-px h-10 bg-amber-200"></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Cây tiến bộ</div>
            <div className="text-base font-bold text-emerald-700 flex items-center gap-1">
              <span>+1 Lá & Hoa</span> 🌸
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleSelectGame(selectedGame)}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-extrabold shadow-md transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Chơi lại
          </button>
          <button
            onClick={() => setSelectedGame(null)}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-extrabold transition"
          >
            Chọn trò chơi khác
          </button>
        </div>
      </div>
    );
  }

  // 1. BÉ ĐẾM GIỎI
  if (selectedGame === 'be_dem_gioi') {
    const q = BE_DEM_GIOI_QUESTIONS[questionIndex];

    const handleTapItem = (idx: number) => {
      soundService.playPop();
      if (!tappedIndices.includes(idx)) {
        const next = [...tappedIndices, idx];
        setTappedIndices(next);
        soundService.speakVietnamese(`${next.length}`);
      }
    };

    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-amber-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍎</span>
            <span className="font-black text-slate-800">Trò 1: Bé đếm giỏi</span>
          </div>
          <span className="bg-rose-100 text-rose-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {BE_DEM_GIOI_QUESTIONS.length}
          </span>
        </div>

        <p className="text-slate-700 font-bold mb-4">
          Bé hãy chạm vào từng {q.itemName} để đếm, rồi chọn số lượng tương ứng:
        </p>

        {/* Interactive Tap-to-count items */}
        <div className="flex flex-wrap items-center justify-center gap-4 my-8 p-6 bg-amber-50/60 rounded-3xl border-2 border-dashed border-amber-300">
          {Array.from({ length: q.count }).map((_, idx) => {
            const isTapped = tappedIndices.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleTapItem(idx)}
                className={`relative w-20 h-20 text-4xl sm:text-5xl rounded-2xl flex items-center justify-center transition transform active:scale-90 ${
                  isTapped
                    ? 'bg-amber-200 border-4 border-amber-500 scale-105 shadow-md'
                    : 'bg-white border-2 border-slate-200 hover:border-amber-400 shadow-sm'
                }`}
              >
                {q.itemEmoji}
                {isTapped && (
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 text-white rounded-full text-xs font-black flex items-center justify-center shadow">
                    {tappedIndices.indexOf(idx) + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3 my-6 max-w-sm mx-auto">
          {q.options.map(opt => (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleMultipleChoice(opt, q.count.toString(), BE_DEM_GIOI_QUESTIONS.length, 'Bé đếm giỏi')}
              className={`py-4 text-3xl font-black rounded-2xl border-4 transition ${
                selectedAnswer === opt
                  ? opt === q.count.toString()
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-400 text-slate-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => {
              setShowHint(!showHint);
              soundService.playPop();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
          >
            <Lightbulb className="w-3.5 h-3.5" /> Gợi ý
          </button>
          {isAnswered && (
            <button
              onClick={() => handleNext(BE_DEM_GIOI_QUESTIONS.length, 'Bé đếm giỏi')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {showHint && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl text-left">
            🌱 {q.hint}
          </div>
        )}
      </div>
    );
  }

  // 2. NGÔI NHÀ CỦA SỐ
  if (selectedGame === 'ngoi_nha_so') {
    const q = NGOI_NHA_SO_QUESTIONS[questionIndex];
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-amber-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-black text-slate-800">Trò 2: Ngôi nhà của số</span>
          </div>
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {NGOI_NHA_SO_QUESTIONS.length}
          </span>
        </div>

        <p className="text-slate-700 font-bold mb-4">
          Số trên mái nhà gồm hai số ở hai phòng. Bé hãy tìm số còn thiếu trong phòng có dấu hỏi (?):
        </p>

        {/* House Graphic */}
        <div className="w-56 mx-auto my-6">
          {/* Roof */}
          <div className="w-0 h-0 border-l-[112px] border-l-transparent border-r-[112px] border-r-transparent border-b-[90px] border-b-amber-500 relative flex items-center justify-center">
            <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-4xl font-black text-white">
              {q.roofNumber}
            </span>
          </div>
          {/* 2 Rooms */}
          <div className="grid grid-cols-2 bg-amber-100 border-4 border-amber-500 rounded-b-2xl p-4 gap-3 shadow-inner">
            <div className="bg-white rounded-xl p-3 border-2 border-amber-300">
              <span className="text-xs font-bold text-slate-500 block">Phòng 1</span>
              <span className="text-3xl font-black text-indigo-700">{q.left}</span>
            </div>
            <div className="bg-white rounded-xl p-3 border-2 border-dashed border-amber-400 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-500 block">Phòng 2</span>
              <span className="text-3xl font-black text-rose-600">
                {isAnswered && isCorrect ? q.correctRight : '?'}
              </span>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3 my-6 max-w-xs mx-auto">
          {q.options.map(opt => (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleMultipleChoice(opt, q.correctRight, NGOI_NHA_SO_QUESTIONS.length, 'Ngôi nhà của số')}
              className={`py-3.5 text-2xl font-black rounded-2xl border-4 transition ${
                selectedAnswer === opt
                  ? opt === q.correctRight
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-400 text-slate-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => {
              setShowHint(!showHint);
              soundService.playPop();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
          >
            <Lightbulb className="w-3.5 h-3.5" /> Gợi ý
          </button>
          {isAnswered && (
            <button
              onClick={() => handleNext(NGOI_NHA_SO_QUESTIONS.length, 'Ngôi nhà của số')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. AI LỚN HƠN?
  if (selectedGame === 'ai_lon_hon') {
    const q = AI_LON_HON_QUESTIONS[questionIndex];
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-amber-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <span className="font-black text-slate-800">Trò 3: Ai lớn hơn?</span>
          </div>
          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {AI_LON_HON_QUESTIONS.length}
          </span>
        </div>

        <p className="text-slate-700 font-bold mb-6">
          Điền dấu thích hợp (<span className="text-emerald-700 font-black">&lt;</span>, <span className="text-emerald-700 font-black">&gt;</span>, <span className="text-emerald-700 font-black">=</span>) vào ô trống giữa hai số:
        </p>

        {/* Comparison Display */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 my-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 border-4 border-indigo-300 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-black text-indigo-700 shadow-sm">
            {q.num1}
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 border-4 border-dashed border-amber-400 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-amber-800">
            {selectedAnswer || '?'}
          </div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-rose-50 border-4 border-rose-300 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl font-black text-rose-700 shadow-sm">
            {q.num2}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3 my-6 max-w-xs mx-auto">
          {['<', '=', '>'].map(sym => (
            <button
              key={sym}
              disabled={isAnswered}
              onClick={() => handleMultipleChoice(sym, q.correct, AI_LON_HON_QUESTIONS.length, 'Ai lớn hơn?')}
              className={`py-4 text-3xl font-black rounded-2xl border-4 transition ${
                selectedAnswer === sym
                  ? sym === q.correct
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-400 text-slate-800'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => {
              setShowHint(!showHint);
              soundService.playPop();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
          >
            <Lightbulb className="w-3.5 h-3.5" /> Gợi ý
          </button>
          {isAnswered && (
            <button
              onClick={() => handleNext(AI_LON_HON_QUESTIONS.length, 'Ai lớn hơn?')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 4. ĐOÀN TÀU SỐ HỌC
  if (selectedGame === 'doan_tau') {
    const q = DOAN_TAU_QUESTIONS[questionIndex];
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-amber-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚂</span>
            <span className="font-black text-slate-800">Trò 4: Đoàn tàu số học</span>
          </div>
          <span className="bg-cyan-100 text-cyan-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {DOAN_TAU_QUESTIONS.length}
          </span>
        </div>

        <p className="text-slate-700 font-bold mb-4">
          Bé hãy tìm số thích hợp để đưa vào toa tàu còn trống (?):
        </p>

        {/* Train Carriages Graphic */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-6">
          <div className="text-4xl">🚂</div>
          {q.train.map((car, idx) => (
            <div
              key={idx}
              className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-4 flex flex-col items-center justify-center shadow-sm ${
                car === '?'
                  ? 'bg-amber-100 border-dashed border-amber-400 text-amber-900 font-black text-2xl'
                  : 'bg-cyan-100 border-cyan-400 text-cyan-900 font-black text-2xl sm:text-3xl'
              }`}
            >
              <span>{car === '?' && isAnswered && isCorrect ? q.correct : car}</span>
              <div className="flex gap-1 mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3 my-6 max-w-xs mx-auto">
          {q.options.map(opt => (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleMultipleChoice(opt, q.correct, DOAN_TAU_QUESTIONS.length, 'Đoàn tàu số học')}
              className={`py-3.5 text-2xl font-black rounded-2xl border-4 transition ${
                selectedAnswer === opt
                  ? opt === q.correct
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-slate-50 hover:bg-cyan-50 border-slate-200 hover:border-cyan-400 text-slate-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => {
              setShowHint(!showHint);
              soundService.playPop();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
          >
            <Lightbulb className="w-3.5 h-3.5" /> Gợi ý
          </button>
          {isAnswered && (
            <button
              onClick={() => handleNext(DOAN_TAU_QUESTIONS.length, 'Đoàn tàu số học')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 5. KHU VƯỜN PHÉP TÍNH
  if (selectedGame === 'khu_vuon') {
    const q = KHU_VUON_QUESTIONS[0];

    const handleFlowerClick = (eq: string, val: number) => {
      soundService.playPop();
      if (val === q.targetNumber) {
        if (!selectedGardenEquations.includes(eq)) {
          soundService.playCorrect();
          const next = [...selectedGardenEquations, eq];
          setSelectedGardenEquations(next);
          if (next.length === q.targetCount) {
            fireCelebration();
            setScore(prev => prev + 1);
            setIsAnswered(true);
          }
        }
      } else {
        soundService.playGentleRetry();
      }
    };

    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-amber-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌻</span>
            <span className="font-black text-slate-800">Trò 5: Khu vườn phép tính</span>
          </div>
          <span className="bg-lime-100 text-lime-900 text-xs font-bold px-3 py-1 rounded-full">
            Mục tiêu: Bằng {q.targetNumber}
          </span>
        </div>

        <p className="text-slate-700 font-bold mb-4">
          Bé hãy chạm vào tất cả các bông hoa có kết quả bằng <span className="text-emerald-700 text-2xl font-black">{q.targetNumber}</span>:
        </p>

        {/* Garden Flowers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
          {q.flowers.map((fl, idx) => {
            const isPicked = selectedGardenEquations.includes(fl.eq);
            return (
              <button
                key={idx}
                onClick={() => handleFlowerClick(fl.eq, fl.val)}
                className={`p-4 rounded-3xl border-4 transition transform active:scale-95 flex flex-col items-center justify-center gap-2 ${
                  isPicked
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-105'
                    : 'bg-lime-50 hover:bg-emerald-50 border-lime-300 hover:border-emerald-400 text-slate-800'
                }`}
              >
                <span className="text-3xl">🌸</span>
                <span className="text-xl font-black">{fl.eq}</span>
              </button>
            );
          })}
        </div>

        {selectedGardenEquations.length === q.targetCount && (
          <div className="bg-emerald-100 border border-emerald-300 p-4 rounded-2xl text-emerald-900 font-bold mb-4 animate-fade-in">
            🎉 Tuyệt vời! Bé đã thu hoạch đủ các bông hoa có kết quả bằng {q.targetNumber}!
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setSelectedGame(null)}
            className="text-xs font-bold text-slate-500 hover:text-slate-700"
          >
            ← Đổi trò chơi
          </button>
          {isAnswered && (
            <button
              onClick={() => finishGame(score + 1, 1, 'Khu vườn phép tính')}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black shadow-md text-sm"
            >
              Hoàn thành trò chơi 🎉
            </button>
          )}
        </div>
      </div>
    );
  }

  // 6. Ô CỬA PHÉP CỘNG
  if (selectedGame === 'o_cua_cong') {
    const q = O_CUA_CONG_QUESTIONS[questionIndex];
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-amber-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">➕</span>
            <span className="font-black text-slate-800">Trò 6: Ô cửa phép cộng</span>
          </div>
          <span className="bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {O_CUA_CONG_QUESTIONS.length}
          </span>
        </div>

        <div className="my-6">
          <div className="flex items-center justify-center gap-4 text-2xl font-black text-slate-700 mb-4">
            <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-2xl flex gap-1">
              {Array.from({ length: q.tokensA }).map((_, i) => (
                <span key={i} className="text-2xl">⭐</span>
              ))}
            </div>
            <span>+</span>
            <div className="p-3 bg-amber-50 border-2 border-amber-200 rounded-2xl flex gap-1">
              {Array.from({ length: q.tokensB }).map((_, i) => (
                <span key={i} className="text-2xl">⭐️</span>
              ))}
            </div>
            <span>=</span>
            <span className="text-3xl text-rose-600">?</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{q.eq}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3 my-6 max-w-xs mx-auto">
          {q.options.map(opt => (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleMultipleChoice(opt, q.correct, O_CUA_CONG_QUESTIONS.length, 'Ô cửa phép cộng')}
              className={`py-3.5 text-2xl font-black rounded-2xl border-4 transition ${
                selectedAnswer === opt
                  ? opt === q.correct
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-400 text-slate-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => {
              setShowHint(!showHint);
              soundService.playPop();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
          >
            <Lightbulb className="w-3.5 h-3.5" /> Gợi ý
          </button>
          {isAnswered && (
            <button
              onClick={() => handleNext(O_CUA_CONG_QUESTIONS.length, 'Ô cửa phép cộng')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 7. THỬ THÁCH PHÉP TRỪ
  if (selectedGame === 'thu_thach_tru') {
    const q = THU_THACH_TRU_QUESTIONS[questionIndex];
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-amber-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">➖</span>
            <span className="font-black text-slate-800">Trò 7: Thử thách phép trừ</span>
          </div>
          <span className="bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {THU_THACH_TRU_QUESTIONS.length}
          </span>
        </div>

        <div className="my-6">
          <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
            {Array.from({ length: q.totalApples }).map((_, idx) => {
              const isRemoved = idx >= q.totalApples - q.removeApples;
              return (
                <div
                  key={idx}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-2 relative ${
                    isRemoved
                      ? 'bg-slate-100 border-slate-300 opacity-40'
                      : 'bg-rose-50 border-rose-300 shadow-sm'
                  }`}
                >
                  <span>🍎</span>
                  {isRemoved && (
                    <span className="absolute text-rose-600 text-3xl font-black">✕</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-2xl font-black text-slate-800">{q.eq}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-3 gap-3 my-6 max-w-xs mx-auto">
          {q.options.map(opt => (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleMultipleChoice(opt, q.correct, THU_THACH_TRU_QUESTIONS.length, 'Thử thách phép trừ')}
              className={`py-3.5 text-2xl font-black rounded-2xl border-4 transition ${
                selectedAnswer === opt
                  ? opt === q.correct
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-slate-50 hover:bg-purple-50 border-slate-200 hover:border-purple-400 text-slate-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => {
              setShowHint(!showHint);
              soundService.playPop();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
          >
            <Lightbulb className="w-3.5 h-3.5" /> Gợi ý
          </button>
          {isAnswered && (
            <button
              onClick={() => handleNext(THU_THACH_TRU_QUESTIONS.length, 'Thử thách phép trừ')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 8. NHÀ THÁM HIỂM TOÁN HỌC
  if (selectedGame === 'nha_tham_hiem') {
    const q = NHA_THAM_HIEM_QUESTIONS[questionIndex];
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-amber-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <span className="font-black text-slate-800">Trò 8: Nhà thám hiểm Toán học</span>
          </div>
          <span className="bg-orange-100 text-orange-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {NHA_THAM_HIEM_QUESTIONS.length}
          </span>
        </div>

        <div className="my-4">
          <div className="text-4xl my-2">{q.emoji}</div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-slate-800 text-sm sm:text-base font-bold leading-relaxed text-left">
            📖 {q.story}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
          {q.options.map(opt => (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleMultipleChoice(opt, q.correct, NHA_THAM_HIEM_QUESTIONS.length, 'Nhà thám hiểm Toán học')}
              className={`py-3.5 px-3 text-base font-black rounded-2xl border-4 transition ${
                selectedAnswer === opt
                  ? opt.startsWith(q.correct)
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-slate-50 hover:bg-orange-50 border-slate-200 hover:border-orange-400 text-slate-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => {
              setShowHint(!showHint);
              soundService.playPop();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
          >
            <Lightbulb className="w-3.5 h-3.5" /> Gợi ý
          </button>
          {isAnswered && (
            <button
              onClick={() => handleNext(NHA_THAM_HIEM_QUESTIONS.length, 'Nhà thám hiểm Toán học')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};
