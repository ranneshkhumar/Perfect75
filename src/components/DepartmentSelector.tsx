import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { departments, semesters } from "@/data/subjects";

interface DepartmentSelectorProps {
  department: string;
  semester: string;
  lastUpdated: Date | undefined;
  onDepartmentChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onLastUpdatedChange: (date: Date | undefined) => void;
}

export function DepartmentSelector({
  department,
  semester,
  lastUpdated,
  onDepartmentChange,
  onSemesterChange,
  onLastUpdatedChange,
}: DepartmentSelectorProps) {
  return (
    <Card
      className="mb-8 border-2 hover:shadow-lg transition-all duration-300 animate-slide-up"
      style={{ borderColor: "hsl(var(--primary) / 0.2)" }}
    >
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          Select Your Department & Semester
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
                  onSelect={onLastUpdatedChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={onDepartmentChange}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={semester}
                onValueChange={onSemesterChange}
                disabled={!department}
              >
                <SelectTrigger id="semester">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
