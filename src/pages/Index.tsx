import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calculator, Linkedin, Instagram, FileText, CalendarIcon } from "lucide-react";
import SubjectCard from "@/components/SubjectCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { subjectData, departments, semesters } from "@/data/subjects";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SubjectData {
  id: string;
  name: string;
  attended: string;
  held: string;
  remaining: string;
}

interface SubjectResult {
  currentPercentage: number;
  classesNeeded: number;
  classesCanSkip: number;
}


const saveDeptSemData = (
  dept: string,
  sem: string,
  subjects: SubjectData[],
  results: Record<string, SubjectResult>
) => {
  const allData = JSON.parse(localStorage.getItem("attendanceData") || "{}");

  if (!allData[dept]) allData[dept] = {};
  allData[dept][sem] = { subjects, results };

  localStorage.setItem("attendanceData", JSON.stringify(allData));
};












const Index = () => {
  const [department, setDepartment] = useState<string>(() => {
    const saved = localStorage.getItem('attendanceDepartment');
    return saved || "";
  });
  const [semester, setSemester] = useState<string>(() => {
    const saved = localStorage.getItem('attendanceSemester');
    return saved || "";
  });
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('attendanceSelectedSubjects');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [subjects, setSubjects] = useState<SubjectData[]>([]);

    
 const [results, setResults] = useState<Record<string, SubjectResult>>({});

  const [showSummary, setShowSummary] = useState(false);
  const [showSubjectSelection, setShowSubjectSelection] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(() => {
    const saved = localStorage.getItem('attendanceLastUpdated');
    return saved ? new Date(saved) : undefined;
  });
  const loadDeptSemData = (dept: string, sem: string) => {
  const allData = JSON.parse(localStorage.getItem("attendanceData") || "{}");

  // ❌ no data saved for this dept/sem — return false
  if (!allData[dept] || !allData[dept][sem]) {
    return false;
  }

  const saved = allData[dept][sem];

  // 🔥 Reset first to guarantee React re-renders
  setSubjects([]);
  setResults({});

  // 🔥 Load saved data after reset
  setTimeout(() => {
    setSubjects(saved.subjects || []);
    setResults(saved.results || {});
    setShowSubjectSelection(false);
    setShowSummary(true);
  }, 50);

  return true;
};
  useEffect(() => {
    localStorage.setItem('attendanceDepartment', department);
  }, [department]);

  useEffect(() => {
    localStorage.setItem('attendanceSemester', semester);
  }, [semester]);

  useEffect(() => {
    localStorage.setItem('attendanceSelectedSubjects', JSON.stringify(Array.from(selectedSubjects)));
  }, [selectedSubjects]);

  useEffect(() => {
    localStorage.setItem('attendanceSubjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('attendanceResults', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    if (lastUpdated) {
      localStorage.setItem('attendanceLastUpdated', lastUpdated.toISOString());
    }
  }, [lastUpdated]);

  // 🔥 Auto SAVE whenever subjects OR results change
useEffect(() => {
  if (!department || !semester) return;

  // ⛔ Do NOT save while choosing subjects
  if (showSubjectSelection) return;

  // ⛔ Do NOT save if subjects are empty placeholder
  if (subjects.length === 1 && !subjects[0].name.trim()) return;

  saveDeptSemData(department, semester, subjects, results);
}, [subjects, results, department, semester, showSubjectSelection]);

  const [showAddSubjectDialog, setShowAddSubjectDialog] = useState(false);

  const addSubject = () => {
    setShowAddSubjectDialog(true);
  };

  const addSubjectFromTemplate = (subjectName: string) => {
    const newSubject: SubjectData = {
      id: Date.now().toString(),
      name: subjectName,
      attended: "",
      held: "",
      remaining: ""
    };
    setSubjects([...subjects, newSubject]);
    setShowAddSubjectDialog(false);
    toast({
      title: "Subject added!",
      description: `${subjectName} has been added to your list.`,
    });
  };

  const addCustomSubject = () => {
    const newSubject: SubjectData = {
      id: Date.now().toString(),
      name: "",
      attended: "",
      held: "",
      remaining: ""
    };
    setSubjects([...subjects, newSubject]);
    setShowAddSubjectDialog(false);
  };

  const removeSubject = (id: string) => {
    if (subjects.length === 1) {
      toast({
        title: "Cannot remove",
        description: "You must have at least one subject.",
        variant: "destructive"
      });
      return;
    }
    setSubjects(subjects.filter(s => s.id !== id));
    setResults(prev => {
      const newResults = { ...prev };
      delete newResults[id];
      return newResults;
    });
  };

const computeResults = (subjectsList: SubjectData[]) => {
  const out: Record<string, SubjectResult> = {};

  subjectsList.forEach((subject) => {
    const attended = Number(subject.attended);
    const held = Number(subject.held);
    const remaining = Number(subject.remaining);

    if (!attended || !held || !remaining) {
      out[subject.id] = {
        currentPercentage: 0,
        classesNeeded: 0,
        classesCanSkip: 0,
      };
      return;
    }
    

    
    const requiredPercent =  75;

    const currentPercentage = held > 0 ? (attended / held) * 100 : 0;
    const totalClasses = held + remaining;
    const requiredAttendance = (requiredPercent / 100) * totalClasses;

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

    out[subject.id] = {
      currentPercentage,
      classesNeeded,
      classesCanSkip,
    };
  });

  return out;
};
const autoCalculate = (currentSubjects: SubjectData[]) => {
  const newResults: Record<string, SubjectResult> = {};

  currentSubjects.forEach(subject => {
    if (!subject.name.trim()) return;

    const attended = Number(subject.attended);
    const held = Number(subject.held);
    const remaining = Number(subject.remaining);

    // Basic validity checks
    if (isNaN(attended) || isNaN(held)) return;
    if (held <= 0) return;

    // Calculate percentage always
    const currentPercentage = (attended / held) * 100;

    // If remaining is empty → only show percentage
    if (!subject.remaining.trim()) {
      newResults[subject.id] = {
        currentPercentage,
        classesNeeded: -1,  // indicates missing
        classesCanSkip: -1, // indicates missing
      };
      return;
    }

    // When remaining exists, do full calculation
    const totalClasses = held + remaining;

    const requiredAttendance =  0.75 * totalClasses;

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

    newResults[subject.id] = {
      currentPercentage,
      classesNeeded,
      classesCanSkip
    };
  });

  setResults(newResults);
};




  const updateSubject = (id: string, field: keyof SubjectData, value: string) => {
    setSubjects(subjects.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

// 🔥 AUTO CALCULATE — runs whenever subject values change
useEffect(() => {
  const newResults: Record<string, SubjectResult> = {};

  subjects.forEach((subject) => {
    const attended = Number(subject.attended);
    const held = Number(subject.held);
    const remaining = Number(subject.remaining);

    // ❌ If fields empty → show ring but no classesNeeded/skip
    const isValidAttended = !isNaN(attended) && attended >= 0;
    const isValidHeld = !isNaN(held) && held >= 0;

    // 💥 Prevent attended > held (fix your 100%+ bug!)
    if (attended > held) {
      newResults[subject.id] = {
        currentPercentage: 0,
        classesNeeded: 0,
        classesCanSkip: 0
      };
      return;
    }

    // 🟡 Show percentage even if remaining is NOT entered
    const currentPercentage =
      isValidHeld && held > 0 ? (attended / held) * 100 : 0;

    // ❌ If remaining missing → only % happens, no needed/skip logic
    if (subject.remaining.trim() === "") {
      newResults[subject.id] = {
        currentPercentage,
        classesNeeded: 0,
        classesCanSkip: 0
      };
      return;
    }

    // From here, full calculation happens only if remaining exists
    

    const requiredPercent =  75;

    const totalClasses = held + remaining;
    const requiredAttendance = (requiredPercent / 100) * totalClasses;

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

    newResults[subject.id] = {
      currentPercentage,
      classesNeeded,
      classesCanSkip
    };
  });

  setResults(newResults);
}, [subjects]);



  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setSemester("");
    setSelectedSubjects(new Set());
    setShowSubjectSelection(false);
  };

const handleSemesterChange = (value: string) => {
  setSemester(value);

  if (!department) return;

  // SPECIAL CASE: Others department
  if (department === "Others") {
    setShowSubjectSelection(false); // skip subject list UI
    setSubjects([{ id: Date.now().toString(), name: "", attended: "", held: "", remaining: "" }]);
    setResults({});
    setShowSummary(false);
    return;
  }

  // Normal case for all defined departments
  const allData = JSON.parse(localStorage.getItem("attendanceData") || "{}");
  const saved = allData[department]?.[value];

  if (saved) {
    // load saved CSE/AIDS/ECE etc
    setSubjects(saved.subjects || []);
    setResults(saved.results || {});
    setShowSummary(true);
    setShowSubjectSelection(false);
    return;
  }

  // show subject selection for defined departments
  setSelectedSubjects(new Set());
  setSubjects([]);
  setResults({});
  setShowSummary(false);
  setShowSubjectSelection(true);
};



  const handleSubjectToggle = (subjectName: string) => {
    setSelectedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subjectName)) {
        newSet.delete(subjectName);
      } else {
        newSet.add(subjectName);
      }
      return newSet;
    });
  };

  const loadSelectedSubjects = () => {
    if (selectedSubjects.size === 0) {
      toast({
        title: "No subjects selected",
        description: "Please select at least one subject to track.",
        variant: "destructive"
      });
      return;
    }

    const newSubjects: SubjectData[] = Array.from(selectedSubjects).map((name, index) => ({
      id: Date.now().toString() + index,
      name,
      attended: "",
      held: "",
      remaining: ""
    }));

    setSubjects(newSubjects);
    setShowSubjectSelection(false);
    toast({
      title: "Subjects loaded!",
      description: `${selectedSubjects.size} subject(s) ready to track.`,
    });
  };

  const calculateAttendance = () => {
    let hasErrors = false;
    const newResults: Record<string, SubjectResult> = {};

    subjects.forEach(subject => {
      if (!subject.name.trim()) {
        toast({
          title: "Missing subject name",
          description: "Please enter a name for all subjects.",
          variant: "destructive"
        });
        hasErrors = true;
        return;
      }

      const attended = Number(subject.attended);
      const held = Number(subject.held);
      const remaining = Number(subject.remaining);

      if (!subject.attended || !subject.held || !subject.remaining) {
        toast({
          title: "Missing data",
          description: `Please fill in all fields for ${subject.name}.`,
          variant: "destructive"
        });
        hasErrors = true;
        return;
      }

      if (attended > held) {
        toast({
          title: "Invalid data",
          description: `Classes attended cannot exceed classes held for ${subject.name}.`,
          variant: "destructive"
        });
        hasErrors = true;
        return;
      }

      // Calculate current attendance percentage
      const currentPercentage = held > 0 ? (attended / held) * 100 : 0;

      // Calculate total classes in semester
      const totalClasses = held + remaining;

      // Required attendance is 75% of total classes
      const requiredAttendance = 0.75 * totalClasses;

      // Calculate classes needed or can skip
      let classesNeeded = 0;
      let classesCanSkip = 0;

      if (attended < requiredAttendance) {
        // Need to attend more classes out of the remaining ones
        classesNeeded = Math.ceil(requiredAttendance - attended);
        // Classes that can be skipped from remaining
        classesCanSkip = Math.max(0, remaining - classesNeeded);
      } else {
        // Already have enough attendance
        // Calculate how many more classes can be skipped
        const maxAbsences = totalClasses - requiredAttendance;
        const currentAbsences = held - attended;
        classesCanSkip = Math.floor(maxAbsences - currentAbsences);
        classesNeeded = 0;
      }

      newResults[subject.id] = {
        currentPercentage,
        classesNeeded,
        classesCanSkip
      };
    });

    if (!hasErrors) {
      setResults(newResults);
      setShowSummary(true);
      toast({
        title: "Calculation complete!",
        description: "Your attendance has been calculated successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden py-16 px-4" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-float" />
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-20 right-1/3 w-8 h-8 bg-white rounded-full animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 animate-bounce-in">
            PERFECT <span className="inline-block text-5xl md:text-9xl font-extrabold animate-wiggle" style={{ textShadow: "0 0 30px rgba(255,255,255,0.5)" }}>75</span>
          </h1>
          <p className="text-sm md:text-base text-white/90 mb-4 animate-slide-up font-semibold">
            🎯 Your Fun Attendance Tracker
          </p>
          <p className="text-lg text-white/95 max-w-2xl mx-auto animate-fade-in">
            Let's make attendance tracking fun! 🚀 Track your classes and see how many you can skip while staying above 75%! 😎
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Department and Semester Selection */}
        <Card className="mb-8 border-2 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ borderColor: "hsl(var(--primary) / 0.2)" }}>
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              Select Your Department & Semester
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Last Updated Date */}
              <div className="space-y-2">
                <Label htmlFor="last-updated" className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Last Updated
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="last-updated"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all hover:scale-[1.02]",
                        !lastUpdated && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {lastUpdated ? (
                        <div className="flex flex-col">
                          <span>{format(lastUpdated, "PPP")}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(lastUpdated, "EEEE")}
                          </span>
                        </div>
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={lastUpdated}
                      onSelect={setLastUpdated}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={department} onValueChange={handleDepartmentChange}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select value={semester} onValueChange={handleSemesterChange} disabled={!department}>
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map(sem => (
                        <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Selection for predefined departments */}
        {showSubjectSelection && department !== "Others" && semester && subjectData[department]?.[Number(semester)] && (
          <Card className="mb-8 border-2 animate-bounce-in" style={{ borderColor: "hsl(var(--accent) / 0.4)", boxShadow: "var(--shadow-glow)" }}>
            <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Pick Your Subjects!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Select All Option */}
                <div className="flex items-center space-x-2 pb-2 border-b border-border">
                  <Checkbox
                    id="select-all"
                    checked={
                      department !== "Others" && semester && subjectData[department]?.[Number(semester)]
                        ? selectedSubjects.size === subjectData[department][Number(semester)].length
                        : false
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const allSubjects = new Set(
                          subjectData[department][Number(semester)].map(s => s.name)
                        );
                        setSelectedSubjects(allSubjects);
                      } else {
                        setSelectedSubjects(new Set());
                      }
                    }}
                  />
                  <Label
                    htmlFor="select-all"
                    className="text-sm font-semibold cursor-pointer"
                  >
                    Select All
                  </Label>
                </div>
                
                {/* Individual Subject Checkboxes */}
                {subjectData[department][Number(semester)].map((subject, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${index}`}
                      checked={selectedSubjects.has(subject.name)}
                      onCheckedChange={() => handleSubjectToggle(subject.name)}
                    />
                    <Label
                      htmlFor={`subject-${index}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
              <Button 
                onClick={loadSelectedSubjects} 
                className="mt-6 w-full text-lg font-bold transition-transform hover:scale-105"
                style={{ background: "var(--gradient-hero)" }}
              >
                🎉 Let's Go! Load Subjects
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Subject Cards */}
        {!showSubjectSelection && (
          <div className="space-y-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onUpdate={updateSubject}
                onRemove={removeSubject}
                result={results[subject.id]}
              />
            ))}
          </div>
        )}

        {/* Add Subject Dialog */}
        {showAddSubjectDialog && !showSubjectSelection && (
          <Card className="mb-8 border-2 animate-bounce-in" style={{ borderColor: "hsl(var(--secondary) / 0.4)" }}>
            <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">➕</span>
                Add a New Subject
              </CardTitle>
            </CardHeader>
            <CardContent>
              {department && semester && subjectData[department]?.[Number(semester)] ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Select from available subjects or add a custom one:</p>
                  
                  {/* Select All Option */}
                  {subjectData[department][Number(semester)].filter(template => !subjects.some(s => s.name === template.name)).length > 0 && (
                    <div className="flex items-center space-x-2 pb-2 border-b border-border">
                      <Checkbox
                        id="add-select-all"
                        checked={
                          subjectData[department][Number(semester)]
                            .filter(template => !subjects.some(s => s.name === template.name))
                            .length === 0
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            const remainingSubjects = subjectData[department][Number(semester)]
                              .filter(template => !subjects.some(s => s.name === template.name));
                            
                            const newSubjects = remainingSubjects.map((template, idx) => ({
                              id: (Date.now() + idx).toString(),
                              name: template.name,
                              attended: "",
                              held: "",
                              remaining: ""
                            }));
                            
                            setSubjects([...subjects, ...newSubjects]);
                            setShowAddSubjectDialog(false);
                            toast({
                              title: "All subjects added!",
                              description: `${remainingSubjects.length} subject(s) have been added to your list.`,
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor="add-select-all"
                        className="text-sm font-semibold cursor-pointer"
                      >
                        Select All Remaining Subjects
                      </Label>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {subjectData[department][Number(semester)]
                      .filter(template => !subjects.some(s => s.name === template.name))
                      .map((template, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start h-auto py-3 px-4 text-left"
                          onClick={() => addSubjectFromTemplate(template.name)}
                        >
                          {template.name}
                        </Button>
                      ))}
                  </div>
                  <div className="pt-4 border-t border-border">
                    <Button
                      variant="secondary"
                      className="w-full gap-2"
                      onClick={addCustomSubject}
                    >
                      <Plus className="h-4 w-4" />
                      Add Custom Subject
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowAddSubjectDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Add a custom subject:</p>
                  <Button
                    variant="secondary"
                    className="w-full gap-2"
                    onClick={addCustomSubject}
                  >
                    <Plus className="h-4 w-4" />
                    Add Custom Subject
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowAddSubjectDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {!showSubjectSelection && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={addSubject}
              variant="outline"
              size="lg"
              className="gap-2 border-2 hover:scale-105 transition-transform font-semibold"
              style={{ borderColor: "hsl(var(--primary))" }}
            >
              <Plus className="h-5 w-5" />
              ➕ Add Subject
            </Button>
            
            <Button
              onClick={calculateAttendance}
              size="lg"
              className="gap-2 text-lg font-bold hover:scale-105 transition-transform"
              style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
            >
              <Calculator className="h-5 w-5" />
              ✨ Calculate Magic!
            </Button>
          </div>
        )}

        {/* Summary Report */}
        {Object.keys(results).length > 0 && (
          <Card className="mt-8 border-2 animate-bounce-in" style={{ borderColor: "hsl(var(--success) / 0.4)", boxShadow: "var(--shadow-glow)" }}>
            <CardHeader style={{ background: "var(--gradient-success)" }}>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5" />
                <span className="text-2xl">🎊</span>
                Attendance Summary Report
              </CardTitle>
              {lastUpdated && (
                <div className="text-sm mt-2">
                  <span className="font-medium text-white/90">Last Updated: </span>
                  <span className="font-bold text-lg bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 bg-clip-text text-transparent animate-shimmer">
                    {format(lastUpdated, "PPP")} ({format(lastUpdated, "EEEE")})
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {subjects.map((subject) => {
                  const result = results[subject.id];
                  if (!result || !subject.name) return null;
                  
                  return (
                    <div 
                      key={subject.id} 
                      className="p-4 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Current: {result.currentPercentage.toFixed(2)}%
                          </p>
                        </div>
                       <div className="flex-1">
  {/* No remaining → show simple message */}
  {!subject.remaining ? (
    <p className="text-sm text-muted-foreground italic">
      ⏳ Enter remaining classes to calculate needed/skip info.
    </p>
  ) : result.currentPercentage < 75 ? (
    <div className="text-sm">
      <p className="font-medium text-warning">
        Need to attend: <span className="text-lg font-bold">{result.classesNeeded}</span>
        {" "}out of <span className="font-bold">{subject.remaining}</span>{" "}
        remaining {Number(subject.remaining) === 1 ? "class" : "classes"}
      </p>
      {result.classesNeeded > Number(subject.remaining) && (
        <p className="text-destructive text-xs mt-1">
          ⚠️ Request faculty for {result.classesNeeded - Number(subject.remaining)} present
        </p>
      )}
    </div>
  ) : (
    <p className="text-sm font-medium text-success">
      Can skip: <span className="text-lg font-bold">{result.classesCanSkip}</span>
      {" "}out of <span className="font-bold">{subject.remaining}</span>{" "}
      remaining {Number(subject.remaining) === 1 ? "class" : "classes"}
    </p>
  )}
</div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">How it works</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Enter your subject details including classes attended, held, and remaining</li>
            <li>• Click "Calculate Attendance" to see your current percentage</li>
            <li>• Find out how many classes you need to attend to reach 75%</li>
            <li>• Or see how many classes you can skip while maintaining 75%</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground border-t border-border mt-16">
        <p>Built for students to manage their attendance effectively</p>
        <p className="mt-2 text-sm">Created by <span className="font-semibold text-foreground">RANN</span></p>
        <div className="flex justify-center gap-4 mt-4">
          <a 
            href="https://www.linkedin.com/in/rannesh-khumar-b-r-507377289" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a 
            href="https://www.instagram.com/rannesh_khumar?igsh=MWxnODU1bGM1dzVwZQ==" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label="Instagram Profile"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
