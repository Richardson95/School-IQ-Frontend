/**
 * Builds a practice CBT from the class notes captured so far.
 *
 * "Notes captured so far" = the transcribed CLASS_NOTES plus the student's own
 * STUDENT_TOPICS. We collect the topics present there and pull matching
 * questions from NOTES_QUESTION_BANK, so the quiz always reflects what has
 * actually been taught/transcribed. Options are shuffled per question so the
 * correct answer isn't always in the same position.
 */
import { CLASS_NOTES, STUDENT_TOPICS, NOTES_QUESTION_BANK } from '../constants/mockData';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Topics the student has notes for right now.
export function coveredTopics() {
  const set = new Set();
  CLASS_NOTES.forEach((n) => set.add(n.topic));
  STUDENT_TOPICS.forEach((t) => set.add(t.topic));
  return set;
}

// Shuffle a question's options and keep the correct answer index in sync.
function randomiseOptions(q) {
  const correct = q.options[q.answer];
  const options = shuffle(q.options);
  return { ...q, options, answer: options.indexOf(correct) };
}

export function generateQuizFromNotes(count = 20) {
  const topics = coveredTopics();
  const fromNotes = NOTES_QUESTION_BANK.filter((q) => topics.has(q.topic));

  // Prefer questions tied to captured notes; top up from the rest if needed.
  let pool = shuffle(fromNotes);
  if (pool.length < count) {
    const rest = shuffle(NOTES_QUESTION_BANK.filter((q) => !topics.has(q.topic)));
    pool = [...pool, ...rest];
  }

  return pool.slice(0, count).map(randomiseOptions);
}

// Map a percentage to the three rating bands the parent report shows.
export function ratingFor(pct) {
  if (pct >= 80) return { label: 'Excellent', color: '#059669', bg: '#D1FAE5', icon: 'trophy' };
  if (pct >= 50) return { label: 'Good', color: '#D97706', bg: '#FEF3C7', icon: 'thumbs-up' };
  return { label: 'Fair', color: '#DC2626', bg: '#FEE2E2', icon: 'alert-circle' };
}
