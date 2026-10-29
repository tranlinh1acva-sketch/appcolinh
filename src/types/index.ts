export type UserRole = 'student' | 'teacher' | 'parent';

export type ActiveView =
  | 'home'
  | 'diagnostic'
  | 'vietnamese'
  | 'math'
  | 'learning_path'
  | 'inclusive'
  | 'progress_tree'
  | 'mascot_chat'
  | 'teacher_assistant'
  | 'dashboard'
  | 'pre_post_evaluation'
  | 'resources'
  | 'parent_corner';

export type DemoScenarioId =
  | 'scenario_1_support'
  | 'scenario_2_advance'
  | 'scenario_3_inclusive'
  | 'scenario_4_dashboard';

export type SupportLevel = 'A' | 'B' | 'C'; // A: Cần củng cố, B: Đang tiến bộ, C: Sẵn sàng mở rộng

export type TextbookSeries =
  | 'ket_noi_tri_thuc'
  | 'chan_troi_sang_tao'
  | 'canh_dieu';

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
  sound: boolean;
  simplifiedMode: boolean;
}

export interface AttemptRecord {
  id: string;
  studentId: string;
  date: string;
  subject: 'vietnamese' | 'math' | 'inclusive';
  topic: string;
  score: number;
  total: number;
  hintsUsed: number;
  level: SupportLevel;
  timeSpentSeconds: number;
}

export interface Student {
  id: string; // 'HS01' .. 'HS30'
  nickname: string; // 'Bé Bống', 'Bé Tôm', etc.
  avatar: string;
  gender: 'nam' | 'nu';
  hasDiagnostic: boolean;
  isInclusiveCandidate?: boolean; // Dedicated for HS15 demo
  skills: {
    // Tiếng Việt
    tv_nhan_biet_chu_cai: number;
    tv_nhan_biet_am: number;
    tv_ghep_van: number;
    tv_nhan_biet_tieng: number;
    tv_doc_tu: number;
    tv_doc_cau: number;
    tv_hieu_cau: number;
    // Toán
    toan_dem_so: number;
    toan_nhan_biet_so: number;
    toan_so_sanh: number;
    toan_sap_xep: number;
    toan_cong_pham_vi: number;
    toan_tru_pham_vi: number;
    toan_giai_toan_hinh_anh: number;
  };
  learningLevel: SupportLevel;
  supportReason: string;
  treeLeaves: number;
  treeFlowers: number;
  treeFruits: number;
  flowerPetals: number; // For inclusive flower
  totalAttempts: number;
  hintsUsed: number;
  history: AttemptRecord[];
}

export interface IndividualEducationPlan {
  studentId: string;
  strengths: string;
  needs: string;
  weeklyGoal: string;
  accommodations: string[];
  promptLevel: 'Độc lập' | 'Nhắc nhở nhẹ' | 'Gợi ý trực quan' | 'Hỗ trợ từng bước';
  petalsCount: number;
  teacherNotes: string;
  nextMilestone: string;
  updatedAt: string;
}

export interface PrePostRecord {
  studentId: string;
  studentNickname: string;
  skillGroup: string;
  preCorrect: number;
  preTotal: number;
  prePercentage: number;
  postCorrect: number;
  postTotal: number;
  postPercentage: number;
  deltaPercentage: number;
  hintsPre: number;
  hintsPost: number;
  teacherObservation: 'Cần cố gắng' | 'Đạt' | 'Tốt';
  parentFeedbackScore: number; // 1-5
  notes: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: 'vietnamese' | 'math' | 'inclusive';
  targetAudience: 'all' | 'level_A' | 'level_B' | 'level_C' | 'hs15';
  targetStudentIds: string[];
  week: number;
  level: SupportLevel;
  assignedDate: string;
  dueDate: string;
  completedCount: number;
  description: string;
}

export interface QuestionItem {
  id: string;
  subject: 'vietnamese' | 'math';
  skillId: string;
  prompt: string;
  audioPrompt?: string;
  imageUrl?: string;
  imageEmoji?: string;
  options: {
    id: string;
    text: string;
    imageEmoji?: string;
  }[];
  correctOptionId: string;
  hint: string;
  explanation: string;
  level: SupportLevel;
}
