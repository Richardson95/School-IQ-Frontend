export const DEMO_USERS = {
  parent: { id: 'p1', name: 'Mrs. Bukola Adewale', email: 'parent@riverbank.edu', password: 'demo123', role: 'parent', phone: '08012345678', childrenIds: ['s1', 's2'] },
  teacher: { id: 't1', name: 'Mr. Obinna Chukwuma', email: 'teacher@riverbank.edu', password: 'demo123', role: 'teacher', subjects: ['Mathematics', 'Further Mathematics'], classes: ['SS 2A', 'SS 2B', 'SS 3A'] },
  authority: { id: 'a1', name: 'Mrs. Fatima Abubakar', email: 'authority@riverbank.edu', password: 'demo123', role: 'authority', position: 'Principal' },
  admin: { id: 'ad1', name: 'Mr. Taiwo Oladele', email: 'admin@riverbank.edu', password: 'demo123', role: 'admin' },
  student: { id: 's1', name: 'Toluwalope Adewale', email: 'student@riverbank.edu', password: 'demo123', role: 'student', class: 'SS 2A', admissionNo: 'RBS/2022/0145', parentId: 'p1' },
};

// Build a date-of-birth whose month/day is `offsetDays` from today, with the given
// birth year — used so the birthday feature is demoable whenever the app is opened
// (s1 has a birthday today, a few others within the next 3 days).
const _dob = (offsetDays, birthYear) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${birthYear}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const STUDENTS = [
  { id: 's1', name: 'Toluwalope Adewale', class: 'SS 2A', gender: 'Female', parentId: 'p1', admissionNo: 'RBS/2022/0145', dob: _dob(0, 2010) },
  { id: 's2', name: 'Damilola Adewale', class: 'JSS 1B', gender: 'Male', parentId: 'p1', admissionNo: 'RBS/2024/0312', dob: _dob(2, 2013) },
  { id: 's3', name: 'Chidi Nwankwo', class: 'SS 3A', gender: 'Male', parentId: 'p2', admissionNo: 'RBS/2021/0089', dob: '2009-11-03' },
  { id: 's4', name: 'Ngozi Okafor', class: 'SS 2A', gender: 'Female', parentId: 'p3', admissionNo: 'RBS/2022/0201', dob: _dob(1, 2010) },
  { id: 's5', name: 'Emeka Eze', class: 'SS 2A', gender: 'Male', parentId: 'p4', admissionNo: 'RBS/2022/0177', dob: '2010-09-21' },
  { id: 's6', name: 'Amina Bello', class: 'SS 2B', gender: 'Female', parentId: 'p5', admissionNo: 'RBS/2022/0098', dob: _dob(3, 2011) },
];

export const ALL_CLASSES = ['JSS 1A', 'JSS 1B', 'JSS 2A', 'JSS 2B', 'JSS 3A', 'JSS 3B', 'SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'];

export const WEEKLY_REPORTS = [
  { id: 'wr1', studentId: 's1', teacherId: 't1', teacherName: 'Mr. Obinna Chukwuma', subject: 'Mathematics', week: 'Week 3, May 2026', term: '2nd Term', session: '2025/2026', classwork: 85, homework: 78, participation: 90, behavior: 'Excellent', summary: 'Toluwalope performed very well this week. She showed strong understanding of quadratic equations and actively participated in class discussions.', recommendations: 'Keep up the good work. Review Chapter 5 before next week\'s test.', date: '2026-05-09' },
  { id: 'wr2', studentId: 's1', teacherId: 't2', teacherName: 'Mrs. Ngozi Adeyemi', subject: 'English Language', week: 'Week 3, May 2026', term: '2nd Term', session: '2025/2026', classwork: 78, homework: 82, participation: 75, behavior: 'Good', summary: 'Toluwalope\'s essay writing has improved significantly. Good comprehension skills demonstrated.', recommendations: 'Practice more oral exercises at home.', date: '2026-05-09' },
  { id: 'wr3', studentId: 's1', teacherId: 't3', teacherName: 'Mr. Seun Ogunleye', subject: 'Biology', week: 'Week 3, May 2026', term: '2nd Term', session: '2025/2026', classwork: 92, homework: 88, participation: 95, behavior: 'Outstanding', summary: 'Exceptional understanding of cell biology. Led the class discussion on osmosis with great clarity.', recommendations: 'Excellent work! Consider joining the Science Club.', date: '2026-05-09' },
  { id: 'wr4', studentId: 's1', teacherId: 't1', teacherName: 'Mr. Obinna Chukwuma', subject: 'Mathematics', week: 'Week 2, May 2026', term: '2nd Term', session: '2025/2026', classwork: 80, homework: 75, participation: 85, behavior: 'Good', summary: 'Good performance on algebra topics. Needs more practice on trigonometry.', recommendations: 'Spend extra time on trigonometric identities.', date: '2026-05-02' },
  { id: 'wr5', studentId: 's2', teacherId: 't4', teacherName: 'Mrs. Bisi Akande', subject: 'Basic Science', week: 'Week 3, May 2026', term: '2nd Term', session: '2025/2026', classwork: 70, homework: 68, participation: 72, behavior: 'Good', summary: 'Damilola is doing well in science. Shows curiosity and asks good questions.', recommendations: 'Encourage him to read ahead of each lesson.', date: '2026-05-09' },
];

export const INCIDENT_MESSAGES = [
  { id: 'im1', from: 'Mr. Obinna Chukwuma', fromRole: 'teacher', studentId: 's1', studentName: 'Toluwalope Adewale', type: 'misconduct', severity: 'medium', message: 'Toluwalope was found using her phone during class hours despite repeated warnings. Please have a conversation with her about respecting school rules regarding electronic devices.', date: '2026-05-10T10:30:00', read: false },
  { id: 'im2', from: 'School Admin', fromRole: 'admin', studentId: 's2', studentName: 'Damilola Adewale', type: 'late', severity: 'low', message: 'Damilola arrived 25 minutes late to school today without an excuse note. This is the third occurrence this term. Please ensure he arrives on time.', date: '2026-05-08T08:45:00', read: true },
  { id: 'im3', from: 'Mrs. Ngozi Adeyemi', fromRole: 'teacher', studentId: 's1', studentName: 'Toluwalope Adewale', type: 'fight', severity: 'high', message: 'Toluwalope was involved in a verbal altercation with another student during break time today. The matter has been resolved but we would like you to speak with her at home.', date: '2026-04-28T12:15:00', read: true },
];

export const CALENDAR_EVENTS = [
  { id: 'e1', title: '2nd Term Resumption', date: '2026-04-28', endDate: null, type: 'resumption', description: 'Students resume for the 2nd term. All students must be in school by 7:30 AM.', classes: ['All'] },
  { id: 'e2', title: 'Mathematics Exam — SS 2', date: '2026-05-20', endDate: null, type: 'exam', description: 'SS 2 Mathematics examination. Topics: Algebra, Trigonometry, Statistics.', classes: ['SS 2A', 'SS 2B'] },
  { id: 'e3', title: 'Annual Sports Day', date: '2026-05-25', endDate: null, type: 'activity', description: 'Annual inter-house sports competition. Parents are invited to watch and cheer their children.', classes: ['All'] },
  { id: 'e4', title: 'Mid-Term Break', date: '2026-05-29', endDate: '2026-06-02', type: 'holiday', description: 'Mid-term break. School resumes June 3rd.', classes: ['All'] },
  { id: 'e5', title: 'English Exam — All SS', date: '2026-05-21', endDate: null, type: 'exam', description: 'SS 1, 2 & 3 English Language examination.', classes: ['SS 1A', 'SS 1B', 'SS 2A', 'SS 2B', 'SS 3A', 'SS 3B'] },
  { id: 'e6', title: 'Prize Giving Day', date: '2026-06-28', endDate: null, type: 'activity', description: 'End-of-year Prize Giving ceremony. Best students will be awarded. All parents welcome.', classes: ['All'] },
  { id: 'e7', title: '2nd Term Examination', date: '2026-06-10', endDate: '2026-06-20', type: 'exam', description: '2nd Term final examinations for all classes.', classes: ['All'] },
  { id: 'e8', title: '2nd Term Closing', date: '2026-06-26', endDate: null, type: 'holiday', description: 'End of 2nd term. 3rd term resumes September 8th.', classes: ['All'] },
];

export const BEST_STUDENTS = [
  { id: 'bs1', term: '1st Term', session: '2025/2026', category: 'Best Academic Student', studentName: 'Chidi Nwankwo', class: 'SS 3A', score: '98.5%', description: 'Highest overall average in the entire school', position: 1 },
  { id: 'bs2', term: '1st Term', session: '2025/2026', category: 'Best Academic Student', studentName: 'Amina Bello', class: 'SS 2B', score: '96.2%', description: 'Second highest overall average', position: 2 },
  { id: 'bs3', term: '1st Term', session: '2025/2026', category: 'Best Academic Student', studentName: 'Toluwalope Adewale', class: 'SS 2A', score: '94.8%', description: 'Third highest overall average', position: 3 },
  { id: 'bs4', term: '1st Term', session: '2025/2026', category: 'Best Dressed Student', studentName: 'Ngozi Okafor', class: 'SS 2A', score: null, description: 'Always impeccably dressed, sets the standard for the school', position: 1 },
  { id: 'bs5', term: '1st Term', session: '2025/2026', category: 'Most Responsible Student', studentName: 'Emeka Eze', class: 'SS 2A', score: null, description: 'Demonstrated outstanding responsibility and leadership', position: 1 },
  { id: 'bs6', term: '1st Term', session: '2025/2026', category: 'Most Improved Student', studentName: 'Damilola Adewale', class: 'JSS 1B', score: null, description: 'Improved from 55% average to 78% average this term', position: 1 },
  { id: 'bs7', term: '1st Term', session: '2025/2026', category: 'Best in Sports', studentName: 'Segun Fadele', class: 'SS 1A', score: null, description: 'Outstanding performance in athletics and football', position: 1 },
];

export const BEST_STUDENT_CATEGORIES = [
  'Best Academic Student', 'Best Dressed Student', 'Most Responsible Student',
  'Most Improved Student', 'Best in Sports', 'Best in Arts', 'School Prefect of the Term',
];

// Seed conversations between school staff (admin/authority) and individual parents.
// Keyed by parent id; parents without an entry simply start with an empty thread.
export const PARENT_MESSAGES = {
  p1: [
    { id: 'm1', from: 'parent', text: 'Good afternoon, please I want to confirm the resumption date after the mid-term break.', time: '2026-06-04T09:12:00' },
    { id: 'm2', from: 'staff', text: 'Good afternoon Mrs. Adewale. School resumes on Monday, June 3rd. Kindly make appropriate arrangements.', time: '2026-06-04T09:20:00' },
    { id: 'm3', from: 'parent', text: 'Thank you very much. Noted.', time: '2026-06-04T09:22:00' },
  ],
  p3: [
    { id: 'm1', from: 'parent', text: 'Please can I get Ngozi\'s 2nd term exam timetable? Thank you.', time: '2026-06-02T10:00:00' },
    { id: 'm2', from: 'staff', text: 'Good morning Mr. Okafor. The full timetable has been uploaded to the school calendar section. Please check there.', time: '2026-06-02T10:35:00' },
  ],
};

export const ATTENDANCE_RECORDS = [
  { date: '2026-05-11', status: 'present' },
  { date: '2026-05-10', status: 'present' },
  { date: '2026-05-09', status: 'present' },
  { date: '2026-05-08', status: 'absent', reason: 'Sick leave' },
  { date: '2026-05-07', status: 'present' },
  { date: '2026-05-06', status: 'present' },
  { date: '2026-05-05', status: 'present' },
  { date: '2026-04-30', status: 'present' },
  { date: '2026-04-29', status: 'late', reason: 'Traffic' },
  { date: '2026-04-28', status: 'present' },
];

export const REPORT_CARDS = [
  {
    id: 'rc1', studentId: 's1', term: '1st Term', session: '2025/2026',
    subjects: [
      { name: 'Mathematics', score: 85, grade: 'A', remark: 'Excellent' },
      { name: 'English Language', score: 78, grade: 'B', remark: 'Good' },
      { name: 'Biology', score: 92, grade: 'A', remark: 'Outstanding' },
      { name: 'Chemistry', score: 75, grade: 'B', remark: 'Good' },
      { name: 'Physics', score: 88, grade: 'A', remark: 'Excellent' },
      { name: 'Economics', score: 82, grade: 'A', remark: 'Excellent' },
      { name: 'Government', score: 70, grade: 'C', remark: 'Average' },
      { name: 'Literature in English', score: 79, grade: 'B', remark: 'Good' },
    ],
    totalScore: 649, average: 81.1, position: 3, outOf: 45,
    principalRemark: 'An excellent and dedicated student. Continue the hard work!',
    teacherRemark: 'Toluwalope is a joy to teach. Encourage her to improve in Government.',
  },
];

export const FEE_RECORDS = {
  studentId: 's1', session: '2025/2026', totalFees: 85000, amountPaid: 60000,
  balance: 25000, dueDate: '2026-06-01',
  payments: [
    { id: 'pay1', amount: 40000, date: '2026-01-15', description: '1st Term Fees', receipt: 'REC-2026-001' },
    { id: 'pay2', amount: 20000, date: '2026-04-30', description: '2nd Term Partial Payment', receipt: 'REC-2026-002' },
  ],
};

// School bank account details shown to parents when paying school fees.
export const SCHOOL_ACCOUNT = {
  bankName: 'First Bank of Nigeria',
  accountName: 'River Bank Schools Ltd',
  accountNumber: '2034567891',
  sortCode: '011-152-303',
  reference: 'Use your child\'s admission number as the payment reference/narration.',
};

export const GALLERY_ALBUMS = [
  { id: 'g1', title: 'Annual Sports Day 2026', category: 'Sports', date: '2026-03-15', photoCount: 24, description: 'An exciting day of athletics and team competition.' },
  { id: 'g2', title: 'Prize Giving Day 2025', category: 'Awards', date: '2025-12-10', photoCount: 45, description: 'Celebrating outstanding achievers of the 2024/2025 session.' },
  { id: 'g3', title: 'Cultural Day Celebrations', category: 'Culture', date: '2026-02-28', photoCount: 38, description: 'Students showcasing Nigeria\'s rich cultural heritage.' },
  { id: 'g4', title: 'Science Fair 2026', category: 'Academics', date: '2026-03-05', photoCount: 19, description: 'Innovative science projects by our SS students.' },
  { id: 'g5', title: 'New Term Assembly', category: 'School Life', date: '2026-04-28', photoCount: 12, description: '2nd term opening assembly photos.' },
];

export const HEALTH_LOG = [
  { id: 'h1', studentId: 's1', date: '2026-04-22', complaint: 'Headache and mild fever', treatment: 'Paracetamol administered, student rested in sick bay for 2 hours', attendingStaff: 'Nurse Grace Okafor', status: 'Resolved', actionTaken: 'Parent notified via phone call' },
  { id: 'h2', studentId: 's1', date: '2026-03-14', complaint: 'Stomach ache during PE class', treatment: 'Student monitored, given water and allowed to rest', attendingStaff: 'Nurse Grace Okafor', status: 'Resolved', actionTaken: 'Student recovered fully within the hour' },
];

export const BROADCASTS = [
  { id: 'b1', from: 'Mrs. Fatima Abubakar', fromRole: 'authority', fromTitle: 'Principal', title: 'Important: Mid-Term Break Notice', message: 'Dear Parents, please be informed that mid-term break will commence on Friday, May 29th. School resumes on Monday, June 3rd. Kindly make appropriate arrangements for your children.', date: '2026-05-11T14:00:00', priority: 'high' },
  { id: 'b2', from: 'Mr. Taiwo Oladele', fromRole: 'admin', fromTitle: 'School Admin', title: 'Sports Day Invitation', message: 'Dear Parents, you are warmly invited to River Bank School\'s Annual Sports Day on May 25th, 2026, starting at 9 AM. Come and cheer your children to victory!', date: '2026-05-09T10:00:00', priority: 'normal' },
  { id: 'b3', from: 'Mrs. Fatima Abubakar', fromRole: 'authority', fromTitle: 'Principal', title: 'School Fee Reminder', message: 'This is a gentle reminder that all outstanding school fees should be cleared before the 2nd term examination begins on June 10th. Thank you for your cooperation.', date: '2026-05-05T09:00:00', priority: 'normal' },
];

export const SCHOOL_STATS = {
  totalStudents: 847,
  totalTeachers: 42,
  totalParents: 612,
  attendanceToday: '94%',
  classCount: 12,
};

export const ALL_PARENTS = [
  { id: 'p1', name: 'Mrs. Bukola Adewale', phone: '08012345678', email: 'bukola.adewale@email.com', children: ['Toluwalope Adewale (SS 2A)', 'Damilola Adewale (JSS 1B)'] },
  { id: 'p2', name: 'Mrs. Kehinde Nwankwo', phone: '08023456789', email: 'kehinde.nwankwo@email.com', children: ['Chidi Nwankwo (SS 3A)'] },
  { id: 'p3', name: 'Mr. Emeka Okafor', phone: '08034567890', email: 'emeka.okafor@email.com', children: ['Ngozi Okafor (SS 2A)'] },
  { id: 'p4', name: 'Mr. Biodun Eze', phone: '08045678901', email: 'biodun.eze@email.com', children: ['Emeka Eze (SS 2A)'] },
  { id: 'p5', name: 'Mrs. Hauwa Bello', phone: '08056789012', email: 'hauwa.bello@email.com', children: ['Amina Bello (SS 2B)'] },
];

export const INCIDENT_TYPES = [
  { key: 'fight', label: 'Physical Fight', icon: 'hand-left', color: '#E74C3C' },
  { key: 'misconduct', label: 'Misconduct', icon: 'warning', color: '#F39C12' },
  { key: 'bad_language', label: 'Bad Language', icon: 'chatbubble-ellipses', color: '#E67E22' },
  { key: 'injury', label: 'Injury', icon: 'medkit', color: '#E74C3C' },
  { key: 'late', label: 'Lateness', icon: 'time', color: '#2980B9' },
  { key: 'bullying', label: 'Bullying', icon: 'alert-circle', color: '#8E44AD' },
  { key: 'other', label: 'Other', icon: 'document-text', color: '#7F8C8D' },
];

/* =========================================================================
   STUDENT PROFILE DATA  (logged-in student = s1, Toluwalope Adewale, SS 2A)
   ========================================================================= */

// Assignments board — where students meet for & submit assignments.
export const STUDENT_ASSIGNMENTS = [
  { id: 'as1', subject: 'Mathematics', title: 'Quadratic Equations Worksheet', teacher: 'Mr. Obinna Chukwuma', description: 'Solve all 20 problems on quadratic equations using the formula and completing the square methods. Show all working.', assignedDate: '2026-06-15', dueDate: '2026-06-22', status: 'pending', maxScore: 20 },
  { id: 'as2', subject: 'Biology', title: 'Osmosis & Diffusion Report', teacher: 'Mr. Seun Ogunleye', description: 'Write a 1-page lab report on the osmosis experiment carried out in class. Include diagrams.', assignedDate: '2026-06-14', dueDate: '2026-06-20', status: 'pending', maxScore: 15 },
  { id: 'as3', subject: 'English Language', title: 'Argumentative Essay', teacher: 'Mrs. Ngozi Adeyemi', description: 'Write a 450-word argumentative essay on "Social media does more harm than good".', assignedDate: '2026-06-10', dueDate: '2026-06-17', status: 'submitted', submittedDate: '2026-06-16', maxScore: 25 },
  { id: 'as4', subject: 'Chemistry', title: 'Periodic Table Quiz Prep', teacher: 'Mrs. Funke Bello', description: 'Complete the periodic table assignment sheet — groups, periods and properties.', assignedDate: '2026-06-05', dueDate: '2026-06-12', status: 'graded', submittedDate: '2026-06-11', score: 18, maxScore: 20, feedback: 'Very good work. Revise transition metals.' },
  { id: 'as5', subject: 'Physics', title: 'Newton\'s Laws Problems', teacher: 'Mr. Tunde Bakare', description: 'Answer questions 1-10 on Newton\'s three laws of motion.', assignedDate: '2026-06-02', dueDate: '2026-06-09', status: 'graded', submittedDate: '2026-06-08', score: 22, maxScore: 25, feedback: 'Excellent understanding of the concepts.' },
];

// Online tests & exams the student can take remotely.
export const STUDENT_TESTS = [
  { id: 'ts1', subject: 'Mathematics', title: 'Algebra Continuous Assessment', type: 'test', duration: 30, totalQuestions: 15, openDate: '2026-06-19', dueDate: '2026-06-21', status: 'available', maxScore: 15 },
  { id: 'ts2', subject: 'Government', title: 'Constitution & Democracy Quiz', type: 'test', duration: 20, totalQuestions: 10, openDate: '2026-06-19', dueDate: '2026-06-20', status: 'available', maxScore: 10 },
  { id: 'ts3', subject: 'English Language', title: '2nd Term Examination', type: 'exam', duration: 90, totalQuestions: 50, openDate: '2026-06-25', dueDate: '2026-06-25', status: 'upcoming', maxScore: 100 },
  { id: 'ts4', subject: 'Biology', title: 'Cell Biology Test', type: 'test', duration: 25, totalQuestions: 12, openDate: '2026-06-08', dueDate: '2026-06-10', status: 'completed', score: 11, maxScore: 12 },
  { id: 'ts5', subject: 'Chemistry', title: 'Mid-Term Test', type: 'test', duration: 40, totalQuestions: 20, openDate: '2026-05-28', dueDate: '2026-05-30', status: 'completed', score: 17, maxScore: 20 },
];

// Sample questions used by the remote test-taking screen (multiple choice).
export const SAMPLE_TEST_QUESTIONS = [
  { id: 'q1', question: 'What is the value of x in 2x + 6 = 14?', options: ['2', '4', '6', '8'], answer: 1 },
  { id: 'q2', question: 'Which of these is a quadratic equation?', options: ['x + 2 = 0', 'x² - 5x + 6 = 0', '3x = 9', '2x - 1 = 7'], answer: 1 },
  { id: 'q3', question: 'The roots of x² - 4 = 0 are?', options: ['±2', '±4', '0 and 4', '2 only'], answer: 0 },
  { id: 'q4', question: 'Simplify: (x²)³', options: ['x⁵', 'x⁶', 'x⁹', 'x⁸'], answer: 1 },
  { id: 'q5', question: 'If y = 3x and x = 5, find y.', options: ['8', '15', '35', '53'], answer: 1 },
];

// Consolidated marks: tests, exams and assignments.
export const STUDENT_MARKS = [
  { id: 'mk1', subject: 'Physics', assessment: 'Newton\'s Laws Problems', type: 'assignment', score: 22, maxScore: 25, date: '2026-06-08', term: '2nd Term' },
  { id: 'mk2', subject: 'Chemistry', assessment: 'Periodic Table Assignment', type: 'assignment', score: 18, maxScore: 20, date: '2026-06-11', term: '2nd Term' },
  { id: 'mk3', subject: 'Biology', assessment: 'Cell Biology Test', type: 'test', score: 11, maxScore: 12, date: '2026-06-10', term: '2nd Term' },
  { id: 'mk4', subject: 'Chemistry', assessment: 'Mid-Term Test', type: 'test', score: 17, maxScore: 20, date: '2026-05-30', term: '2nd Term' },
  { id: 'mk5', subject: 'Mathematics', assessment: 'Mid-Term Test', type: 'test', score: 38, maxScore: 40, date: '2026-05-29', term: '2nd Term' },
  { id: 'mk6', subject: 'Mathematics', assessment: '1st Term Examination', type: 'exam', score: 85, maxScore: 100, date: '2025-12-05', term: '1st Term' },
  { id: 'mk7', subject: 'Biology', assessment: '1st Term Examination', type: 'exam', score: 92, maxScore: 100, date: '2025-12-06', term: '1st Term' },
  { id: 'mk8', subject: 'English Language', assessment: '1st Term Examination', type: 'exam', score: 78, maxScore: 100, date: '2025-12-04', term: '1st Term' },
];

// Term topics — completed vs missed, each with class notes.
export const STUDENT_TOPICS = [
  { id: 'tp1', subject: 'Mathematics', topic: 'Quadratic Equations', week: 'Week 1', date: '2026-04-29', status: 'completed', notes: 'A quadratic equation has the form ax² + bx + c = 0. Solve by factorisation, completing the square, or the quadratic formula x = (-b ± √(b²-4ac)) / 2a. The discriminant b²-4ac tells the nature of the roots.' },
  { id: 'tp2', subject: 'Mathematics', topic: 'Simultaneous Equations', week: 'Week 2', date: '2026-05-06', status: 'completed', notes: 'Two equations solved together. Methods: substitution and elimination. One linear + one quadratic is solved by substitution.' },
  { id: 'tp3', subject: 'Biology', topic: 'Cell Structure', week: 'Week 1', date: '2026-04-30', status: 'completed', notes: 'Cells are the basic unit of life. Plant cells have a cell wall, chloroplasts and a large vacuole; animal cells do not. The nucleus controls all cell activities.' },
  { id: 'tp4', subject: 'Biology', topic: 'Osmosis & Diffusion', week: 'Week 3', date: '2026-05-13', status: 'missed', notes: 'Diffusion: movement of particles from high to low concentration. Osmosis: movement of water across a semi-permeable membrane from high to low water potential. Review the practical diagram in the textbook p.84.' },
  { id: 'tp5', subject: 'Chemistry', topic: 'The Periodic Table', week: 'Week 2', date: '2026-05-07', status: 'completed', notes: 'Elements arranged by increasing atomic number. Vertical columns = groups (same valence electrons); horizontal rows = periods. Metals on the left, non-metals on the right.' },
  { id: 'tp6', subject: 'Physics', topic: 'Newton\'s Laws of Motion', week: 'Week 2', date: '2026-05-08', status: 'completed', notes: '1st law: an object stays at rest/uniform motion unless acted on by a force. 2nd law: F = ma. 3rd law: every action has an equal and opposite reaction.' },
  { id: 'tp7', subject: 'English Language', topic: 'Argumentative Essays', week: 'Week 3', date: '2026-05-12', status: 'missed', notes: 'Structure: introduction (state your stand), body (points + evidence), conclusion. Use connectives: furthermore, however, in addition. Maintain a formal tone.' },
];

// Live & scheduled online classes the student can join.
export const STUDENT_LIVE_CLASSES = [
  { id: 'lc1', subject: 'Mathematics', title: 'Revision: Quadratic Equations', teacher: 'Mr. Obinna Chukwuma', startTime: '2026-06-19T10:00:00', duration: 45, status: 'live', meetingId: 'RBS-MATH-2A-01' },
  { id: 'lc2', subject: 'Biology', title: 'Osmosis Catch-up Class', teacher: 'Mr. Seun Ogunleye', startTime: '2026-06-19T13:00:00', duration: 40, status: 'upcoming', meetingId: 'RBS-BIO-2A-04' },
  { id: 'lc3', subject: 'English Language', title: 'Exam Prep Workshop', teacher: 'Mrs. Ngozi Adeyemi', startTime: '2026-06-20T09:00:00', duration: 60, status: 'upcoming', meetingId: 'RBS-ENG-2A-02' },
  { id: 'lc4', subject: 'Chemistry', title: 'Periodic Table Q&A', teacher: 'Mrs. Funke Bello', startTime: '2026-06-17T11:00:00', duration: 45, status: 'ended', meetingId: 'RBS-CHM-2A-03', recordingAvailable: true },
];

// Weekly timetable for the student's class.
export const STUDENT_TIMETABLE = [
  { day: 'Monday', periods: [
    { time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Obinna Chukwuma' },
    { time: '08:45 - 09:30', subject: 'English Language', teacher: 'Mrs. Ngozi Adeyemi' },
    { time: '09:30 - 10:15', subject: 'Biology', teacher: 'Mr. Seun Ogunleye' },
    { time: '10:45 - 11:30', subject: 'Chemistry', teacher: 'Mrs. Funke Bello' },
  ] },
  { day: 'Tuesday', periods: [
    { time: '08:00 - 08:45', subject: 'Physics', teacher: 'Mr. Tunde Bakare' },
    { time: '08:45 - 09:30', subject: 'Mathematics', teacher: 'Mr. Obinna Chukwuma' },
    { time: '09:30 - 10:15', subject: 'Government', teacher: 'Mr. Kola Smith' },
    { time: '10:45 - 11:30', subject: 'Economics', teacher: 'Mrs. Aisha Yusuf' },
  ] },
  { day: 'Wednesday', periods: [
    { time: '08:00 - 08:45', subject: 'Biology', teacher: 'Mr. Seun Ogunleye' },
    { time: '08:45 - 09:30', subject: 'Chemistry', teacher: 'Mrs. Funke Bello' },
    { time: '09:30 - 10:15', subject: 'English Language', teacher: 'Mrs. Ngozi Adeyemi' },
    { time: '10:45 - 11:30', subject: 'Physics', teacher: 'Mr. Tunde Bakare' },
  ] },
  { day: 'Thursday', periods: [
    { time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Mr. Obinna Chukwuma' },
    { time: '08:45 - 09:30', subject: 'Literature in English', teacher: 'Mrs. Ngozi Adeyemi' },
    { time: '09:30 - 10:15', subject: 'Economics', teacher: 'Mrs. Aisha Yusuf' },
    { time: '10:45 - 11:30', subject: 'Government', teacher: 'Mr. Kola Smith' },
  ] },
  { day: 'Friday', periods: [
    { time: '08:00 - 08:45', subject: 'Chemistry', teacher: 'Mrs. Funke Bello' },
    { time: '08:45 - 09:30', subject: 'Physics', teacher: 'Mr. Tunde Bakare' },
    { time: '09:30 - 10:15', subject: 'Biology', teacher: 'Mr. Seun Ogunleye' },
    { time: '10:45 - 11:30', subject: 'Physical Education', teacher: 'Coach Audu' },
  ] },
];

// Downloadable learning resources / library.
export const STUDENT_RESOURCES = [
  { id: 'rs1', subject: 'Mathematics', title: 'Quadratic Equations — Class Notes', type: 'pdf', size: '1.2 MB', date: '2026-05-02' },
  { id: 'rs2', subject: 'Biology', title: 'Cell Structure Slides', type: 'slides', size: '3.4 MB', date: '2026-05-01' },
  { id: 'rs3', subject: 'Chemistry', title: 'Periodic Table Reference Sheet', type: 'pdf', size: '780 KB', date: '2026-05-07' },
  { id: 'rs4', subject: 'Physics', title: 'Newton\'s Laws — Recorded Lesson', type: 'video', size: '64 MB', date: '2026-05-08' },
  { id: 'rs5', subject: 'English Language', title: 'Essay Writing Guide', type: 'pdf', size: '540 KB', date: '2026-05-12' },
];

// Student's own attendance summary for the term.
export const STUDENT_ATTENDANCE_SUMMARY = {
  present: 38, absent: 2, late: 3, total: 43,
  percentage: 88,
};

/* =========================================================================
   LIVE CLASSES + VOICE-TO-NOTES (teacher hosting & speech-to-text)
   ========================================================================= */

// Lessons a teacher can host / has hosted for their classes (children at home join).
export const TEACHER_LIVE_CLASSES = [
  { id: 'tlc1', subject: 'Mathematics', title: 'Revision: Quadratic Equations', className: 'SS 2A', duration: 45, status: 'live', meetingId: 'RBS-MATH-2A-01', startTime: '2026-06-19T10:00:00', joined: 18 },
  { id: 'tlc2', subject: 'Mathematics', title: 'Simultaneous Equations Practice', className: 'SS 2B', duration: 45, status: 'upcoming', meetingId: 'RBS-MATH-2B-02', startTime: '2026-06-19T13:00:00', joined: 0 },
  { id: 'tlc3', subject: 'Further Mathematics', title: 'Binomial Expansion Q&A', className: 'SS 3A', duration: 60, status: 'upcoming', meetingId: 'RBS-FMATH-3A-01', startTime: '2026-06-20T09:00:00', joined: 0 },
  { id: 'tlc4', subject: 'Mathematics', title: 'Trigonometry Catch-up', className: 'SS 2A', duration: 40, status: 'ended', meetingId: 'RBS-MATH-2A-00', startTime: '2026-06-17T11:00:00', joined: 21, recordingAvailable: true },
];

// Sample speech-to-text transcript lines, streamed in one-by-one to simulate a
// live voice listener. `key: true` lines are treated as the important takeaways
// used to build the auto-summary. Keyed by subject with a generic fallback.
export const LESSON_TRANSCRIPTS = {
  Mathematics: [
    { text: 'Good morning everyone, today we are revising quadratic equations.' },
    { text: 'A quadratic equation is any equation that can be written in the form a x squared plus b x plus c equals zero.', key: true },
    { text: 'The letter a must not be zero, otherwise it becomes a linear equation.', key: true },
    { text: 'There are three main methods we use to solve them.' },
    { text: 'First method is factorisation, where we express the quadratic as a product of two brackets.', key: true },
    { text: 'Second method is completing the square, which is useful when factorisation is difficult.', key: true },
    { text: 'The third and most general method is the quadratic formula.', key: true },
    { text: 'The quadratic formula is x equals negative b plus or minus the square root of b squared minus four a c, all divided by two a.', key: true },
    { text: 'Please make sure you memorise this formula for the examination.' },
    { text: 'The expression b squared minus four a c is called the discriminant.', key: true },
    { text: 'If the discriminant is positive, we have two different real roots.', key: true },
    { text: 'If it is zero, we have one repeated root, and if it is negative there are no real roots.', key: true },
    { text: 'For your assignment, solve questions one to ten using the method of your choice.', key: true },
    { text: 'That is all for today, please revise before our next class.' },
  ],
  Biology: [
    { text: 'Today we continue with osmosis and diffusion.' },
    { text: 'Diffusion is the movement of particles from a region of high concentration to low concentration.', key: true },
    { text: 'Osmosis is the movement of water molecules across a semi-permeable membrane.', key: true },
    { text: 'Water moves from a region of high water potential to low water potential.', key: true },
    { text: 'Remember, osmosis only involves water, while diffusion can involve any particle.', key: true },
    { text: 'A good example is a plant cell placed in salty water losing water and becoming flaccid.', key: true },
    { text: 'For homework, draw and label the osmosis practical diagram on page eighty four.', key: true },
  ],
  default: [
    { text: 'Good morning class, let us begin today\'s lesson.' },
    { text: 'Please pay attention as we go through the key concepts for this topic.', key: true },
    { text: 'Make sure you write down the important definitions in your notebook.', key: true },
    { text: 'We will do a short recap of what we covered in the previous lesson.' },
    { text: 'The main idea to remember from today is how these concepts connect together.', key: true },
    { text: 'Please complete the exercises given and submit before the next class.', key: true },
    { text: 'That brings us to the end of today\'s lesson, well done everyone.' },
  ],
};

// Transcribed class notes already sent to students (student inbox). Newest first.
export const CLASS_NOTES = [
  {
    id: 'cn1', subject: 'Mathematics', topic: 'Quadratic Equations Revision',
    teacher: 'Mr. Obinna Chukwuma', className: 'SS 2A', date: '2026-06-17T11:45:00',
    summary: 'This lesson revised quadratic equations of the form ax² + bx + c = 0. The class covered the three solution methods — factorisation, completing the square and the quadratic formula — and how the discriminant (b²−4ac) determines the number and nature of the roots.',
    keyPoints: [
      'A quadratic equation has the form ax² + bx + c = 0, where a ≠ 0.',
      'Three solving methods: factorisation, completing the square, quadratic formula.',
      'Quadratic formula: x = (−b ± √(b²−4ac)) / 2a.',
      'The discriminant b²−4ac tells the nature of the roots (2 real, 1 repeated, or none).',
    ],
    transcript: 'Good morning everyone, today we are revising quadratic equations. A quadratic equation is any equation that can be written in the form ax² + bx + c = 0, where a is not zero. There are three main methods we use to solve them: factorisation, completing the square, and the quadratic formula. The quadratic formula is x = (−b ± √(b²−4ac)) / 2a — please memorise it. The expression b²−4ac is the discriminant: positive gives two real roots, zero gives one repeated root, and negative gives no real roots.',
  },
  {
    id: 'cn2', subject: 'Biology', topic: 'Osmosis & Diffusion',
    teacher: 'Mr. Seun Ogunleye', className: 'SS 2A', date: '2026-06-16T10:20:00',
    summary: 'This lesson explained diffusion and osmosis. Diffusion is the movement of particles from high to low concentration, while osmosis is specifically the movement of water across a semi-permeable membrane from high to low water potential.',
    keyPoints: [
      'Diffusion moves particles from a region of high concentration to low concentration.',
      'Osmosis is the movement of water across a semi-permeable membrane.',
      'In osmosis water moves from high water potential to low water potential.',
      'Osmosis involves only water; diffusion can involve any particle.',
    ],
    transcript: 'Today we continue with osmosis and diffusion. Diffusion is the movement of particles from a region of high concentration to low concentration. Osmosis is the movement of water molecules across a semi-permeable membrane, from a region of high water potential to low water potential. Remember, osmosis only involves water, while diffusion can involve any particle. A plant cell placed in salty water loses water and becomes flaccid.',
  },
  {
    id: 'cn3', subject: 'Chemistry', topic: 'The Periodic Table',
    teacher: 'Mrs. Funke Bello', className: 'SS 2A', date: '2026-06-15T09:10:00',
    summary: 'This lesson covered how the periodic table is organised: elements are arranged by increasing atomic number, vertical columns are groups sharing valence electrons, and horizontal rows are periods.',
    keyPoints: [
      'Elements are arranged in order of increasing atomic number.',
      'Vertical columns are called groups and share the same number of valence electrons.',
      'Horizontal rows are called periods.',
      'Metals are on the left, non-metals on the right.',
    ],
    transcript: 'Today we look at the periodic table. Elements are arranged in order of increasing atomic number. The vertical columns are called groups, and elements in the same group have the same number of valence electrons. The horizontal rows are called periods. Metals are found on the left side, while non-metals are found on the right side.',
  },
  {
    id: 'cn4', subject: 'Physics', topic: "Newton's Laws of Motion",
    teacher: 'Mr. Tunde Bakare', className: 'SS 2A', date: '2026-06-13T11:30:00',
    summary: "This lesson introduced Newton's three laws of motion, including the law of inertia, the relationship F = ma, and the action–reaction principle.",
    keyPoints: [
      "Newton's first law: an object stays at rest or in uniform motion unless acted on by a force.",
      "Newton's second law: force equals mass times acceleration (F = ma).",
      "Newton's third law: every action has an equal and opposite reaction.",
    ],
    transcript: "Today we cover Newton's laws of motion. The first law states that an object remains at rest or in uniform motion unless acted upon by an external force — this is called inertia. The second law states that force equals mass times acceleration, F = ma. The third law states that for every action there is an equal and opposite reaction.",
  },
];

/* Notes-derived CBT question bank. The student practice quiz assembles its 20
   questions from the entries whose topic appears in the notes captured so far
   (CLASS_NOTES + the student's own STUDENT_TOPICS). Each item: 4 options and the
   index of the correct answer. */
export const NOTES_QUESTION_BANK = [
  // Mathematics — Quadratic Equations
  { id: 'nq1', subject: 'Mathematics', topic: 'Quadratic Equations', question: 'What is the general form of a quadratic equation?', options: ['ax + b = 0', 'ax² + bx + c = 0', 'a/x + b = c', 'ax³ + bx + c = 0'], answer: 1 },
  { id: 'nq2', subject: 'Mathematics', topic: 'Quadratic Equations', question: 'In a quadratic equation ax² + bx + c = 0, which value can a NOT be?', options: ['0', '1', '−1', 'Any positive number'], answer: 0 },
  { id: 'nq3', subject: 'Mathematics', topic: 'Quadratic Equations', question: 'Which of these is a method for solving quadratic equations?', options: ['Long division', 'Completing the square', 'Cross multiplication', 'Interpolation'], answer: 1 },
  { id: 'nq4', subject: 'Mathematics', topic: 'Quadratic Equations', question: 'The expression b² − 4ac is known as the…', options: ['Coefficient', 'Discriminant', 'Root', 'Factor'], answer: 1 },
  { id: 'nq5', subject: 'Mathematics', topic: 'Quadratic Equations', question: 'If the discriminant is zero, the equation has…', options: ['Two different real roots', 'One repeated root', 'No real roots', 'Three roots'], answer: 1 },
  { id: 'nq6', subject: 'Mathematics', topic: 'Quadratic Equations', question: 'A negative discriminant means the equation has…', options: ['Two real roots', 'One real root', 'No real roots', 'Infinite roots'], answer: 2 },
  { id: 'nq7', subject: 'Mathematics', topic: 'Simultaneous Equations', question: 'Which methods are used to solve simultaneous equations?', options: ['Substitution and elimination', 'Addition only', 'Guessing', 'Factorisation'], answer: 0 },
  { id: 'nq8', subject: 'Mathematics', topic: 'Simultaneous Equations', question: 'A linear and a quadratic equation are best solved together by…', options: ['Elimination', 'Substitution', 'Division', 'Rounding'], answer: 1 },

  // Biology — Cell Structure & Osmosis
  { id: 'nq9', subject: 'Biology', topic: 'Osmosis & Diffusion', question: 'Diffusion is the movement of particles from…', options: ['Low to high concentration', 'High to low concentration', 'Equal regions', 'Solid to liquid'], answer: 1 },
  { id: 'nq10', subject: 'Biology', topic: 'Osmosis & Diffusion', question: 'Osmosis is the movement of which substance across a semi-permeable membrane?', options: ['Salt', 'Water', 'Oxygen', 'Glucose'], answer: 1 },
  { id: 'nq11', subject: 'Biology', topic: 'Osmosis & Diffusion', question: 'In osmosis, water moves from…', options: ['Low to high water potential', 'High to low water potential', 'Cold to hot', 'Cell to nucleus'], answer: 1 },
  { id: 'nq12', subject: 'Biology', topic: 'Osmosis & Diffusion', question: 'Which process involves ONLY water?', options: ['Diffusion', 'Osmosis', 'Respiration', 'Digestion'], answer: 1 },
  { id: 'nq13', subject: 'Biology', topic: 'Cell Structure', question: 'Which structure is found in plant cells but NOT animal cells?', options: ['Nucleus', 'Cell wall', 'Cytoplasm', 'Cell membrane'], answer: 1 },
  { id: 'nq14', subject: 'Biology', topic: 'Cell Structure', question: 'Which part of the cell controls all its activities?', options: ['Vacuole', 'Nucleus', 'Cell wall', 'Chloroplast'], answer: 1 },

  // Chemistry — Periodic Table
  { id: 'nq15', subject: 'Chemistry', topic: 'The Periodic Table', question: 'Elements in the periodic table are arranged by increasing…', options: ['Mass number', 'Atomic number', 'Density', 'Melting point'], answer: 1 },
  { id: 'nq16', subject: 'Chemistry', topic: 'The Periodic Table', question: 'The vertical columns of the periodic table are called…', options: ['Periods', 'Groups', 'Rows', 'Shells'], answer: 1 },
  { id: 'nq17', subject: 'Chemistry', topic: 'The Periodic Table', question: 'The horizontal rows of the periodic table are called…', options: ['Groups', 'Periods', 'Families', 'Blocks'], answer: 1 },
  { id: 'nq18', subject: 'Chemistry', topic: 'The Periodic Table', question: 'Elements in the same group have the same number of…', options: ['Neutrons', 'Valence electrons', 'Protons', 'Isotopes'], answer: 1 },
  { id: 'nq19', subject: 'Chemistry', topic: 'The Periodic Table', question: 'Where are metals generally found on the periodic table?', options: ['On the right', 'On the left', 'At the bottom', 'In the centre only'], answer: 1 },

  // Physics — Newton's Laws
  { id: 'nq20', subject: 'Physics', topic: "Newton's Laws of Motion", question: "Newton's first law is also known as the law of…", options: ['Gravity', 'Inertia', 'Momentum', 'Energy'], answer: 1 },
  { id: 'nq21', subject: 'Physics', topic: "Newton's Laws of Motion", question: "Newton's second law is expressed by which formula?", options: ['E = mc²', 'F = ma', 'V = IR', 'P = mv'], answer: 1 },
  { id: 'nq22', subject: 'Physics', topic: "Newton's Laws of Motion", question: "Newton's third law states that every action has an…", options: ['Unequal reaction', 'Equal and opposite reaction', 'Opposite but larger reaction', 'Delayed reaction'], answer: 1 },
  { id: 'nq23', subject: 'Physics', topic: "Newton's Laws of Motion", question: 'An object stays at rest unless acted upon by a…', options: ['Light', 'Force', 'Sound', 'Temperature'], answer: 1 },

  // English — Argumentative Essays
  { id: 'nq24', subject: 'English Language', topic: 'Argumentative Essays', question: 'What should the introduction of an argumentative essay do?', options: ['Give the conclusion', 'State your stand', 'List references', 'Tell a story'], answer: 1 },
  { id: 'nq25', subject: 'English Language', topic: 'Argumentative Essays', question: 'Which tone is appropriate for an argumentative essay?', options: ['Casual', 'Formal', 'Humorous', 'Poetic'], answer: 1 },
  { id: 'nq26', subject: 'English Language', topic: 'Argumentative Essays', question: 'Which of these is a connective used in essays?', options: ['Furthermore', 'Because why', 'Gonna', 'Yeah'], answer: 0 },
];
