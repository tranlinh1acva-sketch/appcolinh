import { Student, IndividualEducationPlan, PrePostRecord, Assignment, QuestionItem } from '../types';

export const SKILLS_CONFIG = {
  vietnamese: [
    { id: 'tv_nhan_biet_chu_cai', name: 'Nhận biết chữ cái', category: 'Âm chữ' },
    { id: 'tv_nhan_biet_am', name: 'Nhận biết âm đã học', category: 'Âm chữ' },
    { id: 'tv_ghep_van', name: 'Ghép âm, vần', category: 'Vần' },
    { id: 'tv_nhan_biet_tieng', name: 'Nhận biết tiếng', category: 'Tiếng' },
    { id: 'tv_doc_tu', name: 'Đọc từ ngữ', category: 'Từ' },
    { id: 'tv_doc_cau', name: 'Đọc câu ngắn', category: 'Câu' },
    { id: 'tv_hieu_cau', name: 'Hiểu câu đơn giản', category: 'Đọc hiểu' },
  ],
  math: [
    { id: 'toan_dem_so', name: 'Đếm số lượng', category: 'Số' },
    { id: 'toan_nhan_biet_so', name: 'Nhận biết chữ số', category: 'Số' },
    { id: 'toan_so_sanh', name: 'So sánh số', category: 'So sánh' },
    { id: 'toan_sap_xep', name: 'Sắp xếp thứ tự số', category: 'Thứ tự' },
    { id: 'toan_cong_pham_vi', name: 'Phép cộng trong phạm vi', category: 'Phép tính' },
    { id: 'toan_tru_pham_vi', name: 'Phép trừ trong phạm vi', category: 'Phép tính' },
    { id: 'toan_giai_toan_hinh_anh', name: 'Giải toán qua hình ảnh', category: 'Tư duy' },
  ],
};

const NICKNAMES = [
  'Bé Bống', 'Bé Tôm', 'Bé Miu', 'Bé Ken', 'Bé Nhím',
  'Bé Sóc', 'Bé Khoai', 'Bé Gạo', 'Bé Na', 'Bé Su',
  'Bé Tin', 'Bé Măng', 'Bé Sâu', 'Bé Cún', 'Bé An (Hòa nhập)',
  'Bé Thỏ', 'Bé Gấu', 'Bé Voi', 'Bé Sữa', 'Bé Mít',
  'Bé Tít', 'Bé Bắp', 'Bé Bông', 'Bé Đậu', 'Bé Cam',
  'Bé Chanh', 'Bé Xoài', 'Bé Dừa', 'Bé Bon', 'Bé Bo',
];

const AVATARS = [
  '🌱', '🦊', '🐱', '🐶', '🐰',
  '🐼', '🐨', '🐯', '🦁', '🐸',
  '🐵', '🐥', '🐧', '🦉', '⭐',
  '🌸', '🌻', '🍎', '🍓', '🍇',
  '🚀', '🎈', '🎨', '📚', '🧩',
  '🐬', '🐙', '🐝', '🐞', '🦋'
];

export function generateInitialStudents(): Student[] {
  return Array.from({ length: 30 }, (_, i) => {
    const id = `HS${(i + 1).toString().padStart(2, '0')}`;
    const nickname = NICKNAMES[i];
    const avatar = AVATARS[i];
    const gender: 'nam' | 'nu' = i % 2 === 0 ? 'nu' : 'nam';

    // Tailored scenarios
    if (id === 'HS01') {
      return {
        id,
        nickname,
        avatar,
        gender,
        hasDiagnostic: true,
        skills: {
          tv_nhan_biet_chu_cai: 50,
          tv_nhan_biet_am: 45,
          tv_ghep_van: 35,
          tv_nhan_biet_tieng: 40,
          tv_doc_tu: 35,
          tv_doc_cau: 30,
          tv_hieu_cau: 25,
          toan_dem_so: 60,
          toan_nhan_biet_so: 55,
          toan_so_sanh: 40,
          toan_sap_xep: 35,
          toan_cong_pham_vi: 45,
          toan_tru_pham_vi: 30,
          toan_giai_toan_hinh_anh: 30,
        },
        learningLevel: 'A',
        supportReason: 'HS01 cần củng cố ghép vần "an, at" và phép trừ phạm vi 5 (kết quả khảo sát đạt 36%, cần nhiều gợi ý trực quan)',
        treeLeaves: 3,
        treeFlowers: 0,
        treeFruits: 0,
        flowerPetals: 2,
        totalAttempts: 5,
        hintsUsed: 8,
        history: [
          {
            id: 'att_01',
            studentId: id,
            date: '2026-10-25',
            subject: 'vietnamese',
            topic: 'Ghép vần cơ bản',
            score: 2,
            total: 5,
            hintsUsed: 3,
            level: 'A',
            timeSpentSeconds: 140,
          },
        ],
      };
    }

    if (id === 'HS02') {
      return {
        id,
        nickname,
        avatar,
        gender,
        hasDiagnostic: true,
        skills: {
          tv_nhan_biet_chu_cai: 95,
          tv_nhan_biet_am: 90,
          tv_ghep_van: 92,
          tv_nhan_biet_tieng: 90,
          tv_doc_tu: 88,
          tv_doc_cau: 85,
          tv_hieu_cau: 85,
          toan_dem_so: 98,
          toan_nhan_biet_so: 95,
          toan_so_sanh: 92,
          toan_sap_xep: 90,
          toan_cong_pham_vi: 92,
          toan_tru_pham_vi: 88,
          toan_giai_toan_hinh_anh: 85,
        },
        learningLevel: 'C',
        supportReason: 'HS02 hoàn thành xuất sắc các bài tập độc lập (tỷ lệ đúng 90%, không cần gợi ý), sẵn sàng mở rộng tư duy toán có lời văn và đọc trôi chảy câu dài',
        treeLeaves: 9,
        treeFlowers: 4,
        treeFruits: 2,
        flowerPetals: 5,
        totalAttempts: 12,
        hintsUsed: 1,
        history: [
          {
            id: 'att_02',
            studentId: id,
            date: '2026-10-26',
            subject: 'math',
            topic: 'Phép cộng trừ mở rộng',
            score: 5,
            total: 5,
            hintsUsed: 0,
            level: 'C',
            timeSpentSeconds: 95,
          },
        ],
      };
    }

    if (id === 'HS15') {
      return {
        id,
        nickname,
        avatar: '🌱',
        gender: 'nam',
        hasDiagnostic: true,
        isInclusiveCandidate: true,
        skills: {
          tv_nhan_biet_chu_cai: 40,
          tv_nhan_biet_am: 35,
          tv_ghep_van: 25,
          tv_nhan_biet_tieng: 30,
          tv_doc_tu: 25,
          tv_doc_cau: 20,
          tv_hieu_cau: 20,
          toan_dem_so: 45,
          toan_nhan_biet_so: 40,
          toan_so_sanh: 30,
          toan_sap_xep: 25,
          toan_cong_pham_vi: 30,
          toan_tru_pham_vi: 20,
          toan_giai_toan_hinh_anh: 25,
        },
        learningLevel: 'A',
        supportReason: 'HS15 học theo Chế độ Hỗ trợ Cá nhân (Cùng em tiến bước): chia nhỏ bài tập trực quan, 1 nhiệm vụ/màn hình, tương tác chạm đếm, phản hồi dịu dàng',
        treeLeaves: 4,
        treeFlowers: 1,
        treeFruits: 0,
        flowerPetals: 4, // 4 petals bloomed
        totalAttempts: 8,
        hintsUsed: 9,
        history: [
          {
            id: 'att_15',
            studentId: id,
            date: '2026-10-27',
            subject: 'inclusive',
            topic: 'Đếm 3 quả táo - Tương tác chạm',
            score: 3,
            total: 3,
            hintsUsed: 1,
            level: 'A',
            timeSpentSeconds: 180,
          },
        ],
      };
    }

    // Realistic distribution for other students
    const isLevelC = i % 4 === 1;
    const isLevelA = i % 5 === 0;
    const baseScore = isLevelC ? 84 : isLevelA ? 48 : 68;
    const variance = (i * 3) % 15 - 7;
    const s = Math.min(95, Math.max(30, baseScore + variance));

    return {
      id,
      nickname,
      avatar,
      gender,
      hasDiagnostic: true,
      skills: {
        tv_nhan_biet_chu_cai: Math.min(100, s + 5),
        tv_nhan_biet_am: s,
        tv_ghep_van: Math.max(25, s - 8),
        tv_nhan_biet_tieng: s,
        tv_doc_tu: Math.max(25, s - 5),
        tv_doc_cau: Math.max(20, s - 10),
        tv_hieu_cau: Math.max(20, s - 12),
        toan_dem_so: Math.min(100, s + 10),
        toan_nhan_biet_so: Math.min(100, s + 5),
        toan_so_sanh: s,
        toan_sap_xep: Math.max(25, s - 6),
        toan_cong_pham_vi: s,
        toan_tru_pham_vi: Math.max(25, s - 7),
        toan_giai_toan_hinh_anh: Math.max(20, s - 8),
      },
      learningLevel: isLevelC ? 'C' : isLevelA ? 'A' : 'B',
      supportReason: isLevelC
        ? `${id} nắm chắc kiến thức cơ bản, tiếp tục luyện bài vận dụng mở rộng.`
        : isLevelA
        ? `${id} cần thêm thời gian củng cố ghép vần và đếm số phạm vi 10.`
        : `${id} đang tiến bộ đều, luyện tập thêm để tự tin làm bài độc lập.`,
      treeLeaves: isLevelC ? 8 : isLevelA ? 3 : 5,
      treeFlowers: isLevelC ? 3 : isLevelA ? 0 : 1,
      treeFruits: isLevelC ? 1 : 0,
      flowerPetals: 3,
      totalAttempts: Math.floor(4 + (i % 6)),
      hintsUsed: isLevelA ? 6 : 2,
      history: [],
    };
  });
}

export const INITIAL_IEP: IndividualEducationPlan = {
  studentId: 'HS15',
  strengths: 'Vui vẻ, thích màu sắc tươi sáng, hợp tác khi được cô khen ngợi bằng biểu tượng ngôi sao và mầm cây.',
  needs: 'Cần hướng dẫn trực quan từng bước khi nhận biết số trên 3 và nhận diện các âm vần có phụ âm ghép.',
  weeklyGoal: 'Nhận biết đúng số 1 đến 5 qua đồ vật trực quan; tự ghép được tiếng "ba", "cá" với gợi ý âm thanh.',
  accommodations: [
    'Phóng to cỡ chữ và hình ảnh trực quan',
    'Chỉ hiển thị 1 nhiệm vụ duy nhất trên mỗi màn hình',
    'Thao tác chạm đếm thay vì kéo thả phức tạp',
    'Có nút nghe lại âm thanh giọng cô không giới hạn',
    'Không đặt giới hạn thời gian đếm ngược gây căng thẳng'
  ],
  promptLevel: 'Gợi ý trực quan',
  petalsCount: 4, // 4 cánh hoa đã nở
  teacherNotes: 'Tuần này em đã tự chạm đếm 4 chú bướm mà chỉ cần cô nhắc nhẹ 1 lần. Rất đáng khen!',
  nextMilestone: 'Tự đếm độc lập 5 ngôi sao và chọn đúng chữ số 5 tương ứng.',
  updatedAt: '2026-10-28',
};

export function generatePrePostEvaluationData(): PrePostRecord[] {
  const students = generateInitialStudents();
  return students.map((st, i) => {
    // Generate realistic scientifically calibrated pre and post trial dataset
    const isInclusive = st.id === 'HS15';
    const isAdv = st.learningLevel === 'C';
    const isLow = st.learningLevel === 'A';

    const preCorrect = isAdv ? 8 : isLow ? 4 : isInclusive ? 3 : 6;
    const preTotal = 10;
    const prePercentage = Math.round((preCorrect / preTotal) * 100);

    const postCorrect = isAdv ? 10 : isLow ? 8 : isInclusive ? 7 : 9;
    const postTotal = 10;
    const postPercentage = Math.round((postCorrect / postTotal) * 100);
    const deltaPercentage = postPercentage - prePercentage;

    const hintsPre = isInclusive ? 6 : isLow ? 5 : 2;
    const hintsPost = isInclusive ? 2 : isLow ? 1 : 0;

    const observationLevel: 'Cần cố gắng' | 'Đạt' | 'Tốt' =
      postPercentage >= 90 ? 'Tốt' : 'Đạt';

    const parentFeedbackScore = isAdv ? 5 : 4 + (i % 2 === 0 ? 1 : 0);

    return {
      studentId: st.id,
      studentNickname: st.nickname,
      skillGroup: 'Kỹ năng Đọc & Tính toán Lớp 1 (TT27)',
      preCorrect,
      preTotal,
      prePercentage,
      postCorrect,
      postTotal,
      postPercentage,
      deltaPercentage,
      hintsPre,
      hintsPost,
      teacherObservation: observationLevel,
      parentFeedbackScore,
      notes: isInclusive
        ? 'Tiến bộ vượt bậc về khả năng tự chạm đếm và tự tin giơ tay'
        : `Tăng ${deltaPercentage}% so với khảo sát ban đầu, số gợi ý giảm rõ rệt`,
    };
  });
}

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_01',
    title: 'Luyện tập ghép vần "a, c, b" và đếm số 1-5',
    subject: 'vietnamese',
    targetAudience: 'level_A',
    targetStudentIds: ['HS01', 'HS06', 'HS11', 'HS16', 'HS21', 'HS26'],
    week: 6,
    level: 'A',
    assignedDate: '2026-10-25',
    dueDate: '2026-10-31',
    completedCount: 4,
    description: 'Nhiệm vụ trực quan dành cho các em cần củng cố: nghe âm và chọn chữ đúng.',
  },
  {
    id: 'asg_02',
    title: 'Thử thách: Đoàn tàu số học và Ghép câu vui',
    subject: 'math',
    targetAudience: 'level_C',
    targetStudentIds: ['HS02', 'HS07', 'HS12', 'HS17', 'HS22', 'HS27'],
    week: 6,
    level: 'C',
    assignedDate: '2026-10-25',
    dueDate: '2026-10-31',
    completedCount: 6,
    description: 'Nhiệm vụ vận dụng: điền số còn thiếu vào đoàn tàu và tìm từ thích hợp hoàn chỉnh câu.',
  },
  {
    id: 'asg_03',
    title: 'Cùng em tiến bước: Chạm đếm 3 quả táo & nghe đọc chữ "a"',
    subject: 'inclusive',
    targetAudience: 'hs15',
    targetStudentIds: ['HS15'],
    week: 6,
    level: 'A',
    assignedDate: '2026-10-26',
    dueDate: '2026-10-31',
    completedCount: 1,
    description: 'Chế độ hỗ trợ cá nhân cho HS15: chia nhỏ 5 bước, hình to, tương tác chạm.',
  },
];

// Rich question bank for Diagnostic & Games
export const SAMPLE_QUESTIONS: QuestionItem[] = [
  // Tiếng Việt - Nhận biết chữ cái
  {
    id: 'q_tv_01',
    subject: 'vietnamese',
    skillId: 'tv_nhan_biet_chu_cai',
    prompt: 'Bé hãy nhìn tranh và chọn chữ cái bắt đầu của từ "Bé":',
    audioPrompt: 'Bé hãy nhìn tranh và chọn chữ cái bắt đầu của từ Bé',
    imageEmoji: '👶',
    options: [
      { id: 'opt_1', text: 'b' },
      { id: 'opt_2', text: 'd' },
      { id: 'opt_3', text: 'c' },
    ],
    correctOptionId: 'opt_1',
    hint: 'Chữ cái "b" có một nét sổ thẳng bên trái và một nét cong tròn bên phải.',
    explanation: 'Đúng rồi! Chữ "b" bắt đầu cho tiếng "bé" (b - e - be - sắc - bé).',
    level: 'A',
  },
  {
    id: 'q_tv_02',
    subject: 'vietnamese',
    skillId: 'tv_ghep_van',
    prompt: 'Ghép âm "c" với âm "a" và dấu sắc ta được tiếng gì?',
    audioPrompt: 'Ghép âm cờ với âm a và dấu sắc ta được tiếng gì?',
    imageEmoji: '🐟',
    options: [
      { id: 'opt_1', text: 'cá' },
      { id: 'opt_2', text: 'cà' },
      { id: 'opt_3', text: 'ba' },
    ],
    correctOptionId: 'opt_1',
    hint: 'Dấu sắc nghiêng từ trên xuống dưới, từ phải sang trái: c - a - ca - sắc - cá.',
    explanation: 'Giỏi lắm! c - a - ca - sắc - cá. Đó là chú cá bơi tung tăng!',
    level: 'B',
  },
  {
    id: 'q_tv_03',
    subject: 'vietnamese',
    skillId: 'tv_doc_tu',
    prompt: 'Nhìn tranh chú gà trống và chọn từ thích hợp:',
    audioPrompt: 'Nhìn tranh chú gà trống và chọn từ thích hợp',
    imageEmoji: '🐓',
    options: [
      { id: 'opt_1', text: 'con gà' },
      { id: 'opt_2', text: 'con vịt' },
      { id: 'opt_3', text: 'con chó' },
    ],
    correctOptionId: 'opt_1',
    hint: 'Chú gà gáy ò ó o mỗi sớm mai thức dậy.',
    explanation: 'Chính xác! Đó là "con gà" oai phong gáy ò ó o.',
    level: 'A',
  },
  {
    id: 'q_tv_04',
    subject: 'vietnamese',
    skillId: 'tv_doc_cau',
    prompt: 'Chọn câu viết đúng mô tả bức tranh bé đi học:',
    audioPrompt: 'Chọn câu viết đúng mô tả bức tranh bé đi học',
    imageEmoji: '🎒',
    options: [
      { id: 'opt_1', text: 'Bé đi học ngoan.' },
      { id: 'opt_2', text: 'Bé ngủ say sưa.' },
      { id: 'opt_3', text: 'Bé bơi lội dưới nước.' },
    ],
    correctOptionId: 'opt_1',
    hint: 'Bé đeo ba lô trên vai và bước vào cổng trường.',
    explanation: 'Tuyệt vời! "Bé đi học ngoan" là câu hoàn toàn chính xác.',
    level: 'C',
  },
  // Toán - Đếm số
  {
    id: 'q_m_01',
    subject: 'math',
    skillId: 'toan_dem_so',
    prompt: 'Bé đếm xem có bao nhiêu quả táo màu đỏ trong giỏ?',
    audioPrompt: 'Bé đếm xem có bao nhiêu quả táo màu đỏ trong giỏ',
    imageEmoji: '🍎 🍎 🍎',
    options: [
      { id: 'opt_1', text: '3 quả' },
      { id: 'opt_2', text: '2 quả' },
      { id: 'opt_3', text: '4 quả' },
    ],
    correctOptionId: 'opt_1',
    hint: 'Bé cùng đếm với Mầm Xanh nhé: 1, 2, 3!',
    explanation: 'Đúng rồi! Trong giỏ có tất cả 3 quả táo ngọt lành.',
    level: 'A',
  },
  {
    id: 'q_m_02',
    subject: 'math',
    skillId: 'toan_so_sanh',
    prompt: 'So sánh số: 4 ... 7 (Điền dấu <, >, =)',
    audioPrompt: 'So sánh số 4 và số 7',
    imageEmoji: '🔢',
    options: [
      { id: 'opt_1', text: '< (Bé hơn)' },
      { id: 'opt_2', text: '> (Lớn hơn)' },
      { id: 'opt_3', text: '= (Bằng)' },
    ],
    correctOptionId: 'opt_1',
    hint: '4 quả cam ít hơn 7 quả cam, nên 4 bé hơn 7.',
    explanation: 'Chính xác! 4 < 7 (Bốn bé hơn bảy). Mũi nhọn hướng về số nhỏ hơn.',
    level: 'B',
  },
  {
    id: 'q_m_03',
    subject: 'math',
    skillId: 'toan_cong_pham_vi',
    prompt: 'Tính: 3 + 2 = ?',
    audioPrompt: 'Ba cộng hai bằng mấy?',
    imageEmoji: '⭐️ ⭐️ ⭐️  +  ⭐️ ⭐️',
    options: [
      { id: 'opt_1', text: '5' },
      { id: 'opt_2', text: '4' },
      { id: 'opt_3', text: '6' },
    ],
    correctOptionId: 'opt_1',
    hint: 'Có 3 ngôi sao, thêm 2 ngôi sao nữa: 3 đếm thêm 4, 5!',
    explanation: 'Hoan hô bé! 3 + 2 = 5. Bé làm toán rất giỏi!',
    level: 'A',
  },
  {
    id: 'q_m_04',
    subject: 'math',
    skillId: 'toan_tru_pham_vi',
    prompt: 'Trên cành có 5 chú chim, 2 chú bay đi. Còn lại mấy chú chim? (5 - 2 = ?)',
    audioPrompt: 'Năm trừ hai bằng mấy?',
    imageEmoji: '🐦 🐦 🐦 🐦 🐦',
    options: [
      { id: 'opt_1', text: '3' },
      { id: 'opt_2', text: '2' },
      { id: 'opt_3', text: '4' },
    ],
    correctOptionId: 'opt_1',
    hint: 'Xòe 5 ngón tay, cụp bớt 2 ngón tay lại xem còn mấy ngón nhé.',
    explanation: 'Giỏi quá! 5 - 2 = 3. Trên cành còn lại 3 chú chim hót líu lo.',
    level: 'B',
  },
  {
    id: 'q_m_05',
    subject: 'math',
    skillId: 'toan_giai_toan_hinh_anh',
    prompt: 'Mẹ mua 4 quả cam, bà cho thêm 3 quả cam. Hỏi bé có tất cả bao nhiêu quả cam?',
    audioPrompt: 'Mẹ mua bốn quả cam, bà cho thêm ba quả cam. Hỏi bé có tất cả bao nhiêu quả cam?',
    imageEmoji: '🍊 🍊 🍊 🍊  +  🍊 🍊 🍊',
    options: [
      { id: 'opt_1', text: '7 quả cam (4 + 3 = 7)' },
      { id: 'opt_2', text: '6 quả cam' },
      { id: 'opt_3', text: '8 quả cam' },
    ],
    correctOptionId: 'opt_1',
    hint: 'Thêm vào nghĩa là làm phép cộng: 4 cộng thêm 3 bằng mấy nhỉ?',
    explanation: 'Tuyệt đỉnh! 4 + 3 = 7 quả cam. Bé tư duy toán có lời văn rất tốt!',
    level: 'C',
  },
];
