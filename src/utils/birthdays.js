/**
 * Birthday helpers. Everything is computed against the real "today" so the
 * upcoming-birthday broadcast (starts 3 days before) and the on-the-day
 * celebration behave correctly whenever the app is opened.
 */

function atMidnight(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Whole days from today until the person's next birthday (0 = today).
export function daysUntilBirthday(dob, from = new Date()) {
  if (!dob) return null;
  const b = new Date(dob);
  const today = atMidnight(from);
  let next = new Date(today.getFullYear(), b.getMonth(), b.getDate());
  if (next < today) next = new Date(today.getFullYear() + 1, b.getMonth(), b.getDate());
  return Math.round((next - today) / 86400000);
}

// The age the person turns on their upcoming birthday.
export function turningAge(dob, from = new Date()) {
  if (!dob) return null;
  const b = new Date(dob);
  const today = atMidnight(from);
  let year = today.getFullYear();
  const thisYear = new Date(year, b.getMonth(), b.getDate());
  if (thisYear < today) year += 1;
  return year - b.getFullYear();
}

export function birthdaysToday(students, from = new Date()) {
  return students.filter((s) => s.dob && daysUntilBirthday(s.dob, from) === 0);
}

export function upcomingBirthdays(students, within = 3, from = new Date()) {
  return students
    .filter((s) => {
      const d = daysUntilBirthday(s.dob, from);
      return d !== null && d >= 1 && d <= within;
    })
    .sort((a, b) => daysUntilBirthday(a.dob, from) - daysUntilBirthday(b.dob, from));
}

// "today" | "tomorrow" | "in N days"
export function birthdayWhen(dob, from = new Date()) {
  const d = daysUntilBirthday(dob, from);
  if (d === 0) return 'today';
  if (d === 1) return 'tomorrow';
  return `in ${d} days`;
}
