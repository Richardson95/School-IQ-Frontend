/**
 * Lightweight, offline auto-summary for a captured class transcript.
 *
 * The transcript is produced by a speech-to-text engine (see LESSON_TRANSCRIPTS).
 * To plug in a real engine later — e.g. @react-native-voice/voice or a cloud STT
 * API — keep feeding recognised lines into the same { text, key? } shape and this
 * summariser will keep working.
 *
 * The summary is built extractively: lines flagged `key` (or, as a fallback,
 * the sentences containing the strongest "teaching" cues) become the key points,
 * and a short paragraph is stitched together from them.
 */

const CUE_WORDS = [
  'remember', 'important', 'note that', 'the formula', 'is defined', 'is called',
  'for homework', 'for your assignment', 'make sure', 'the main idea', 'key',
];

function cleanSentence(s) {
  const t = s.trim().replace(/\s+/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function summarizeTranscript(lines, { subject, topic } = {}) {
  const items = (lines || []).map((l) => (typeof l === 'string' ? { text: l } : l));

  // Prefer explicitly flagged key lines; otherwise fall back to cue-word matching.
  let key = items.filter((l) => l.key).map((l) => l.text);
  if (key.length === 0) {
    key = items
      .map((l) => l.text)
      .filter((t) => CUE_WORDS.some((c) => t.toLowerCase().includes(c)));
  }
  // Still nothing? Take a representative spread of the transcript.
  if (key.length === 0 && items.length > 0) {
    const step = Math.max(1, Math.floor(items.length / 4));
    key = items.filter((_, i) => i % step === 0).map((l) => l.text);
  }

  const keyPoints = key.slice(0, 6).map(cleanSentence);

  const heading = topic
    ? `this lesson on ${topic}`
    : subject
    ? `this ${subject} lesson`
    : 'this lesson';

  const summary = keyPoints.length
    ? `In ${heading}, the class covered ${keyPoints.length} key point${keyPoints.length === 1 ? '' : 's'}. ` +
      keyPoints.slice(0, 3).join(' ')
    : `Notes were captured for ${heading}.`;

  const fullText = items.map((l) => l.text).join(' ');

  return { summary, keyPoints, fullText };
}
