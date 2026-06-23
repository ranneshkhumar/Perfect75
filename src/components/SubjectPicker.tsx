import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { subjectData } from "@/data/subjects";

interface SubjectPickerProps {
  department: string;
  semester: string;
  selectedSubjects: Set<string>;
  onToggle: (name: string) => void;
  onLoad: () => boolean | void;
  onCancel: () => void;
}

export function SubjectPicker({
  department,
  semester,
  selectedSubjects,
  onToggle,
  onLoad,
  onCancel,
}: SubjectPickerProps) {
  const subjects = subjectData[department]?.[Number(semester)] || [];

  if (subjects.length === 0) return null;

  const handleLoad = () => {
    onLoad();
  };

  return (
    <Card
      className="mb-8 border-2 animate-bounce-in"
      style={{
        borderColor: "hsl(var(--accent) / 0.4)",
        boxShadow: "var(--shadow-glow)",
      }}
    >
      <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          Pick Your Subjects!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-border">
            <Checkbox
              id="select-all"
              checked={selectedSubjects.size === subjects.length}
              onCheckedChange={(checked) => {
                if (checked) {
                  const allNames = new Set(subjects.map((s) => s.name));
                  // Need to call the parent's setSelectedSubjects directly
                  // Since we only have onToggle, use a workaround
                  allNames.forEach((name) => {
                    if (!selectedSubjects.has(name)) onToggle(name);
                  });
                } else {
                  // Deselect all
                  Array.from(selectedSubjects).forEach((name) => onToggle(name));
                }
              }}
            />
            <Label htmlFor="select-all" className="text-sm font-semibold cursor-pointer">
              Select All
            </Label>
          </div>

          {subjects.map((subject, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`subject-${index}`}
                checked={selectedSubjects.has(subject.name)}
                onCheckedChange={() => onToggle(subject.name)}
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
        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleLoad}
            className="flex-1 text-lg font-bold transition-transform hover:scale-105"
            style={{ background: "var(--gradient-hero)" }}
          >
            🎉 Let's Go! Load Subjects
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
