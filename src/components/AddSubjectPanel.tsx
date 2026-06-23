import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { subjectData } from "@/data/subjects";
import type { SubjectData } from "@/lib/attendance";

interface AddSubjectPanelProps {
  department: string;
  semester: string;
  subjects: SubjectData[];
  onAddTemplate: (name: string) => void;
  onAddCustom: () => void;
  onCancel: () => void;
  onAddAll: (newSubjects: SubjectData[]) => void;
}

export function AddSubjectPanel({
  department,
  semester,
  subjects,
  onAddTemplate,
  onAddCustom,
  onCancel,
  onAddAll,
}: AddSubjectPanelProps) {
  const templateSubjects =
    subjectData[department]?.[Number(semester)] || [];

  const remaining = templateSubjects.filter(
    (t) => !subjects.some((s) => s.name === t.name)
  );

  const handleAddAll = () => {
    const newSubjects = remaining.map((template, idx) => ({
      id: (Date.now() + idx).toString(),
      name: template.name,
      attended: "",
      held: "",
      remaining: "",
    }));
    onAddAll(newSubjects);
  };

  return (
    <Card
      className="mb-8 border-2 animate-bounce-in"
      style={{ borderColor: "hsl(var(--secondary) / 0.4)" }}
    >
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">➕</span>
          Add a New Subject
        </CardTitle>
      </CardHeader>
      <CardContent>
        {remaining.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select from available subjects or add a custom one:
            </p>

            <div className="flex items-center space-x-2 pb-2 border-b border-border">
              <Checkbox
                id="add-select-all"
                checked={false}
                onCheckedChange={(checked) => {
                  if (checked) handleAddAll();
                }}
              />
              <Label htmlFor="add-select-all" className="text-sm font-semibold cursor-pointer">
                Select All Remaining Subjects
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {remaining.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left"
                  onClick={() => onAddTemplate(template.name)}
                >
                  {template.name}
                </Button>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <Button variant="secondary" className="w-full gap-2" onClick={onAddCustom}>
                <Plus className="h-4 w-4" />
                Add Custom Subject
              </Button>
            </div>
            <Button variant="ghost" className="w-full" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Add a custom subject:</p>
            <Button variant="secondary" className="w-full gap-2" onClick={onAddCustom}>
              <Plus className="h-4 w-4" />
              Add Custom Subject
            </Button>
            <Button variant="ghost" className="w-full" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
