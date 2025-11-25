import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "@/components/CircularProgress";
import { Trash2, TrendingUp, TrendingDown, AlertTriangle, Sparkles } from "lucide-react";

interface SubjectData {
  id: string;
  name: string;
  attended: string;
  held: string;
  remaining: string;
}

interface SubjectCardProps {
  subject: SubjectData;
  onUpdate: (id: string, field: keyof SubjectData, value: string) => void;
  onRemove: (id: string) => void;
  result?: {
    currentPercentage: number;
    classesNeeded: number;
    classesCanSkip: number;
  };
}

const SubjectCard = ({ subject, onUpdate, onRemove, result }: SubjectCardProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const currentPercentage = result?.currentPercentage || 0;

  const getStatusBadge = () => {
    if (!result) return null;
    
    if (result.currentPercentage >= 75) {
      return (
        <Badge className="bg-success text-success-foreground gap-1 animate-bounce-in font-bold">
          <TrendingUp className="h-3 w-3" />
          🎉 Safe
        </Badge>
      );
    } else if (result.currentPercentage >= 60) {
      return (
        <Badge className="bg-warning text-warning-foreground gap-1 animate-bounce-in font-bold">
          <AlertTriangle className="h-3 w-3" />
          ⚠️ Warning
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-destructive text-destructive-foreground gap-1 animate-bounce-in font-bold">
          <TrendingDown className="h-3 w-3" />
          🚨 Critical
        </Badge>
      );
    }
  };

  const getGradientStyle = () => {
    if (currentPercentage >= 75) return { background: "var(--gradient-success)" };
    if (currentPercentage >= 60) return { background: "var(--gradient-warning)" };
    return { background: "var(--gradient-danger)" };
  };

  const validateField = (field: string, value: string) => {
    if (field !== 'name' && value && isNaN(Number(value))) {
      setErrors(prev => ({ ...prev, [field]: 'Please enter a valid number' }));
      return false;
    }
    if (field !== 'name' && value && Number(value) < 0) {
      setErrors(prev => ({ ...prev, [field]: 'Number cannot be negative' }));
      return false;
    }
    if (field === 'attended' && Number(value) > Number(subject.held)) {
      setErrors(prev => ({ ...prev, [field]: 'Cannot exceed classes held' }));
      return false;
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    return true;
  };

  const handleChange = (field: keyof SubjectData, value: string) => {
    if (field !== 'name') {
      validateField(field, value);
    }
    onUpdate(subject.id, field, value);
  };

  return (
    <Card 
      className="p-6 border-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-slide-up" 
      style={{ 
        borderColor: currentPercentage >= 75 ? "hsl(var(--success) / 0.3)" : currentPercentage >= 60 ? "hsl(var(--warning) / 0.3)" : currentPercentage > 0 ? "hsl(var(--destructive) / 0.3)" : "hsl(var(--border))"
      }}
    >
      <div 
        className="flex justify-between items-start mb-4 p-4 -m-6 mb-4 rounded-t-lg"
        style={currentPercentage > 0 ? { ...getGradientStyle() } : { background: "hsl(var(--muted) / 0.3)" }}
      >
        <div className="flex items-center gap-3">
          <Sparkles className={`h-5 w-5 ${currentPercentage >= 75 ? 'text-white animate-pulse-glow' : currentPercentage > 0 ? 'text-white' : 'text-muted-foreground'}`} />
          <h3 className={`text-lg font-bold ${currentPercentage > 0 ? 'text-white' : 'text-foreground'}`}>
            {subject.name || "✏️ New Subject"}
          </h3>
          {getStatusBadge()}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(subject.id)}
          className={`hover:bg-destructive/20 hover:text-destructive hover:scale-110 transition-transform ${currentPercentage > 0 ? 'text-white hover:text-destructive' : ''}`}
        >
          <Trash2 className="h-4 w-4 hover:animate-wiggle" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`name-${subject.id}`} className="font-semibold flex items-center gap-1">
            📝 Subject Name
          </Label>
          <Input
            id={`name-${subject.id}`}
            placeholder="e.g., Mathematics"
            value={subject.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1 font-semibold hover:border-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`attended-${subject.id}`} className="font-semibold flex items-center gap-1">
              ✅ Classes Attended
            </Label>
            <Input
              id={`attended-${subject.id}`}
              type="number"
              min="0"
              placeholder="0"
              value={subject.attended}
              onChange={(e) => handleChange('attended', e.target.value)}
              className="mt-1 font-semibold hover:border-primary transition-colors"
            />
            {errors.attended && (
              <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.attended}</p>
            )}
          </div>

          <div>
            <Label htmlFor={`held-${subject.id}`} className="font-semibold flex items-center gap-1">
              📅 Total Classes Held
            </Label>
            <Input
              id={`held-${subject.id}`}
              type="number"
              min="0"
              placeholder="0"
              value={subject.held}
              onChange={(e) => handleChange('held', e.target.value)}
              className="mt-1 font-semibold hover:border-primary transition-colors"
            />
            {errors.held && (
              <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.held}</p>
            )}
          </div>

          <div>
            <Label htmlFor={`remaining-${subject.id}`} className="font-semibold flex items-center gap-1">
              ⏳ Remaining Classes
            </Label>
            <Input
              id={`remaining-${subject.id}`}
              type="number"
              min="0"
              placeholder="0"
              value={subject.remaining}
              onChange={(e) => handleChange('remaining', e.target.value)}
              className="mt-1 font-semibold hover:border-primary transition-colors"
            />
            {errors.remaining && (
              <p className="text-destructive text-sm mt-1 animate-fade-in">{errors.remaining}</p>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-6 space-y-4 animate-bounce-in">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Circular Progress */}
              <div className="flex-shrink-0 animate-float">
                <CircularProgress percentage={result.currentPercentage} />
              </div>

              {/* Stats and Info */}
              <div className="flex-1 w-full space-y-3">
                <div className={`p-4 rounded-lg border-2 ${result.currentPercentage >= 75 ? 'bg-success/10 border-success/30' : result.currentPercentage >= 60 ? 'bg-warning/10 border-warning/30' : 'bg-destructive/10 border-destructive/30'}`}>
                  {result.currentPercentage < 75 ? (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                        🎯 Classes needed to reach 75%:
                      </p>
                      <p className="text-3xl font-bold text-warning">
                        {result.classesNeeded} {result.classesNeeded === 1 ? 'class' : 'classes'}
                      </p>
                      {result.classesNeeded > Number(subject.remaining) && (
                        <p className="text-sm text-destructive font-bold bg-destructive/20 p-3 rounded-lg mt-2 border-2 border-destructive/30 animate-pulse-glow">
                          ⚠️ Request faculty to mark {result.classesNeeded - Number(subject.remaining)} {result.classesNeeded - Number(subject.remaining) === 1 ? 'class' : 'classes'} present
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                        🎊 Classes you can skip:
                      </p>
                      <p className="text-3xl font-bold text-success">
                        {result.classesCanSkip} {result.classesCanSkip === 1 ? 'class' : 'classes'}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        💯 While maintaining 75% attendance
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SubjectCard;
