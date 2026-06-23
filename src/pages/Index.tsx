import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calculator } from "lucide-react";
import SubjectCard from "@/components/SubjectCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DepartmentSelector } from "@/components/DepartmentSelector";
import { SubjectPicker } from "@/components/SubjectPicker";
import { AddSubjectPanel } from "@/components/AddSubjectPanel";
import { SummaryReport } from "@/components/SummaryReport";
import { DataManager } from "@/components/DataManager";
import { toast } from "@/hooks/use-toast";
import { useAttendance } from "@/hooks/useAttendance";
import { subjectData } from "@/data/subjects";
import { REQUIRED_PERCENTAGE } from "@/lib/attendance";

const Index = () => {
  const {
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
    addSubjectFromTemplate,
    addCustomSubject,
    removeSubject,
    updateSubject,
    loadSelectedSubjects,
    hideAddSubjects,
    handleDepartmentChange,
    handleSemesterChange,
    handleSubjectToggle,
  } = useAttendance();

  const [showAddSubjectDialog, setShowAddSubjectDialog] = useState(false);
  const [importKey, setImportKey] = useState(0);

  const isOthersDept = department === "Others";
  const hasSubjects = subjects.length > 0 && subjects.some((s) => s.name.trim());

  const handleLoadSelected = useCallback(() => {
    const loaded = loadSelectedSubjects();
    if (loaded) {
      toast({
        title: "Subjects loaded!",
        description: `${selectedSubjects.size} subject(s) ready to track.`,
      });
    } else {
      toast({
        title: "No subjects selected",
        description: "Please select at least one subject to track.",
        variant: "destructive",
      });
    }
  }, [loadSelectedSubjects, selectedSubjects.size]);

  const handleAddFromTemplate = useCallback(
    (name: string) => {
      addSubjectFromTemplate(name);
      setShowAddSubjectDialog(false);
      toast({
        title: "Subject added!",
        description: `${name} has been added to your list.`,
      });
    },
    [addSubjectFromTemplate]
  );

  const handleAddCustom = useCallback(() => {
    addCustomSubject();
    setShowAddSubjectDialog(false);
  }, [addCustomSubject]);

  const handleAddAll = useCallback(
    (newSubjects: typeof subjects) => {
      setSubjects((prev) => [...prev, ...newSubjects]);
      setShowAddSubjectDialog(false);
      toast({
        title: "All subjects added!",
        description: `${newSubjects.length} subject(s) have been added to your list.`,
      });
    },
    [setSubjects]
  );

  const handleSemesterChangeWrapper = useCallback(
    (value: string) => {
      handleSemesterChange(value, isOthersDept);
    },
    [handleSemesterChange, isOthersDept]
  );

  const handleRemoveSubject = useCallback(
    (id: string) => {
      if (subjects.length === 1) {
        toast({
          title: "Cannot remove",
          description: "You must have at least one subject.",
          variant: "destructive",
        });
        return;
      }
      removeSubject(id);
    },
    [subjects.length, removeSubject]
  );

  const handleImportComplete = useCallback(() => {
    setImportKey((k) => k + 1);
    window.location.reload();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header
        className="relative overflow-hidden py-16 px-4"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-float" />
          <div
            className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-float"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-20 right-1/3 w-8 h-8 bg-white rounded-full animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 animate-bounce-in">
            PERFECT{" "}
            <span
              className="inline-block text-5xl md:text-9xl font-extrabold animate-wiggle"
              style={{ textShadow: "0 0 30px rgba(255,255,255,0.5)" }}
            >
              {REQUIRED_PERCENTAGE}
            </span>
          </h1>
          <p className="text-sm md:text-base text-white/90 mb-4 animate-slide-up font-semibold">
            🎯 Your Fun Attendance Tracker
          </p>
          <p className="text-lg text-white/95 max-w-2xl mx-auto animate-fade-in">
            Let's make attendance tracking fun! 🚀 Track your classes and see how
            many you can skip while staying above {REQUIRED_PERCENTAGE}%! 😎
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl" key={importKey}>
        {/* Department and Semester Selection */}
        <DepartmentSelector
          department={department}
          semester={semester}
          lastUpdated={lastUpdated}
          onDepartmentChange={handleDepartmentChange}
          onSemesterChange={handleSemesterChangeWrapper}
          onLastUpdatedChange={setLastUpdated}
        />

        {/* Data Export/Import */}
        {hasSubjects && (
          <div className="flex justify-end mb-4">
            <DataManager onImportComplete={handleImportComplete} />
          </div>
        )}

        {/* Subject Selection for predefined departments */}
        {showSubjectSelection &&
          !isOthersDept &&
          semester &&
          subjectData[department]?.[Number(semester)] && (
            <SubjectPicker
              department={department}
              semester={semester}
              selectedSubjects={selectedSubjects}
              onToggle={handleSubjectToggle}
              onLoad={handleLoadSelected}
              onCancel={hideAddSubjects}
            />
          )}

        {/* Subject Cards */}
        {!showSubjectSelection && (
          <div className="space-y-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onUpdate={updateSubject}
                onRemove={handleRemoveSubject}
                result={results[subject.id]}
              />
            ))}
          </div>
        )}

        {/* Add Subject Dialog */}
        {showAddSubjectDialog && !showSubjectSelection && (
          <AddSubjectPanel
            department={department}
            semester={semester}
            subjects={subjects}
            onAddTemplate={handleAddFromTemplate}
            onAddCustom={handleAddCustom}
            onCancel={() => setShowAddSubjectDialog(false)}
            onAddAll={handleAddAll}
          />
        )}

        {/* Action Buttons */}
        {!showSubjectSelection && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowAddSubjectDialog(true)}
              variant="outline"
              size="lg"
              className="gap-2 border-2 hover:scale-105 transition-transform font-semibold"
              style={{ borderColor: "hsl(var(--primary))" }}
            >
              <Plus className="h-5 w-5" />
              ➕ Add Subject
            </Button>

            {!showSummary && hasSubjects && (
              <Button
                onClick={() => {
                  const allFilled = subjects.every(
                    (s) => s.name.trim() && s.attended && s.held
                  );
                  if (!allFilled) {
                    toast({
                      title: "Missing data",
                      description: "Please fill in subject names, attended, and held for all subjects.",
                      variant: "destructive",
                    });
                    return;
                  }
                  const hasNegative = subjects.some(
                    (s) => Number(s.attended) > Number(s.held)
                  );
                  if (hasNegative) {
                    toast({
                      title: "Invalid data",
                      description: "Classes attended cannot exceed classes held.",
                      variant: "destructive",
                    });
                    return;
                  }
                }}
                size="lg"
                className="gap-2 text-lg font-bold hover:scale-105 transition-transform"
                style={{
                  background: "var(--gradient-hero)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <Calculator className="h-5 w-5" />
                ✨ Calculate Magic!
              </Button>
            )}
          </div>
        )}

        {/* Summary Report */}
        <SummaryReport
          subjects={subjects}
          results={results}
          lastUpdated={lastUpdated}
        />

        {/* Info Section */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-2">How it works</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Enter your subject details including classes attended, held, and remaining</li>
            <li>• Results are calculated automatically as you type</li>
            <li>• Find out how many classes you need to attend to reach {REQUIRED_PERCENTAGE}%</li>
            <li>• Or see how many classes you can skip while maintaining {REQUIRED_PERCENTAGE}%</li>
            <li>• Export your data as a backup and import it on another device</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground border-t border-border mt-16">
        <p>Built for students to manage their attendance effectively</p>
        <p className="mt-2 text-sm">
          Created by <span className="font-semibold text-foreground">RANN</span>
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <a
            href="https://www.linkedin.com/in/rannesh-khumar-b-r-507377289"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label="LinkedIn Profile"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/rannesh_khumar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            aria-label="Instagram Profile"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
