import type { SubjectData, SubjectResult } from "./attendance";

interface DepartmentSemesterData {
  subjects: SubjectData[];
  results: Record<string, SubjectResult>;
}

interface AllAttendanceData {
  [department: string]: {
    [semester: string]: DepartmentSemesterData;
  };
}

const STORAGE_KEY = "attendanceData";

export function loadAllData(): AllAttendanceData {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function loadDeptSemData(
  dept: string,
  sem: string
): DepartmentSemesterData | null {
  const allData = loadAllData();
  return allData[dept]?.[sem] || null;
}

export function saveDeptSemData(
  dept: string,
  sem: string,
  subjects: SubjectData[],
  results: Record<string, SubjectResult>
): void {
  const allData = loadAllData();
  if (!allData[dept]) allData[dept] = {};
  allData[dept][sem] = { subjects, results };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
}

export function exportAllData(): string {
  return JSON.stringify(loadAllData(), null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as AllAttendanceData;
    if (typeof data !== "object" || data === null) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
