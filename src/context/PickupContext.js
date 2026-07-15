import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Third-party pickup alerts.
 *
 * When the usual guardian can't collect a student, the parent submits a pickup
 * request with the person's photo, name and relationship to the child. The
 * request is broadcast to ALL staff profiles — authority, teachers and admin —
 * so whoever is at the gate can verify. Students never see these.
 *
 * Session-only in-memory store (a real app would persist + push-notify).
 */

const PickupContext = createContext(null);

let seq = 0;
const nextId = () => `pk-${Date.now()}-${++seq}`;

export function PickupProvider({ children }) {
  const [requests, setRequests] = useState([]); // newest first

  const addRequest = useCallback((req) => {
    const entry = {
      id: nextId(),
      createdAt: new Date().toISOString(),
      status: 'active',       // active → acknowledged
      acknowledgedBy: null,   // { role, name, at }
      ...req,
    };
    setRequests((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const acknowledge = useCallback((id, by) => {
    setRequests((prev) => prev.map((r) => (
      r.id === id && r.status === 'active'
        ? { ...r, status: 'acknowledged', acknowledgedBy: { ...by, at: new Date().toISOString() } }
        : r
    )));
  }, []);

  const activeCount = requests.filter((r) => r.status === 'active').length;

  return (
    <PickupContext.Provider value={{ requests, addRequest, acknowledge, activeCount }}>
      {children}
    </PickupContext.Provider>
  );
}

export const usePickup = () => useContext(PickupContext);
