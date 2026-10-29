import React, { useState } from 'react';
import {
  Volume2, VolumeX, Type, Eye, Maximize, Minimize, Users, Shield, Home, RefreshCw, Sparkles, ChevronDown
} from 'lucide-react';
import { UserRole, Student, AccessibilitySettings, ActiveView } from '../types';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeStudent: Student;
  allStudents: Student[];
  onSelectStudent: (id: string) => void;
  accessibility: AccessibilitySettings;
  onUpdateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeStudent,
  allStudents,
  onSelectStudent,
  accessibility,
  onUpdateAccessibility,
  currentView,
  onNavigate,
  onResetData,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStudentMenu, setShowStudentMenu] = useState(false);

  const toggleSound = () => {
    const next = !accessibility.sound;
    soundService.setSoundEnabled(next);
    onUpdateAccessibility({ sound: next });
    if (next) soundService.playPop();
  };

  const cycleFontSize = () => {
    soundService.playPop();
    const nextSize =
      accessibility.fontSize === 'normal'
        ? 'large'
        : accessibility.fontSize === 'large'
        ? 'extra-large'
        : 'normal';
    onUpdateAccessibility({ fontSize: nextSize });
  };

  const toggleContrast = () => {
    soundService.playPop();
    onUpdateAccessibility({ highContrast: !accessibility.highContrast });
  };

  const toggleFullscreen = () => {
    soundService.playPop();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-emerald-100 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <div
            onClick={() => {
              soundService.playPop();
              onNavigate('home');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-2xl shadow-md border-2 border-amber-300 transform group-hover:scale-105 transition">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm sm:text-base text-emerald-800 tracking-tight leading-none">
                  MỖI EM MỘT BƯỚC TIẾN
                </span>
                <span className="hidden md:inline-block bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded border border-amber-200">
                  LỚP 1A4
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold leading-tight mt-0.5 hidden sm:block">
                AI Cá Nhân Hóa & Giáo Dục Hòa Nhập • GV Nguyễn Thị Thùy Linh
              </p>
            </div>
          </div>

          {/* Center: Active Student Selector */}
          <div className="relative">
            <button
              onClick={() => setShowStudentMenu(!showStudentMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition text-xs font-bold text-slate-700"
            >
              <span className="text-base">{activeStudent.avatar}</span>
              <span className="max-w-[80px] sm:max-w-none truncate">
                {activeStudent.nickname} ({activeStudent.id})
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                  activeStudent.learningLevel === 'C'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeStudent.learningLevel === 'B'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                Mức {activeStudent.learningLevel}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu for all 30 students */}
            {showStudentMenu && (
              <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 w-72 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-xl border-2 border-emerald-200 p-2 z-50 animate-fade-in">
                <div className="text-[11px] font-black uppercase text-slate-400 px-2 py-1">
                  Chọn học sinh lớp 1A4 (30 em):
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {allStudents.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        soundService.playPop();
                        onSelectStudent(st.id);
                        setShowStudentMenu(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition ${
                        st.id === activeStudent.id
                          ? 'bg-emerald-500 text-white font-black'
                          : 'hover:bg-slate-50 text-slate-700 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{st.avatar}</span>
                        <span>{st.id} - {st.nickname}</span>
                      </div>
                      <span className="text-[10px] opacity-80">
                        {st.id === 'HS15' ? '🌸 Hòa nhập' : `Mức ${st.learningLevel}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Role Switcher & Accessibility Toggles */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Role switch */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => {
                  soundService.playPop();
                  onRoleChange('student');
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition ${
                  currentRole === 'student'
                    ? 'bg-emerald-600 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Giao diện Học sinh"
              >
                Học sinh
              </button>
              <button
                onClick={() => {
                  soundService.playPop();
                  onRoleChange('teacher');
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition ${
                  currentRole === 'teacher'
                    ? 'bg-purple-600 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Giao diện Giáo viên"
              >
                Giáo viên
              </button>
              <button
                onClick={() => {
                  soundService.playPop();
                  onRoleChange('parent');
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-lg transition hidden sm:inline-block ${
                  currentRole === 'parent'
                    ? 'bg-amber-600 text-white shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Góc Phụ huynh"
              >
                Phụ huynh
              </button>
            </div>

            {/* Accessibility Quick Tools */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
              {/* Sound */}
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl transition ${
                  accessibility.sound
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                }`}
                title={accessibility.sound ? 'Tắt âm thanh' : 'Bật âm thanh'}
              >
                {accessibility.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Font Zoom */}
              <button
                onClick={cycleFontSize}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
                title={`Cỡ chữ: ${accessibility.fontSize}`}
              >
                <Type className="w-4 h-4" />
              </button>

              {/* High Contrast */}
              <button
                onClick={toggleContrast}
                className={`p-2 rounded-xl transition ${
                  accessibility.highContrast
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
                title="Chế độ tương phản cao"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition hidden md:block"
                title="Toàn màn hình"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>

              {/* Reset Demo Data */}
              <button
                onClick={() => {
                  if (confirm('Đặt lại dữ liệu DEMO ban đầu của 30 học sinh?')) {
                    onResetData();
                  }
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Đặt lại dữ liệu DEMO"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
