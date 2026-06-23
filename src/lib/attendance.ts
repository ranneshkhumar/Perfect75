export const REQUIRED_PERCENTAGE = 75;

export interface SubjectData {
  id: string;
  name: string;
  attended: string;
  held: string;
  remaining: string;
}

export interface SubjectResult {
  currentPercentage: number;
  classesNeeded: number;
  classesCanSkip: number;
}

export function calculateAttendance(subject: SubjectData): SubjectResult {
  const attended = Number(subject.attended);
  const held = Number(subject.held);
  const remaining = Number(subject.remaining);

  if (isNaN(attended) || isNaN(held) || held <= 0 || attended > held) {
    return { currentPercentage: 0, classesNeeded: 0, classesCanSkip: 0 };
  }

  const currentPercentage = (attended / held) * 100;

  if (isNaN(remaining) || !subject.remaining.trim()) {
    return { currentPercentage, classesNeeded: 0, classesCanSkip: 0 };
  }

  const totalClasses = held + remaining;
  const requiredAttendance = (REQUIRED_PERCENTAGE / 100) * totalClasses;

  let classesNeeded = 0;
  let classesCanSkip = 0;

  if (attended < requiredAttendance) {
    classesNeeded = Math.ceil(requiredAttendance - attended);
    classesCanSkip = Math.max(0, remaining - classesNeeded);
  } else {
    const maxAbsences = totalClasses - requiredAttendance;
    const currentAbsences = held - attended;
    classesCanSkip = Math.floor(maxAbsences - currentAbsences);
  }

  return { currentPercentage, classesNeeded, classesCanSkip };
}

export function calculateAllSubjects(subjects: SubjectData[]): Record<string, SubjectResult> {
  const results: Record<string, SubjectResult> = {};
  for (const subject of subjects) {
    if (!subject.name.trim()) continue;
    results[subject.id] = calculateAttendance(subject);
  }
  return results;
}
