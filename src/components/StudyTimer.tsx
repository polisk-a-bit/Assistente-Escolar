import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: string;
  name: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  timeStudied: number;
  target: number;
}

interface StudyTimerProps {
  currentSubject: Subject | null;
  onSubjectChange: (subject: Subject | null) => void;
  subjects: Subject[];
}

export const StudyTimer = ({ currentSubject, onSubjectChange, subjects }: StudyTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const { toast } = useToast();

  const totalTime = isBreak ? 5 * 60 : 25 * 60; // 5 min pausa, 25 min estudo
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer terminou
      setIsRunning(false);
      
      if (isBreak) {
        // Terminou a pausa
        setIsBreak(false);
        setTimeLeft(25 * 60);
        toast({
          title: "Pausa terminada! ☕",
          description: "Hora de voltar aos estudos com energia renovada!"
        });
      } else {
        // Terminou sessão de estudo
        setSessions(prev => prev + 1);
        setIsBreak(true);
        setTimeLeft(5 * 60);
        toast({
          title: "Sessão concluída! 🎉",
          description: `Parabéns! Você estudou ${currentSubject?.name || 'uma matéria'} por 25 minutos.`
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, isBreak, currentSubject, toast]);

  const toggleTimer = () => {
    if (!currentSubject && !isBreak) {
      toast({
        title: "Selecione uma matéria",
        description: "Escolha o que você vai estudar antes de iniciar o timer.",
        variant: "destructive"
      });
      return;
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubjectSelect = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    onSubjectChange(subject || null);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isBreak ? (
            <>
              <Coffee className="h-5 w-5 text-energy" />
              Timer de Pausa
            </>
          ) : (
            <>
              <Play className="h-5 w-5 text-primary" />
              Timer Pomodoro
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {!isBreak && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Matéria atual:</label>
            <Select value={currentSubject?.id || ""} onValueChange={handleSubjectSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma matéria" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${subject.color}`} />
                      {subject.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className={`text-6xl font-bold ${isBreak ? 'text-energy' : 'text-primary'}`}>
            {formatTime(timeLeft)}
          </div>
          
          <Progress 
            value={progress} 
            className="h-3"
          />

          <div className="flex items-center justify-center gap-2">
            <Badge variant={isBreak ? "outline" : "default"} className="text-xs">
              {isBreak ? "Pausa ativo" : "Foco ativo"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Sessão {sessions}/4
            </Badge>
          </div>
        </div>

        {/* Controles */}
        <div className="flex gap-2">
          <Button 
            onClick={toggleTimer}
            className="flex-1"
            variant={isRunning ? "outline" : "default"}
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pausar
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {isBreak ? "Iniciar Pausa" : "Iniciar Estudo"}
              </>
            )}
          </Button>
          
          <Button onClick={resetTimer} variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {currentSubject && !isBreak && (
          <div className="p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{currentSubject.name}</span>
              <Badge 
                variant={currentSubject.priority === 'high' ? 'destructive' : 
                        currentSubject.priority === 'medium' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {currentSubject.priority === 'high' ? 'Alta' : 
                 currentSubject.priority === 'medium' ? 'Média' : 'Baixa'} prioridade
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progresso: {currentSubject.timeStudied}min</span>
                <span>Meta: {currentSubject.target}min</span>
              </div>
              <Progress 
                value={(currentSubject.timeStudied / currentSubject.target) * 100} 
                className="h-2"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};