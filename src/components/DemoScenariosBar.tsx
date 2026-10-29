import React from 'react';
import { Award, ArrowRight, Play, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { ActiveView, DemoScenarioId } from '../types';
import { storageService } from '../services/storageService';
import { soundService } from '../services/soundService';

interface DemoScenariosBarProps {
  currentScenario: DemoScenarioId | null;
  onSelectScenario: (scenario: DemoScenarioId) => void;
  onNavigate: (view: ActiveView) => void;
}

export const DemoScenariosBar: React.FC<DemoScenariosBarProps> = ({
  currentScenario,
  onSelectScenario,
  onNavigate,
}) => {
  const handleLaunchScenario = (sc: DemoScenarioId) => {
    soundService.playPop();
    onSelectScenario(sc);

    if (sc === 'scenario_1_support') {
      storageService.setActiveStudentId('HS01');
      onNavigate('learning_path');
    } else if (sc === 'scenario_2_advance') {
      storageService.setActiveStudentId('HS02');
      onNavigate('learning_path');
    } else if (sc === 'scenario_3_inclusive') {
      storageService.setActiveStudentId('HS15');
      onNavigate('inclusive');
    } else if (sc === 'scenario_4_dashboard') {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-2xl p-3 sm:p-4 shadow-md border-2 border-amber-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Award className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-amber-100">
                Dự thi 2026
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                KỊCH BẢN TRÌNH DIỄN DỰ THI AI 2026
              </h2>
            </div>
            <p className="text-xs text-amber-100/90 hidden sm:block">
              Bấm nhanh từng tình huống để trải nghiệm trọn vẹn luồng thích ứng sư phạm thực tế
            </p>
          </div>
        </div>

        {/* 4 Interactive Scenarios Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Tình huống 1 */}
          <button
            onClick={() => handleLaunchScenario('scenario_1_support')}
            className={`p-2 rounded-xl text-left transition transform active:scale-95 border ${
              currentScenario === 'scenario_1_support'
                ? 'bg-white text-orange-900 border-white shadow-lg ring-2 ring-amber-300 scale-[1.02]'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-90">
                Tình huống 1
              </span>
              <span className="text-xs">🌱</span>
            </div>
            <div className="text-xs font-bold truncate mt-0.5">HS01: Cần củng cố</div>
            <div className="text-[10px] opacity-80 truncate">Bài trực quan Mức A</div>
          </button>

          {/* Tình huống 2 */}
          <button
            onClick={() => handleLaunchScenario('scenario_2_advance')}
            className={`p-2 rounded-xl text-left transition transform active:scale-95 border ${
              currentScenario === 'scenario_2_advance'
                ? 'bg-white text-orange-900 border-white shadow-lg ring-2 ring-amber-300 scale-[1.02]'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-90">
                Tình huống 2
              </span>
              <span className="text-xs">⭐</span>
            </div>
            <div className="text-xs font-bold truncate mt-0.5">HS02: Vững kiến thức</div>
            <div className="text-[10px] opacity-80 truncate">Mở rộng Mức C + Cây quả</div>
          </button>

          {/* Tình huống 3 */}
          <button
            onClick={() => handleLaunchScenario('scenario_3_inclusive')}
            className={`p-2 rounded-xl text-left transition transform active:scale-95 border ${
              currentScenario === 'scenario_3_inclusive'
                ? 'bg-white text-orange-900 border-white shadow-lg ring-2 ring-amber-300 scale-[1.02]'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-90">
                Tình huống 3
              </span>
              <span className="text-xs">🌸</span>
            </div>
            <div className="text-xs font-bold truncate mt-0.5">HS15: Hòa nhập</div>
            <div className="text-[10px] opacity-80 truncate">Chạm đếm + Hoa nở</div>
          </button>

          {/* Tình huống 4 */}
          <button
            onClick={() => handleLaunchScenario('scenario_4_dashboard')}
            className={`p-2 rounded-xl text-left transition transform active:scale-95 border ${
              currentScenario === 'scenario_4_dashboard'
                ? 'bg-white text-orange-900 border-white shadow-lg ring-2 ring-amber-300 scale-[1.02]'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-90">
                Tình huống 4
              </span>
              <span className="text-xs">📊</span>
            </div>
            <div className="text-xs font-bold truncate mt-0.5">Dashboard 30 HS</div>
            <div className="text-[10px] opacity-80 truncate">Biểu đồ & Đánh giá Trước-Sau</div>
          </button>
        </div>
      </div>
    </div>
  );
};
