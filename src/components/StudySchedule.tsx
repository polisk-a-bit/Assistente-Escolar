import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Plus } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  timeStudied: number;
  target: number;
}

interface StudyScheduleProps {
  subjects: Subject[];
}

interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  duration: string;
  type: 'study' | 'review' | 'practice';
  color: string;
}

export const StudySchedule = ({ subjects }: StudyScheduleProps) => {
  // Gerar cronograma inteligente baseado nas prioridades
  const generateSchedule = (): ScheduleItem[] => {
    const schedule: ScheduleItem[] = [];
    const times = ['14:00', '15:30', '17:00', '19:00', '20:30'];
    const types: Array<'study' | 'review' | 'practice'> = ['study', 'review', 'practice'];
    
    subjects.slice(0, 5).forEach((subject, index) => {
      schedule.push({
        id: `${subject.id}-${index}`,
        time: times[index] || '21:00',
        subject: subject.name,
        duration: subject.priority === 'high' ? '50min' : '40min',
        type: types[index % 3],
        color: subject.color
      });
    });

    return schedule.sort((a, b) => a.time.localeCompare(b.time));
  };

  const todaySchedule = generateSchedule();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'study': return 'Estudo';
      case 'review': return 'Revisão';
      case 'practice': return 'Prática';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'bg-primary text-primary-foreground';
      case 'review': return 'bg-success text-success-foreground';
      case 'practice': return 'bg-creative text-creative-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const isCurrentSession = (timeStr: string) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    const sessionTime = hour * 60 + minute;
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    return currentTimeMinutes >= sessionTime && currentTimeMinutes < (sessionTime + 50);
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Cronograma de Hoje
        </CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Personalizar
        </Button>
      </CardHeader>
      <CardContent>
        {todaySchedule.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum cronograma definido ainda.</p>
            <p className="text-sm">Adicione matérias para gerar sugestões automáticas!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySchedule.map((item, index) => {
              const isCurrent = isCurrentSession(item.time);
              const isPast = (() => {
                const [hour, minute] = item.time.split(':').map(Number);
                const sessionTime = hour * 60 + minute + 50; // +50 min duração
                const currentTimeMinutes = currentHour * 60 + currentMinute;
                return currentTimeMinutes > sessionTime;
              })();

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isCurrent 
                      ? 'border-primary bg-primary/5 shadow-glow' 
                      : isPast 
                        ? 'border-muted bg-muted/30 opacity-60'
                        : 'border-border hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-primary">
                        {item.time}
                      </div>
                      <div className={`w-3 h-3 rounded-full bg-${item.color}`} />
                      <span className="font-medium">{item.subject}</span>
                    </div>
                    {isCurrent && (
                      <Badge variant="default" className="animate-pulse">
                        Agora
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{item.duration}</span>
                    <div className="mx-2">•</div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTypeColor(item.type)}`}
                    >
                      {getTypeLabel(item.type)}
                    </Badge>
                  </div>

                  {isCurrent && (
                    <div className="mt-3 pt-3 border-t border-primary/20">
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Iniciar Sessão
                        </Button>
                        <Button size="sm" variant="outline">
                          Reagendar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Sugestão para amanhã */}
            <div className="mt-6 p-4 bg-gradient-primary rounded-lg text-white">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Sugestão para Amanhã</span>
              </div>
              <p className="text-sm text-white/90">
                Com base no seu progresso, recomendamos focar em{" "}
                <span className="font-semibold">
                  {subjects.find(s => s.priority === 'high')?.name || 'suas matérias prioritárias'}
                </span>{" "}
                pela manhã, quando sua concentração está no pico.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};