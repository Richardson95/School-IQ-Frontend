import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Store for self-practice CBT results generated from class notes.
 *
 * When a student finishes a notes practice quiz, the result is recorded here and
 * becomes visible to that student's parent — kept deliberately SEPARATE from the
 * teacher-authored test/exam results, so parents can tell "practice from notes"
 * apart from official assessments.
 *
 * Session-only (in memory); a real app would persist these to a backend.
 */

const CbtContext = createContext(null);

let seq = 0;
const nextId = () => `cbt-${Date.now()}-${++seq}`;

export function CbtProvider({ children }) {
  const [results, setResults] = useState([]); // newest first

  const addResult = useCallback((result) => {
    const entry = { id: nextId(), takenAt: new Date().toISOString(), ...result };
    setResults((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const resultsForStudent = useCallback((studentId) => results.filter((r) => r.studentId === studentId), [results]);
  const resultsForChildren = useCallback((childIds = []) => results.filter((r) => childIds.includes(r.studentId)), [results]);

  return (
    <CbtContext.Provider value={{ results, addResult, resultsForStudent, resultsForChildren }}>
      {children}
    </CbtContext.Provider>
  );
}

export const useCbt = () => useContext(CbtContext);
