import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

/**
 * Download helpers built on expo-file-system + expo-sharing.
 *
 * On a device the share sheet includes "Save to Files" / "Save to device", which
 * is how a user actually downloads/keeps the document. We write generated text
 * to the app's document directory first, then open the share sheet on it.
 * Existing files (an uploaded receipt/photo image) are shared straight from
 * their URI.
 */

function safeName(name) {
  return name.replace(/[^a-z0-9.\-_ ]/gi, '_').replace(/\s+/g, '_');
}

// Generate a text document and offer to save/share it.
export async function downloadText(filename, content) {
  try {
    const name = safeName(filename.endsWith('.txt') ? filename : `${filename}.txt`);
    const uri = FileSystem.documentDirectory + name;
    await FileSystem.writeAsStringAsync(uri, content, { encoding: FileSystem.EncodingType.UTF8 });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'text/plain', dialogTitle: name });
    } else {
      Alert.alert('Saved', `Document saved to:\n${uri}`);
    }
    return uri;
  } catch (e) {
    Alert.alert('Download failed', e?.message || 'Could not create the file.');
  }
}

// Share/save an existing file already on the device (e.g. an uploaded image).
export async function downloadUri(uri, { mimeType = 'image/jpeg', dialogTitle = 'Save file' } = {}) {
  try {
    if (!uri) { Alert.alert('Nothing to download', 'No file is attached.'); return; }
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType, dialogTitle });
    } else {
      Alert.alert('File location', uri);
    }
  } catch (e) {
    Alert.alert('Download failed', e?.message || 'Could not open the file.');
  }
}

/* ---- Simple text formatters so downloads read like real documents ---- */

const line = '─'.repeat(40);

export function reportCardToText(rc, studentName) {
  const rows = rc.subjects.map((s) => `  ${s.name.padEnd(24)} ${String(s.score).padStart(3)}  ${s.grade}  ${s.remark}`).join('\n');
  return [
    'RIVER BANK SCHOOL — REPORT CARD', line,
    `Student: ${studentName}`,
    `Term: ${rc.term}    Session: ${rc.session}`,
    line, 'SUBJECT                    SCORE  GRADE  REMARK', rows, line,
    `Total: ${rc.totalScore}    Average: ${rc.average}%    Position: ${rc.position} of ${rc.outOf}`,
    line,
    `Class Teacher's Remark: ${rc.teacherRemark}`,
    `Principal's Remark: ${rc.principalRemark}`,
  ].join('\n');
}

export function weeklyReportToText(r) {
  return [
    'RIVER BANK SCHOOL — WEEKLY REPORT', line,
    `Subject: ${r.subject}`,
    `Teacher: ${r.teacherName}`,
    `${r.week}  •  ${r.term}  •  ${r.session}`,
    line,
    `Classwork: ${r.classwork}    Homework: ${r.homework}    Participation: ${r.participation}`,
    `Behaviour: ${r.behavior}`,
    line,
    `Summary:\n${r.summary}`,
    '',
    `Recommendations:\n${r.recommendations}`,
  ].join('\n');
}

export function cbtResultToText(r) {
  return [
    'RIVER BANK SCHOOL — PRACTICE CBT RESULT', line,
    `Student: ${r.studentName}   (${r.className})`,
    `Source: ${r.source}`,
    `Date: ${new Date(r.takenAt).toLocaleString('en-NG')}`,
    line,
    `Score: ${r.correct} / ${r.total}   (${r.score}%)`,
    `Rating: ${r.rating}`,
    `Topics: ${(r.topics || []).join(', ')}`,
    line,
    'Note: This is a self-practice quiz generated from class notes,',
    'separate from official teacher tests and examinations.',
  ].join('\n');
}

export function assignmentToText(a) {
  return [
    'RIVER BANK SCHOOL — ASSIGNMENT', line,
    `Subject: ${a.subject}`,
    `Title: ${a.title}`,
    `Teacher: ${a.teacher}`,
    `Assigned: ${a.assignedDate}    Due: ${a.dueDate}`,
    `Max Score: ${a.maxScore}`,
    line,
    'Instructions:',
    a.description,
  ].join('\n');
}

export function submissionToText(a, sub) {
  return [
    'RIVER BANK SCHOOL — ASSIGNMENT SUBMISSION', line,
    `Assignment: ${a.title} (${a.subject})`,
    `Student: ${sub.studentName || 'Student'}`,
    `Submitted: ${sub.submittedDate}`,
    sub.fileName ? `Attached file: ${sub.fileName}` : 'Attached file: (none)',
    line,
    'Student\'s answer / notes:',
    sub.answer || '(no written answer)',
  ].join('\n');
}
