import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { exportAllData, importAllData } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

interface DataManagerProps {
  onImportComplete: () => void;
}

export function DataManager({ onImportComplete }: DataManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "perfect75-attendance-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exported!",
      description: "Your attendance data has been downloaded.",
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = importAllData(text);
      if (success) {
        toast({
          title: "Imported!",
          description: "Your attendance data has been restored.",
        });
        onImportComplete();
      } else {
        toast({
          title: "Import failed",
          description: "Invalid backup file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    e.target.value = "";
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-4 w-4 mr-1" />
        Export
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4 mr-1" />
        Import
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}
