import React, { createContext, useContext, useState, useCallback } from 'react';
import { FEE_RECORDS, STUDENTS } from '../constants/mockData';

/**
 * Shared fee state so the parent, admin (bursary) and any other role stay in
 * sync during a session.
 *
 * Flow:
 *   1. Parent transfers to the school account, uploads a receipt and submits a
 *      payment → it lands in `pendingPayments` with status "pending".
 *   2. Admin sees it in the Payment Confirmations queue and taps Confirm →
 *      the amount is deducted from that student's outstanding balance and the
 *      payment is added to the student's confirmed payment history.
 *      (Or Decline → status "declined", nothing deducted.)
 *
 * In a real app this would be backend-persisted; here it lives in React state.
 */

const FeesContext = createContext(null);

const DEFAULT_TOTAL = 85000;
const DEFAULT_SESSION = '2025/2026';

function seedRecords() {
  const map = {};
  map[FEE_RECORDS.studentId] = { ...FEE_RECORDS, payments: [...FEE_RECORDS.payments] };
  return map;
}

let seq = 100;
const nextId = () => `pay-${++seq}`;

export function FeesProvider({ children }) {
  const [records, setRecords] = useState(seedRecords);       // keyed by studentId
  const [pendingPayments, setPendingPayments] = useState([]); // awaiting/actioned by admin

  // Return the fee record for a student, generating a sensible default if the
  // student has none seeded yet.
  const getFeeRecord = useCallback((studentId) => {
    if (records[studentId]) return records[studentId];
    return { studentId, session: DEFAULT_SESSION, totalFees: DEFAULT_TOTAL, amountPaid: 0, balance: DEFAULT_TOTAL, dueDate: '2026-06-01', payments: [] };
  }, [records]);

  // Parent submits a payment for confirmation.
  const submitPayment = useCallback(({ studentId, amount, receiptUri, receiptName, note }) => {
    const student = STUDENTS.find((s) => s.id === studentId);
    const payment = {
      id: nextId(),
      studentId,
      studentName: student?.name || 'Student',
      admissionNo: student?.admissionNo || '',
      className: student?.class || '',
      amount,
      receiptUri,
      receiptName: receiptName || 'receipt.jpg',
      note: note || '',
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    setPendingPayments((prev) => [payment, ...prev]);
    return payment;
  }, []);

  // Admin confirms → deduct from balance and append to confirmed history.
  const confirmPayment = useCallback((paymentId, confirmedBy = 'School Bursary') => {
    setPendingPayments((prev) => {
      const p = prev.find((x) => x.id === paymentId);
      if (!p || p.status !== 'pending') return prev;

      setRecords((recs) => {
        const rec = recs[p.studentId] || getFeeRecord(p.studentId);
        const amountPaid = rec.amountPaid + p.amount;
        const balance = Math.max(0, rec.totalFees - amountPaid);
        const confirmed = {
          id: p.id,
          amount: p.amount,
          date: new Date().toISOString().slice(0, 10),
          description: p.note || 'Fee payment',
          receipt: `REC-${p.id.toUpperCase()}`,
        };
        return { ...recs, [p.studentId]: { ...rec, amountPaid, balance, payments: [confirmed, ...rec.payments] } };
      });

      return prev.map((x) => (x.id === paymentId ? { ...x, status: 'confirmed', actionedAt: new Date().toISOString(), confirmedBy } : x));
    });
  }, [getFeeRecord]);

  const declinePayment = useCallback((paymentId, reason = '') => {
    setPendingPayments((prev) => prev.map((x) => (x.id === paymentId ? { ...x, status: 'declined', actionedAt: new Date().toISOString(), declineReason: reason } : x)));
  }, []);

  const pendingCount = pendingPayments.filter((p) => p.status === 'pending').length;

  return (
    <FeesContext.Provider value={{ records, pendingPayments, pendingCount, getFeeRecord, submitPayment, confirmPayment, declinePayment }}>
      {children}
    </FeesContext.Provider>
  );
}

export const useFees = () => useContext(FeesContext);
