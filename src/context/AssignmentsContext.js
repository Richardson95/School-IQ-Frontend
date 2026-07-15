import React, { createContext, useContext, useState, useCallback } from 'react';
import { STUDENT_ASSIGNMENTS, STUDENTS } from '../constants/mockData';

/**
 * Shared assignments store so the student's submission (including any uploaded
 * file) becomes visible to the teacher.
 *
 * Flow:
 *   - Student downloads the assignment brief, works on it, then submits a written
 *     answer and/or an uploaded file.
 *   - The submission is stored here; the teacher's submissions screen reads it and
 *     can download exactly what the student uploaded.
 *
 * Seeded from STUDENT_ASSIGNMENTS (which belong to student s1) so there is history
 * to show. Session-only in memory.
 */

const CbtOwner = STUDENTS[0]; // the demo logged-in student these assignments belong to

const AssignmentsContext = createContext(null);

function seed() {
  return STUDENT_ASSIGNMENTS.map((a) => ({
    ...a,
    studentId: CbtOwner.id,
    studentName: CbtOwner.name,
    // Normalise a submission object for already submitted/graded items.
    submission: (a.status === 'submitted' || a.status === 'graded')
      ? { answer: a.answer || '(submitted earlier)', fileUri: null, fileName: null, submittedDate: a.submittedDate }
      : null,
  }));
}

export function AssignmentsProvider({ children }) {
  const [assignments, setAssignments] = useState(seed);

  const submitAssignment = useCallback((id, { answer, fileUri, fileName }) => {
    const date = new Date().toISOString().slice(0, 10);
    setAssignments((prev) => prev.map((a) => (
      a.id === id
        ? { ...a, status: 'submitted', submittedDate: date, submission: { answer, fileUri, fileName, submittedDate: date } }
        : a
    )));
  }, []);

  // Everything a teacher can review (has a submission).
  const submissions = assignments.filter((a) => a.submission);

  return (
    <AssignmentsContext.Provider value={{ assignments, submitAssignment, submissions }}>
      {children}
    </AssignmentsContext.Provider>
  );
}

export const useAssignments = () => useContext(AssignmentsContext);
