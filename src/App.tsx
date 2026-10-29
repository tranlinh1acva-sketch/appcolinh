/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MascotMamXanh } from './components/MascotMamXanh';
import { DemoScenariosBar } from './components/DemoScenariosBar';
import { HomeHub } from './components/HomeHub';
import { DiagnosticAssessment } from './components/DiagnosticAssessment';
import { VietnameseGames } from './components/VietnameseGames';
import { MathGames } from './components/MathGames';
import { StudentLearningPath } from './components/StudentLearningPath';
import { InclusiveEducationModule } from './components/InclusiveEducationModule';
import { ProgressTree } from './components/ProgressTree';
import { MascotInteractiveChat } from './components/MascotInteractiveChat';
import { TeacherAssistantAI } from './components/TeacherAssistantAI';
import { ClassroomDashboard } from './components/ClassroomDashboard';
import { PrePostEvaluation } from './components/PrePostEvaluation';
import { ResourceAndAssignment } from './components/ResourceAndAssignment';
import { ParentPortal } from './components/ParentPortal';

import { ActiveView, DemoScenarioId, UserRole, Student, AccessibilitySettings } from './types';
import { storageService } from './services/storageService';
import { soundService } from './services/soundService';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [currentScenario, setCurrentScenario] = useState<DemoScenarioId | null>(null);

  const [students, setStudents] = useState<Student[]>(() => storageService.getStudents());
  const [activeStudent, setActiveStudent] = useState<Student>(() => storageService.getActiveStudent());

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    sound: true,
    simplifiedMode: false,
  });

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      const all = storageService.getStudents();
      setStudents(all);
      setActiveStudent(storageService.getActiveStudent());
    });
    return unsubscribe;
  }, []);

  const handleSelectStudent = (id: string) => {
    storageService.setActiveStudentId(id);
    setActiveStudent(storageService.getActiveStudent());
  };

  const handleUpdateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...settings }));
  };

  const handleResetData = () => {
    storageService.resetAllData();
    setStudents(storageService.getStudents());
    setActiveStudent(storageService.getActiveStudent());
    setCurrentView('home');
    setCurrentScenario(null);
    soundService.playBloom();
  };

  // Font size class mapping
  const fontSizeClass =
    accessibility.fontSize === 'extra-large'
      ? 'text-lg'
      : accessibility.fontSize === 'large'
      ? 'text-base'
      : 'text-sm';

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        accessibility.highContrast
          ? 'bg-slate-900 text-slate-100'
          : 'bg-[#FFFDF7] text-slate-800'
      } ${fontSizeClass}`}
    >
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeStudent={activeStudent}
        allStudents={students}
        onSelectStudent={handleSelectStudent}
        accessibility={accessibility}
        onUpdateAccessibility={handleUpdateAccessibility}
        currentView={currentView}
        onNavigate={setCurrentView}
        onResetData={handleResetData}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* 2026 Competition Demo Scenarios Toolbar */}
        <DemoScenariosBar
          currentScenario={currentScenario}
          onSelectScenario={setCurrentScenario}
          onNavigate={setCurrentView}
        />

        {/* Mascot Greeting Banner (only shown on home or when chat is clicked) */}
        {currentView === 'home' && (
          <MascotMamXanh
            message={`Xin chào bé ${activeStudent.nickname}! Hôm nay mình cùng học thật vui nhé. Cây tiến bộ của bé đang có ${activeStudent.treeLeaves} lá xanh rồi đấy!`}
            expression={
              activeStudent.learningLevel === 'C'
                ? 'cheering'
                : activeStudent.id === 'HS15'
                ? 'caring'
                : 'happy'
            }
            onQuickChat={() => setCurrentView('mascot_chat')}
          />
        )}

        {/* Dynamic View Router */}
        {currentView === 'home' && (
          <HomeHub
            student={activeStudent}
            currentRole={currentRole}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'diagnostic' && (
          <DiagnosticAssessment
            student={activeStudent}
            onComplete={() => setCurrentView('learning_path')}
            onBackToHub={() => setCurrentView('home')}
          />
        )}

        {currentView === 'vietnamese' && (
          <VietnameseGames
            student={activeStudent}
            onGameComplete={() => {}}
            onBackToHub={() => setCurrentView('home')}
          />
        )}

        {currentView === 'math' && (
          <MathGames
            student={activeStudent}
            onGameComplete={() => {}}
            onBackToHub={() => setCurrentView('home')}
          />
        )}

        {currentView === 'learning_path' && (
          <StudentLearningPath
            student={activeStudent}
            currentRole={currentRole}
            onStartActivity={(sub) => {
              if (sub === 'inclusive') setCurrentView('inclusive');
              else if (sub === 'vietnamese') setCurrentView('vietnamese');
              else setCurrentView('math');
            }}
            onBackToHub={() => setCurrentView('home')}
          />
        )}

        {currentView === 'inclusive' && (
          <InclusiveEducationModule
            student={activeStudent}
            currentRole={currentRole}
            onBackToHub={() => setCurrentView('home')}
          />
        )}

        {currentView === 'progress_tree' && (
          <ProgressTree
            student={activeStudent}
            onContinueLearning={() => {
              if (activeStudent.id === 'HS15') setCurrentView('inclusive');
              else setCurrentView('vietnamese');
            }}
            onBackToHub={() => setCurrentView('home')}
          />
        )}

        {currentView === 'mascot_chat' && (
          <MascotInteractiveChat
            student={activeStudent}
            onBackToHub={() => setCurrentView('home')}
          />
        )}

        {currentView === 'teacher_assistant' && (
          <TeacherAssistantAI onBackToHub={() => setCurrentView('home')} />
        )}

        {currentView === 'dashboard' && (
          <ClassroomDashboard
            onSelectStudent={(id) => {
              handleSelectStudent(id);
              setCurrentView('learning_path');
            }}
            onNavigateInclusive={() => {
              handleSelectStudent('HS15');
              setCurrentView('inclusive');
            }}
            onBackToHub={() => setCurrentView('home')}
          />
        )}

        {currentView === 'pre_post_evaluation' && (
          <PrePostEvaluation onBackToHub={() => setCurrentView('home')} />
        )}

        {currentView === 'resources' && (
          <ResourceAndAssignment onBackToHub={() => setCurrentView('home')} />
        )}

        {currentView === 'parent_corner' && (
          <ParentPortal
            student={activeStudent}
            onBackToHub={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/70 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-extrabold text-emerald-800 text-sm">
            “Mỗi em một khả năng – Mỗi ngày một bước tiến – Không em nào bị bỏ lại phía sau.”
          </p>
          <p>
            Phần mềm AI Cá nhân hóa học tập và Hỗ trợ giáo dục hòa nhập lớp 1 • Giáo viên: <strong>Nguyễn Thị Thùy Linh</strong> • Lớp 1A4 • Trường Tiểu học Nguyễn Hiền, Phường Vĩnh Tế, An Giang
          </p>
          <p className="text-[11px] text-slate-400">
            Dự án tham dự Hội thi Giáo viên Giỏi & Ứng dụng AI Giáo dục 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
