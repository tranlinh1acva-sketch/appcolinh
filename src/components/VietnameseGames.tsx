import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, Lightbulb, HelpCircle, ArrowRight, Award, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';
import { Student } from '../types';

interface VietnameseGamesProps {
  student: Student;
  onGameComplete?: () => void;
  onBackToHub: () => void;
}

type GameType =
  | 'tai_ai_tinh'
  | 'be_tim_chu'
  | 'ghep_van'
  | 'nhin_tranh'
  | 'be_doc_gioi'
  | 'sap_xep_cau'
  | 'o_cua_bi_mat'
  | 'vong_quay';

export const VietnameseGames: React.FC<VietnameseGamesProps> = ({
  student,
  onGameComplete,
  onBackToHub,
}) => {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);

  // Common game state
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Specific state for Sắp xếp câu văn
  const [sentenceTokens, setSentenceTokens] = useState<string[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  // Specific state for Ô cửa bí mật
  const [doorsOpened, setDoorsOpened] = useState<boolean[]>([false, false, false, false]);

  // Specific state for Vòng quay
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelLetter, setWheelLetter] = useState<string | null>(null);

  const resetGameState = () => {
    setScore(0);
    setQuestionIndex(0);
    setHintsUsed(0);
    setShowHint(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsFinished(false);
    setSelectedTokens([]);
    setDoorsOpened([false, false, false, false]);
    setWheelLetter(null);
  };

  const handleSelectGame = (game: GameType) => {
    soundService.playPop();
    setSelectedGame(game);
    resetGameState();

    // Prepare sentence tokens if game is sap_xep_cau
    if (game === 'sap_xep_cau') {
      const q = SENTENCE_QUESTIONS[0];
      setSentenceTokens([...q.tokens].sort(() => Math.random() - 0.5));
    }
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

  // Record completed game attempt
  const finishGame = (finalScore: number, totalQ: number, gameTitle: string) => {
    setIsFinished(true);
    fireCelebration();
    storageService.recordAttempt({
      studentId: student.id,
      subject: 'vietnamese',
      topic: gameTitle,
      score: finalScore,
      total: totalQ,
      hintsUsed,
      level: student.learningLevel,
      timeSpentSeconds: 60,
    });
    if (onGameComplete) onGameComplete();
  };

  // 1. TAI AI TINH DATA
  const TAI_AI_TINH_QUESTIONS = [
    { sound: 'Âm Bờ', speakText: 'Âm bờ', correct: 'b', options: ['b', 'd', 'p', 'q'], hint: 'Chữ cái b có nét cong bên phải phía dưới.' },
    { sound: 'Âm Cờ', speakText: 'Âm cờ', correct: 'c', options: ['c', 'o', 'e', 'a'], hint: 'Chữ cái c có nét cong hở bên phải như vầng trăng khuyết.' },
    { sound: 'Âm Mờ', speakText: 'Âm mờ', correct: 'm', options: ['m', 'n', 'u', 'w'], hint: 'Chữ cái m có hai nét móc xuôi liền nhau.' },
    { sound: 'Vần An', speakText: 'Vần an', correct: 'an', options: ['an', 'at', 'am', 'ang'], hint: 'Ghép âm a và âm n tạo thành an.' },
    { sound: 'Tiếng Cá', speakText: 'Tiếng cá', correct: 'cá', options: ['cá', 'cà', 'cả', 'cạ'], hint: 'Có dấu sắc trên đầu âm a.' },
  ];

  // 2. BÉ TÌM CHỮ DATA
  const BE_TIM_CHU_QUESTIONS = [
    { target: 'a', targetName: 'chữ A', grid: ['a', 'b', 'c', 'o', 'a', 'd', 'e', 'a', 'm'], hint: 'Tìm tất cả các chữ a tròn như quả trứng nhé!' },
    { target: 'e', targetName: 'chữ E', grid: ['e', 'c', 'o', 'e', 'b', 'a', 'e', 'm', 'n'], hint: 'Chữ e có nét gạch ngang và nét cong tròn.' },
    { target: 'b', targetName: 'chữ B', grid: ['b', 'd', 'p', 'q', 'b', 'h', 'k', 'b', 'l'], hint: 'Nhìn kỹ chữ b có nét sổ thẳng đứng bên trái.' },
  ];
  const [foundLetterIndices, setFoundLetterIndices] = useState<number[]>([]);

  // 3. GHÉP VẦN THÔNG MINH DATA
  const GHEP_VAN_QUESTIONS = [
    { onset: 'b', rime: 'a', tone: 'sắc', correct: 'bá', options: ['bá', 'bà', 'bả', 'bạ'], image: '👵', hint: 'b - a - ba - sắc - bá (Bác bá hiền từ).' },
    { onset: 'c', rime: 'a', tone: 'huyền', correct: 'cà', options: ['cà', 'cá', 'cả', 'ca'], image: '🍆', hint: 'Quả cà màu tím giòn ngon.' },
    { onset: 'm', rime: 'e', tone: 'nặng', correct: 'mẹ', options: ['mẹ', 'mè', 'mé', 'mẽ'], image: '👩‍👧', hint: 'Người yêu thương em nhất trần đời.' },
    { onset: 'g', rime: 'à', tone: 'không', correct: 'gà', options: ['gà', 'vịt', 'ngỗng', 'cá'], image: '🐓', hint: 'Chú gà gáy ò ó o gọi bé dậy.' },
    { onset: 'b', rime: 'an', tone: 'huyền', correct: 'bàn', options: ['bàn', 'bán', 'bạn', 'bản'], image: '🪑', hint: 'Cái bàn học xinh xắn của em.' },
  ];

  // 4. NHÌN TRANH ĐOÁN TỪ DATA
  const NHIN_TRANH_QUESTIONS = [
    { image: '🐟', prompt: 'Bức tranh vẽ con gì đây?', correct: 'con cá', options: ['con cá', 'con tôm', 'con cua', 'con ốc'], hint: 'Loài vật bơi lội tung tăng dưới nước và có vảy.' },
    { image: '🍎', prompt: 'Quả gì màu đỏ ngọt ngào?', correct: 'quả táo', options: ['quả táo', 'quả na', 'quả chuối', 'quả ổi'], hint: 'Quả táo đỏ giòn ngọt của bé.' },
    { image: '🎒', prompt: 'Bé đeo vật gì trên vai đi học?', correct: 'ba lô', options: ['ba lô', 'mũ len', 'áo mưa', 'đôi giày'], hint: 'Đựng sách vở và hộp bút đi học.' },
    { image: '🌞', prompt: 'Vật gì tỏa ánh nắng ấm áp buổi sáng?', correct: 'ông mặt trời', options: ['ông mặt trời', 'mặt trăng', 'ngôi sao', 'đám mây'], hint: 'Bình minh thức giấc mang lại ánh sáng cho vạn vật.' },
  ];

  // 5. BÉ ĐỌC GIỎI DATA
  const BE_DOC_GIOI_QUESTIONS = [
    { text: 'Bé chăm học.', audio: 'Bé chăm học', emoji: '📖', pinyin: 'be - cham - hoc' },
    { text: 'Mẹ yêu bé.', audio: 'Mẹ yêu bé', emoji: '❤️', pinyin: 'me - yeu - be' },
    { text: 'Cây táo có quả đỏ.', audio: 'Cây táo có quả đỏ', emoji: '🌳🍎', pinyin: 'cay - tao - co - qua - do' },
    { text: 'Bé vẽ hoa sen.', audio: 'Bé vẽ hoa sen', emoji: '🌸', pinyin: 'be - ve - hoa - sen' },
  ];

  // 6. SẮP XẾP CÂU VĂN DATA
  const SENTENCE_QUESTIONS = [
    { tokens: ['Bé', 'chăm', 'học.'], correctSentence: 'Bé chăm học.', emoji: '🌟', hint: 'Từ bắt đầu viết hoa là "Bé", kết thúc bằng dấu chấm.' },
    { tokens: ['Mẹ', 'đi', 'chợ.'], correctSentence: 'Mẹ đi chợ.', emoji: '🧺', hint: 'Ai đi chợ nhỉ? Bắt đầu bằng từ "Mẹ".' },
    { tokens: ['Bầu', 'trời', 'xanh', 'ngắt.'], correctSentence: 'Bầu trời xanh ngắt.', emoji: '⛅', hint: 'Bầu trời màu gì?' },
  ];

  // 7. Ô CỬA BÍ MẬT DATA
  const O_CUA_QUESTIONS = [
    { door: 1, q: 'Chữ cái đầu của tiếng "mẹ" là chữ gì?', correct: 'm', options: ['m', 'n', 'b'] },
    { door: 2, q: 'Tiếng "cá" có thanh điệu gì?', correct: 'dấu sắc', options: ['dấu sắc', 'dấu huyền', 'dấu ngã'] },
    { door: 3, q: 'Ghép vần "a" với "n" được vần gì?', correct: 'an', options: ['an', 'at', 'am'] },
    { door: 4, q: 'Số chân của con gà là mấy?', correct: '2', options: ['2', '4', '6'] },
  ];

  // 8. VÒNG QUAY CHỮ CÁI
  const WHEEL_LETTERS = ['A', 'B', 'C', 'D', 'Đ', 'E', 'G', 'H', 'I', 'K', 'L', 'M'];

  // Handle standard multiple choice answer
  const handleAnswer = (option: string, correct: string, total: number, title: string) => {
    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === correct) {
      soundService.playCorrect();
      setIsCorrect(true);
      setScore(prev => prev + 1);
    } else {
      soundService.playGentleRetry();
      setIsCorrect(false);
    }
  };

  const handleNextQuestion = (total: number, title: string) => {
    if (questionIndex + 1 < total) {
      setQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHint(false);
      setIsCorrect(false);
    } else {
      finishGame(score + (isCorrect ? 1 : 0), total, title);
    }
  };

  // Render game selection menu
  if (!selectedGame) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-500 to-emerald-600 p-5 rounded-3xl text-white shadow-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h2 className="text-xl sm:text-2xl font-black">KHO TRÒ CHƠI TIẾNG VIỆT VUI</h2>
            </div>
            <p className="text-emerald-100 text-sm mt-1">
              8 trò chơi sinh động bám sát GDPT 2018 lớp 1 - Đánh giá nhận biết âm, vần, tiếng, đọc câu
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
            { id: 'tai_ai_tinh', title: '1. Tai ai tinh?', desc: 'Nghe âm thanh và chọn chữ đúng', icon: '👂', color: 'from-amber-400 to-orange-400' },
            { id: 'be_tim_chu', title: '2. Bé tìm chữ', desc: 'Quan sát và nhận diện mặt chữ', icon: '🔍', color: 'from-emerald-400 to-teal-500' },
            { id: 'ghep_van', title: '3. Ghép vần thông minh', desc: 'Ghép âm và vần tạo thành tiếng', icon: '🧩', color: 'from-blue-400 to-indigo-500' },
            { id: 'nhin_tranh', title: '4. Nhìn tranh đoán từ', desc: 'Chọn từ tương ứng hình ảnh', icon: '🖼️', color: 'from-purple-400 to-pink-500' },
            { id: 'be_doc_gioi', title: '5. Bé đọc giỏi', desc: 'Luyện đọc từ và câu ngắn', icon: '🗣️', color: 'from-rose-400 to-red-500' },
            { id: 'sap_xep_cau', title: '6. Sắp xếp câu văn', desc: 'Ghép từ thành câu có nghĩa', icon: '📝', color: 'from-cyan-400 to-blue-500' },
            { id: 'o_cua_bi_mat', title: '7. Ô cửa bí mật', desc: 'Mở từng ô cửa khám phá bất ngờ', icon: '🚪', color: 'from-amber-500 to-yellow-500' },
            { id: 'vong_quay', title: '8. Vòng quay chữ cái', desc: 'Quay vòng và thực hiện thử thách', icon: '🎡', color: 'from-fuchsia-400 to-purple-600' },
          ].map(game => (
            <div
              key={game.id}
              onClick={() => handleSelectGame(game.id as GameType)}
              className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border-2 border-slate-100 hover:border-emerald-300 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform mb-3`}>
                  {game.icon}
                </div>
                <h3 className="font-extrabold text-slate-800 text-base group-hover:text-emerald-700 transition">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{game.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
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
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg text-center max-w-lg mx-auto border-4 border-emerald-300">
        <div className="text-6xl animate-bounce mb-3">🎉</div>
        <h3 className="text-2xl font-black text-emerald-800">BÉ GIỎI LẮM!</h3>
        <p className="text-slate-600 mt-2 text-sm">
          Bé đã hoàn thành xuất sắc trò chơi và giúp Mầm Xanh có thêm năng lượng để lớn khôn!
        </p>

        <div className="bg-emerald-50 rounded-2xl p-4 my-6 flex items-center justify-around border-2 border-emerald-200">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Điểm số</div>
            <div className="text-3xl font-black text-emerald-700">{score}</div>
          </div>
          <div className="w-px h-10 bg-emerald-200"></div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase">Cây tiến bộ</div>
            <div className="text-base font-bold text-emerald-700 flex items-center gap-1">
              <span>+1 Lá xanh</span> 🌱
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleSelectGame(selectedGame)}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold shadow-md transition flex items-center justify-center gap-2"
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

  // 1. TAI AI TINH
  if (selectedGame === 'tai_ai_tinh') {
    const q = TAI_AI_TINH_QUESTIONS[questionIndex];
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👂</span>
            <span className="font-black text-slate-800">Trò 1: Tai ai tinh?</span>
          </div>
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {TAI_AI_TINH_QUESTIONS.length}
          </span>
        </div>

        <div className="text-center my-6">
          <p className="text-base text-slate-700 font-bold mb-4">
            Bấm chiếc loa để nghe âm, sau đó chọn chữ cái tương ứng:
          </p>
          <button
            onClick={() => {
              soundService.playPop();
              soundService.speakVietnamese(q.speakText);
            }}
            className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-400 text-white rounded-full mx-auto flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
          >
            <Volume2 className="w-10 h-10 animate-pulse" />
            <span className="text-xs font-black mt-1">Nghe âm</span>
          </button>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 my-6">
          {q.options.map((opt) => (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleAnswer(opt, q.correct, TAI_AI_TINH_QUESTIONS.length, 'Tai ai tinh')}
              className={`py-4 sm:py-6 text-3xl sm:text-4xl font-black rounded-2xl border-4 transition ${
                selectedAnswer === opt
                  ? opt === q.correct
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-800'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Hint button */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => {
              setShowHint(!showHint);
              setHintsUsed(prev => prev + 1);
              soundService.playPop();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200"
          >
            <Lightbulb className="w-3.5 h-3.5" /> Gợi ý của Mầm Xanh
          </button>
          {isAnswered && (
            <button
              onClick={() => handleNextQuestion(TAI_AI_TINH_QUESTIONS.length, 'Tai ai tinh')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {showHint && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-start gap-2">
            <span>🌱</span>
            <span>{q.hint}</span>
          </div>
        )}
      </div>
    );
  }

  // 2. BÉ TÌM CHỮ
  if (selectedGame === 'be_tim_chu') {
    const q = BE_TIM_CHU_QUESTIONS[questionIndex];
    const totalTargets = q.grid.filter(c => c === q.target).length;

    const handleCellClick = (char: string, index: number) => {
      if (foundLetterIndices.includes(index)) return;
      if (char === q.target) {
        soundService.playCorrect();
        const next = [...foundLetterIndices, index];
        setFoundLetterIndices(next);
        if (next.length === totalTargets) {
          fireCelebration();
          setScore(prev => prev + 1);
        }
      } else {
        soundService.playGentleRetry();
      }
    };

    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <span className="font-black text-slate-800">Trò 2: Bé tìm chữ</span>
          </div>
          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">
            Màn {questionIndex + 1} / {BE_TIM_CHU_QUESTIONS.length}
          </span>
        </div>

        <p className="text-base text-slate-700 font-bold mb-2">
          Bé hãy tìm và chạm vào tất cả <span className="text-emerald-700 text-2xl font-black underline">{q.targetName}</span> trong ô chữ:
        </p>
        <p className="text-xs text-slate-500 mb-6">
          Đã tìm được: {foundLetterIndices.length} / {totalTargets}
        </p>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xs mx-auto mb-6">
          {q.grid.map((char, idx) => {
            const isFound = foundLetterIndices.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(char, idx)}
                className={`w-20 h-20 text-3xl font-black rounded-2xl border-4 transition transform active:scale-90 ${
                  isFound
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-inner scale-95'
                    : 'bg-amber-50 hover:bg-emerald-50 border-amber-200 hover:border-emerald-400 text-slate-800 shadow-sm'
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>

        {foundLetterIndices.length === totalTargets && (
          <div className="bg-emerald-100 border border-emerald-300 p-4 rounded-2xl text-emerald-900 font-bold mb-4 animate-fade-in">
            🎉 Hoan hô bé! Bé đã tìm đủ tất cả {q.targetName}!
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() => setSelectedGame(null)}
            className="text-xs font-bold text-slate-500 hover:text-slate-700"
          >
            ← Đổi trò chơi
          </button>
          {foundLetterIndices.length === totalTargets && (
            <button
              onClick={() => {
                if (questionIndex + 1 < BE_TIM_CHU_QUESTIONS.length) {
                  setQuestionIndex(prev => prev + 1);
                  setFoundLetterIndices([]);
                } else {
                  finishGame(score + 1, BE_TIM_CHU_QUESTIONS.length, 'Bé tìm chữ');
                }
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Màn tiếp theo <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. GHÉP VẦN THÔNG MINH
  if (selectedGame === 'ghep_van') {
    const q = GHEP_VAN_QUESTIONS[questionIndex];
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧩</span>
            <span className="font-black text-slate-800">Trò 3: Ghép vần thông minh</span>
          </div>
          <span className="bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {GHEP_VAN_QUESTIONS.length}
          </span>
        </div>

        <div className="my-4">
          <div className="text-5xl my-2">{q.image}</div>
          <p className="text-slate-600 text-sm font-semibold">
            Ghép âm đầu <span className="text-rose-600 font-black text-xl">"{q.onset}"</span> + vần <span className="text-indigo-600 font-black text-xl">"{q.rime}"</span> + dấu <span className="text-amber-600 font-black text-lg">"{q.tone}"</span> được tiếng gì?
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          {q.options.map(opt => (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleAnswer(opt, q.correct, GHEP_VAN_QUESTIONS.length, 'Ghép vần thông minh')}
              className={`py-4 text-2xl font-black rounded-2xl border-4 transition ${
                selectedAnswer === opt
                  ? opt === q.correct
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-400 text-slate-800'
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
              onClick={() => handleNextQuestion(GHEP_VAN_QUESTIONS.length, 'Ghép vần thông minh')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
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

  // 4. NHÌN TRANH ĐOÁN TỪ
  if (selectedGame === 'nhin_tranh') {
    const q = NHIN_TRANH_QUESTIONS[questionIndex];
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🖼️</span>
            <span className="font-black text-slate-800">Trò 4: Nhìn tranh đoán từ</span>
          </div>
          <span className="bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {NHIN_TRANH_QUESTIONS.length}
          </span>
        </div>

        <div className="my-4">
          <div className="w-28 h-28 mx-auto rounded-3xl bg-amber-50 border-4 border-amber-200 flex items-center justify-center text-6xl shadow-sm mb-3">
            {q.image}
          </div>
          <p className="text-slate-800 font-extrabold text-base">{q.prompt}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 my-6">
          {q.options.map(opt => (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleAnswer(opt, q.correct, NHIN_TRANH_QUESTIONS.length, 'Nhìn tranh đoán từ')}
              className={`py-3.5 px-3 text-lg font-black rounded-2xl border-4 transition ${
                selectedAnswer === opt
                  ? opt === q.correct
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-slate-50 hover:bg-purple-50 border-slate-200 hover:border-purple-300 text-slate-800'
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
              onClick={() => handleNextQuestion(NHIN_TRANH_QUESTIONS.length, 'Nhìn tranh đoán từ')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Tiếp tục <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // 5. BÉ ĐỌC GIỎI
  if (selectedGame === 'be_doc_gioi') {
    const q = BE_DOC_GIOI_QUESTIONS[questionIndex];
    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗣️</span>
            <span className="font-black text-slate-800">Trò 5: Bé đọc giỏi</span>
          </div>
          <span className="bg-rose-100 text-rose-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {BE_DOC_GIOI_QUESTIONS.length}
          </span>
        </div>

        <div className="my-6">
          <div className="text-5xl mb-4">{q.emoji}</div>
          <div className="bg-amber-50 border-4 border-amber-200 rounded-3xl p-6 shadow-sm">
            <h4 className="text-3xl sm:text-4xl font-black text-emerald-900 tracking-wide">
              {q.text}
            </h4>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 my-6">
          <button
            onClick={() => {
              soundService.playPop();
              soundService.speakVietnamese(q.audio);
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-md flex items-center justify-center gap-2 text-base transition"
          >
            <Volume2 className="w-5 h-5" /> Nghe cô đọc mẫu
          </button>
          <button
            onClick={() => {
              soundService.playCorrect();
              fireCelebration();
              setScore(prev => prev + 1);
              setIsAnswered(true);
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black shadow-md flex items-center justify-center gap-2 text-base transition"
          >
            ⭐ Con đã đọc xong rồi!
          </button>
        </div>

        {isAnswered && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                if (questionIndex + 1 < BE_DOC_GIOI_QUESTIONS.length) {
                  setQuestionIndex(prev => prev + 1);
                  setIsAnswered(false);
                } else {
                  finishGame(score + 1, BE_DOC_GIOI_QUESTIONS.length, 'Bé đọc giỏi');
                }
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Câu tiếp theo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // 6. SẮP XẾP CÂU VĂN
  if (selectedGame === 'sap_xep_cau') {
    const q = SENTENCE_QUESTIONS[questionIndex];

    const handleSelectToken = (token: string) => {
      soundService.playPop();
      setSelectedTokens(prev => [...prev, token]);
      setSentenceTokens(prev => {
        const idx = prev.indexOf(token);
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
    };

    const handleRemoveToken = (token: string) => {
      soundService.playPop();
      setSentenceTokens(prev => [...prev, token]);
      setSelectedTokens(prev => {
        const idx = prev.indexOf(token);
        return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      });
    };

    const handleCheckSentence = () => {
      const built = selectedTokens.join(' ');
      if (built === q.correctSentence) {
        soundService.playCorrect();
        setIsCorrect(true);
        setIsAnswered(true);
        setScore(prev => prev + 1);
      } else {
        soundService.playGentleRetry();
        setIsCorrect(false);
      }
    };

    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <span className="font-black text-slate-800">Trò 6: Sắp xếp câu văn</span>
          </div>
          <span className="bg-cyan-100 text-cyan-900 text-xs font-bold px-3 py-1 rounded-full">
            Câu {questionIndex + 1} / {SENTENCE_QUESTIONS.length}
          </span>
        </div>

        <p className="text-slate-700 font-bold mb-4">
          Bé hãy chạm vào các từ bên dưới theo đúng thứ tự để tạo thành câu hoàn chỉnh:
        </p>

        {/* Selected Tokens Droppable Area */}
        <div className="min-h-16 bg-slate-50 border-2 border-dashed border-cyan-300 rounded-2xl p-3 flex flex-wrap items-center justify-center gap-2 mb-6">
          {selectedTokens.length === 0 ? (
            <span className="text-xs text-slate-400 italic">Chạm vào từ ở dưới để xếp vào đây</span>
          ) : (
            selectedTokens.map((t, idx) => (
              <button
                key={idx}
                onClick={() => handleRemoveToken(t)}
                className="px-4 py-2 bg-cyan-600 text-white font-extrabold rounded-xl shadow-sm text-base hover:bg-rose-500 transition"
              >
                {t}
              </button>
            ))
          )}
        </div>

        {/* Available Tokens */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-6">
          {sentenceTokens.map((t, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectToken(t)}
              className="px-5 py-2.5 bg-white border-2 border-slate-300 hover:border-cyan-500 font-black rounded-xl text-base text-slate-800 shadow-sm active:scale-95 transition"
            >
              {t}
            </button>
          ))}
        </div>

        {sentenceTokens.length === 0 && !isAnswered && (
          <button
            onClick={handleCheckSentence}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md text-sm transition"
          >
            Kiểm tra đáp án
          </button>
        )}

        {isAnswered && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                if (questionIndex + 1 < SENTENCE_QUESTIONS.length) {
                  const nextIdx = questionIndex + 1;
                  setQuestionIndex(nextIdx);
                  const nextQ = SENTENCE_QUESTIONS[nextIdx];
                  setSentenceTokens([...nextQ.tokens].sort(() => Math.random() - 0.5));
                  setSelectedTokens([]);
                  setIsAnswered(false);
                } else {
                  finishGame(score + 1, SENTENCE_QUESTIONS.length, 'Sắp xếp câu văn');
                }
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md flex items-center gap-2 text-sm"
            >
              Câu tiếp theo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // 7. Ô CỬA BÍ MẬT
  if (selectedGame === 'o_cua_bi_mat') {
    const allOpened = doorsOpened.every(Boolean);

    const handleDoorAnswer = (doorIndex: number, chosen: string, correct: string) => {
      if (chosen === correct) {
        soundService.playCorrect();
        const next = [...doorsOpened];
        next[doorIndex] = true;
        setDoorsOpened(next);
        setScore(prev => prev + 1);
        if (next.every(Boolean)) {
          fireCelebration();
        }
      } else {
        soundService.playGentleRetry();
      }
    };

    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚪</span>
            <span className="font-black text-slate-800">Trò 7: Ô cửa bí mật</span>
          </div>
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
            Đã mở {doorsOpened.filter(Boolean).length} / 4 ô
          </span>
        </div>

        <p className="text-slate-700 font-bold mb-4">
          Trả lời đúng câu hỏi của từng ô cửa để mở ra bức tranh bí mật phía sau:
        </p>

        {/* 4 Doors Grid with background image revealed underneath */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-3xl overflow-hidden border-4 border-amber-300 shadow-md mb-6">
          {/* Mystery Picture Underneath */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-amber-100 flex flex-col items-center justify-center p-4">
            <span className="text-7xl">🐱📚✨</span>
            <span className="text-sm font-black text-emerald-800 mt-2">Mèo con chăm ngoan!</span>
          </div>

          {/* 4 Interactive Door Quadrants */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {O_CUA_QUESTIONS.map((item, idx) => (
              <div
                key={idx}
                className={`border border-white/50 flex flex-col items-center justify-center p-2 transition-all duration-500 ${
                  doorsOpened[idx]
                    ? 'opacity-0 pointer-events-none transform scale-90'
                    : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-inner cursor-pointer hover:bg-orange-600'
                }`}
              >
                <span className="text-lg font-black">Cửa {item.door}</span>
                <span className="text-[10px] opacity-90">Bấm để trả lời</span>
              </div>
            ))}
          </div>
        </div>

        {/* Question controls for unopened doors */}
        <div className="space-y-3 text-left">
          {O_CUA_QUESTIONS.map((item, idx) => {
            if (doorsOpened[idx]) return null;
            return (
              <div key={idx} className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
                <div className="text-xs font-bold text-amber-900 mb-1">🚪 Cửa {item.door}: {item.q}</div>
                <div className="flex gap-2 mt-2">
                  {item.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleDoorAnswer(idx, opt, item.correct)}
                      className="px-3 py-1.5 bg-white hover:bg-emerald-100 border border-amber-300 rounded-xl text-xs font-black text-slate-800 transition"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {allOpened && (
          <div className="mt-6">
            <button
              onClick={() => finishGame(score, 4, 'Ô cửa bí mật')}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-md"
            >
              Hoàn thành trò chơi 🎉
            </button>
          </div>
        )}
      </div>
    );
  }

  // 8. VÒNG QUAY CHỮ CÁI
  if (selectedGame === 'vong_quay') {
    const spinWheel = () => {
      if (isSpinning) return;
      setIsSpinning(true);
      soundService.playPop();

      const spins = 5 + Math.floor(Math.random() * 5);
      const randomIdx = Math.floor(Math.random() * WHEEL_LETTERS.length);
      const newDegree = wheelRotation + spins * 360 + (randomIdx * (360 / WHEEL_LETTERS.length));
      setWheelRotation(newDegree);

      setTimeout(() => {
        setIsSpinning(false);
        const selected = WHEEL_LETTERS[randomIdx];
        setWheelLetter(selected);
        soundService.playCorrect();
        soundService.speakVietnamese(`Chữ ${selected}!`);
        setScore(prev => prev + 1);
      }, 3000);
    };

    return (
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-md border-2 border-emerald-200 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎡</span>
            <span className="font-black text-slate-800">Trò 8: Vòng quay chữ cái</span>
          </div>
          <span className="bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full">
            Quay may mắn
          </span>
        </div>

        <p className="text-slate-700 font-bold mb-4">
          Bấm nút "QUAY" để vòng quay xoay tròn và đọc to chữ cái may mắn:
        </p>

        {/* Wheel Graphic */}
        <div className="relative w-64 h-64 mx-auto my-6">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20 text-rose-600 text-3xl font-black">
            ▼
          </div>
          <div
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transition: isSpinning ? 'transform 3s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
            }}
            className="w-full h-full rounded-full border-8 border-amber-400 bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 shadow-xl flex items-center justify-center relative overflow-hidden"
          >
            {WHEEL_LETTERS.map((l, i) => {
              const angle = (i * 360) / WHEEL_LETTERS.length;
              return (
                <div
                  key={l}
                  style={{
                    transform: `rotate(${angle}deg) translateY(-85px)`,
                  }}
                  className="absolute text-xl font-black text-slate-900 select-none"
                >
                  {l}
                </div>
              );
            })}
            <div className="w-16 h-16 bg-white rounded-full border-4 border-amber-400 shadow-md flex items-center justify-center text-xs font-black text-slate-700 z-10">
              MẦM XANH
            </div>
          </div>
        </div>

        <button
          disabled={isSpinning}
          onClick={spinWheel}
          className={`px-8 py-3.5 rounded-2xl font-black text-lg shadow-lg transition ${
            isSpinning
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white active:scale-95'
          }`}
        >
          {isSpinning ? 'Đang quay...' : 'QUAY NGAY 🎡'}
        </button>

        {wheelLetter && (
          <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl max-w-xs mx-auto animate-fade-in">
            <span className="text-xs font-bold text-emerald-800 uppercase">Chữ cái may mắn của bé:</span>
            <div className="text-5xl font-black text-emerald-700 my-2">{wheelLetter}</div>
            <p className="text-xs text-slate-600">Bé hãy tìm 1 đồ vật xung quanh bắt đầu bằng chữ "{wheelLetter}" nhé!</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setSelectedGame(null)}
            className="text-xs font-bold text-slate-500 hover:text-slate-700"
          >
            ← Đổi trò chơi
          </button>
          <button
            onClick={() => finishGame(score + 1, 5, 'Vòng quay chữ cái')}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs"
          >
            Xong lượt quay
          </button>
        </div>
      </div>
    );
  }

  return null;
};
