import { useState, useEffect, useCallback } from "react";
import type { SubjectData, SubjectResult } from "@/lib/attendance";
import { calculateAllSubjects } from "@/lib/attendance";
import {
  loadDeptSemData,
  saveDeptSemData,
} from "@/lib/storage";

function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export function useAttendance() {
  const [department, setDepartment] = useState<string>(
    () => readLocalStorage("attendanceDepartment", "") as string
  );
  const [semester, setSemester] = useState<string>(
    () => readLocalStorage("attendanceSemester", "") as string
  );
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(
    () => new Set(readLocalStorage<string[]>("attendanceSelectedSubjects", []))
  );
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [results, setResults] = useState<Record<string, SubjectResult>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [showSubjectSelection, setShowSubjectSelection] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(
    () => readLocalStorage<string>("attendanceLastUpdated", "") || undefined
      ? new Date(readLocalStorage<string>("attendanceLastUpdated", ""))
      : undefined
  );

  // Persist department/semester/selectedSubjects to localStorage
  useEffect(() => {
    localStorage.setItem("attendanceDepartment", department);
  }, [department]);

  useEffect(() => {
    localStorage.setItem("attendanceSemester", semester);
  }, [semester]);

  useEffect(() => {
    localStorage.setItem(
      "attendanceSelectedSubjects",
      JSON.stringify(Array.from(selectedSubjects))
    );
  }, [selectedSubjects]);

  useEffect(() => {
    if (lastUpdated) {
      localStorage.setItem("attendanceLastUpdated", lastUpdated.toISOString());
    }
  }, [lastUpdated]);

  // Auto-save to dept/sem structure
  useEffect(() => {
    if (!department || !semester) return;
    if (showSubjectSelection) return;
    if (subjects.length === 1 && !subjects[0].name.trim()) return;
    saveDeptSemData(department, semester, subjects, results);
  }, [subjects, results, department, semester, showSubjectSelection]);

  // Auto-recalculate when subjects change
  useEffect(() => {
    setResults(calculateAllSubjects(subjects));
  }, [subjects]);

  // Load saved data when department/semester changes
  useEffect(() => {
    if (!department || !semester) return;
    const saved = loadDeptSemData(department, semester);
    if (saved) {
      setSubjects(saved.subjects || []);
      setResults(saved.results || {});
      setShowSummary(true);
      setShowSubjectSelection(false);
    }
  }, [department, semester]);

  const addSubjectFromTemplate = useCallback((subjectName: string) => {
    const newSubject: SubjectData = {
      id: Date.now().toString(),
      name: subjectName,
      attended: "",
      held: "",
      remaining: "",
    };
    setSubjects((prev) => [...prev, newSubject]);
  }, []);

  const addCustomSubject = useCallback(() => {
    const newSubject: SubjectData = {
      id: Date.now().toString(),
      name: "",
      attended: "",
      held: "",
      remaining: "",
    };
    setSubjects((prev) => [...prev, newSubject]);
  }, []);

  const removeSubject = useCallback((id: string) => {
    setSubjects((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((s) => s.id !== id);
    });
    setResults((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const updateSubject = useCallback(
    (id: string, field: keyof SubjectData, value: string) => {
      setSubjects((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  const loadSelectedSubjects = useCallback(() => {
    if (selectedSubjects.size === 0) return false;
    const newSubjects: SubjectData[] = Array.from(selectedSubjects).map(
      (name, index) => ({
        id: Date.now().toString() + index,
        name,
        attended: "",
        held: "",
        remaining: "",
      })
    );
    setSubjects(newSubjects);
    setShowSubjectSelection(false);
    return true;
  }, [selectedSubjects]);

  const showAddSubjects = useCallback(() => {
    setShowSubjectSelection(true);
  }, []);

  const hideAddSubjects = useCallback(() => {
    setShowSubjectSelection(false);
  }, []);

  const handleDepartmentChange = useCallback((value: string) => {
    setDepartment(value);
    setSemester("");
    setSelectedSubjects(new Set());
    setShowSubjectSelection(false);
    setSubjects([]);
    setResults({});
    setShowSummary(false);
  }, []);

  const handleSemesterChange = useCallback(
    (value: string, isOthers: boolean) => {
      setSemester(value);
      if (!department) return;

      if (isOthers) {
        setShowSubjectSelection(false);
        setSubjects([
          {
            id: Date.now().toString(),
            name: "",
            attended: "",
            held: "",
            remaining: "",
          },
        ]);
        setResults({});
        setShowSummary(false);
        return;
      }

      const saved = loadDeptSemData(department, value);
      if (saved) {
        setSubjects(saved.subjects || []);
        setResults(saved.results || {});
        setShowSummary(true);
        setShowSubjectSelection(false);
        return;
      }

      setSelectedSubjects(new Set());
      setSubjects([]);
      setResults({});
      setShowSummary(false);
      setShowSubjectSelection(true);
    },
    [department]
  );

  const handleSubjectToggle = useCallback((subjectName: string) => {
    setSelectedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subjectName)) {
        next.delete(subjectName);
      } else {
        next.add(subjectName);
      }
      return next;
    });
  }, []);

  const showSummaryReport = useCallback(() => {
    setShowSummary(true);
  }, []);

  return {
    department,
    semester,
    selectedSubjects,
    subjects,
    results,
    showSummary,
    showSubjectSelection,
    lastUpdated,
    setLastUpdated,
    setSubjects,
    setResults,
    addSubjectFromTemplate,
    addCustomSubject,
    removeSubject,
    updateSubject,
    loadSelectedSubjects,
    showAddSubjects,
    hideAddSubjects,
    handleDepartmentChange,
    handleSemesterChange,
    handleSubjectToggle,
    showSummaryReport,
  };
}
