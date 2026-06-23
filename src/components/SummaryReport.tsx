import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import type { SubjectData, SubjectResult } from "@/lib/attendance";
import { REQUIRED_PERCENTAGE } from "@/lib/attendance";

interface SummaryReportProps {
  subjects: SubjectData[];
  results: Record<string, SubjectResult>;
  lastUpdated: Date | undefined;
}

export function SummaryReport({
  subjects,
  results,
  lastUpdated,
}: SummaryReportProps) {
  const hasResults = Object.keys(results).length > 0;
  if (!hasResults) return null;

  return (
    <Card
      className="mt-8 border-2 animate-bounce-in"
      style={{
        borderColor: "hsl(var(--success) / 0.4)",
        boxShadow: "var(--shadow-glow)",
      }}
    >
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
                    {!subject.remaining ? (
                      <p className="text-sm text-muted-foreground italic">
                        ⏳ Enter remaining classes to calculate needed/skip info.
                      </p>
                    ) : result.currentPercentage < REQUIRED_PERCENTAGE ? (
                      <div className="text-sm">
                        <p className="font-medium text-warning">
                          Need to attend:{" "}
                          <span className="text-lg font-bold">
                            {result.classesNeeded}
                          </span>
                          {" "}out of{" "}
                          <span className="font-bold">{subject.remaining}</span>{" "}
                          remaining{" "}
                          {Number(subject.remaining) === 1 ? "class" : "classes"}
                        </p>
                        {result.classesNeeded > Number(subject.remaining) && (
                          <p className="text-destructive text-xs mt-1">
                            ⚠️ Request faculty for{" "}
                            {result.classesNeeded - Number(subject.remaining)}{" "}
                            present
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-success">
                        Can skip:{" "}
                        <span className="text-lg font-bold">
                          {result.classesCanSkip}
                        </span>
                        {" "}out of{" "}
                        <span className="font-bold">{subject.remaining}</span>{" "}
                        remaining{" "}
                        {Number(subject.remaining) === 1 ? "class" : "classes"}
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
  );
}
