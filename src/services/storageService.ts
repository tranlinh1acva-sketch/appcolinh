import { Student, IndividualEducationPlan, PrePostRecord, Assignment, SupportLevel, AttemptRecord } from '../types';
import { generateInitialStudents, INITIAL_IEP, generatePrePostEvaluationData, INITIAL_ASSIGNMENTS } from '../data/initialData';

const STORAGE_KEYS = {
  STUDENTS: 'moi_em_mot_buoc_tien_students_v1',
  ACTIVE_STUDENT_ID: 'moi_em_mot_buoc_tien_active_student_id_v1',
  IEP: 'moi_em_mot_buoc_tien_iep_v1',
  PRE_POST: 'moi_em_mot_buoc_tien_pre_post_v1',
  ASSIGNMENTS: 'moi_em_mot_buoc_tien_assignments_v1',
  PARENT_MESSAGES: 'moi_em_mot_buoc_tien_parent_messages_v1',
};

class StorageService {
  private listeners: (() => void)[] = [];

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    const initial = generateInitialStudents();
    this.saveStudents(initial);
    return initial;
  }

  public saveStudents(students: Student[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      this.notify();
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  public getActiveStudentId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID) || 'HS01';
  }

  public setActiveStudentId(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
    this.notify();
  }

  public getActiveStudent(): Student {
    const students = this.getStudents();
    const activeId = this.getActiveStudentId();
    return students.find((s) => s.id === activeId) || students[0];
  }

  public updateStudent(updated: Partial<Student> & { id: string }) {
    const students = this.getStudents();
    const index = students.findIndex((s) => s.id === updated.id);
    if (index !== -1) {
      students[index] = { ...students[index], ...updated };
      this.saveStudents(students);
    }
  }

  // Record an attempt and run adaptive personalization algorithm
  public recordAttempt(attempt: Omit<AttemptRecord, 'id' | 'date'>) {
    const students = this.getStudents();
    const stIndex = students.findIndex((s) => s.id === attempt.studentId);
    if (stIndex === -1) return;

    const student = { ...students[stIndex] };
    const dateStr = new Date().toISOString().split('T')[0];
    const newAttempt: AttemptRecord = {
      ...attempt,
      id: `att_${Date.now()}`,
      date: dateStr,
    };

    student.history = [newAttempt, ...(student.history || [])];
    student.totalAttempts += 1;
    student.hintsUsed += attempt.hintsUsed;

    const percentage = Math.round((attempt.score / attempt.total) * 100);

    // Adaptive leveling algorithm (GDPT 2018 Grade 1)
    let newLevel: SupportLevel = student.learningLevel;
    let newReason = student.supportReason;

    if (percentage >= 80 && attempt.hintsUsed <= 1) {
      newLevel = 'C';
      newReason = `${student.id} đạt ${percentage}% ở bài tập ${attempt.topic} và hoàn thành độc lập. Hệ thống gợi ý bài tập Mức C (Sẵn sàng mở rộng).`;
      student.treeLeaves += 1;
      if (student.treeLeaves % 3 === 0) {
        student.treeFlowers += 1;
      }
      if (student.treeFlowers >= 3 && student.treeFruits < 3) {
        student.treeFruits += 1;
      }
    } else if (percentage >= 40) {
      newLevel = 'B';
      newReason = `${student.id} đạt ${percentage}% ở bài tập ${attempt.topic}. Hệ thống duy trì Mức B để củng cố vững chắc kỹ năng.`;
      student.treeLeaves += 1;
    } else {
      newLevel = 'A';
      newReason = `${student.id} cần hỗ trợ ở ${attempt.topic} (${percentage}% đúng, dùng ${attempt.hintsUsed} gợi ý). Hệ thống đề xuất bài tập Mức A có hình ảnh và hướng dẫn từng bước.`;
    }

    // If inclusive candidate, increment flower petal
    if (student.isInclusiveCandidate || student.id === 'HS15') {
      if (student.flowerPetals < 6) {
        student.flowerPetals += 1;
      }
      const iep = this.getIEP();
      iep.petalsCount = student.flowerPetals;
      this.saveIEP(iep);
    }

    student.learningLevel = newLevel;
    student.supportReason = newReason;

    students[stIndex] = student;
    this.saveStudents(students);
  }

  // IEP management
  public getIEP(): IndividualEducationPlan {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.IEP);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return INITIAL_IEP;
  }

  public saveIEP(iep: IndividualEducationPlan) {
    try {
      localStorage.setItem(STORAGE_KEYS.IEP, JSON.stringify(iep));
      this.notify();
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  // Pre-Post Evaluation dataset
  public getPrePostRecords(): PrePostRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRE_POST);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    const initial = generatePrePostEvaluationData();
    this.savePrePostRecords(initial);
    return initial;
  }

  public savePrePostRecords(records: PrePostRecord[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRE_POST, JSON.stringify(records));
      this.notify();
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  // Assignments
  public getAssignments(): Assignment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return INITIAL_ASSIGNMENTS;
  }

  public saveAssignments(assignments: Assignment[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
      this.notify();
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  public addAssignment(assignment: Assignment) {
    const list = this.getAssignments();
    this.saveAssignments([assignment, ...list]);
  }

  // Parent Feedback Messages
  public getParentMessages(): { id: string; studentId: string; parentName: string; text: string; date: string }[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PARENT_MESSAGES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return [
      {
        id: 'msg_1',
        studentId: 'HS01',
        parentName: 'Phụ huynh Bé Bống',
        text: 'Dạ chào cô Linh, tối qua bé Bống rất thích chơi trò Vòng quay chữ cái trên điện thoại mẹ. Bé đã nhớ mặt chữ b và chữ c rồi ạ!',
        date: '2026-10-27',
      },
      {
        id: 'msg_2',
        studentId: 'HS15',
        parentName: 'Phụ huynh Bé An',
        text: 'Cảm ơn cô Linh nhiều lắm! Chế độ Cùng em tiến bước có hình to và giọng cô đọc nên bé An tự chạm đếm được mà không sợ sai. Bé khoe hoa nở được 4 cánh rồi cô ạ.',
        date: '2026-10-28',
      },
    ];
  }

  public addParentMessage(msg: { studentId: string; parentName: string; text: string }) {
    const current = this.getParentMessages();
    const newMsg = {
      ...msg,
      id: `pmsg_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    try {
      localStorage.setItem(STORAGE_KEYS.PARENT_MESSAGES, JSON.stringify([newMsg, ...current]));
      this.notify();
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  // Reset all to pristine demo
  public resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
    localStorage.removeItem(STORAGE_KEYS.IEP);
    localStorage.removeItem(STORAGE_KEYS.PRE_POST);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.PARENT_MESSAGES);
    this.notify();
  }
}

export const storageService = new StorageService();
