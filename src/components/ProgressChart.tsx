import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  timeStudied: number;
  target: number;
}

interface ProgressChartProps {
  subjects: Subject[];
}

export const ProgressChart = ({ subjects }: ProgressChartProps) => {
  // Dados simulados para os últimos 7 dias
  const weekData = [
    { day: 'Seg', hours: 2.5, target: 3 },
    { day: 'Ter', hours: 3.2, target: 3 },
    { day: 'Qua', hours: 1.8, target: 3 },
    { day: 'Qui', hours: 4.1, target: 3 },
    { day: 'Sex', hours: 2.9, target: 3 },
    { day: 'Sáb', hours: 3.5, target: 3 },
    { day: 'Dom', hours: 2.2, target: 3 },
  ];

  const totalWeekHours = weekData.reduce((sum, day) => sum + day.hours, 0);
  const weeklyTarget = weekData.reduce((sum, day) => sum + day.target, 0);
  const weekProgress = (totalWeekHours / weeklyTarget) * 100;

  const maxHours = Math.max(...weekData.map(day => Math.max(day.hours, day.target))) + 1;

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-success" />
          Progresso Semanal
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-success">
              {Math.round(weekProgress)}%
            </div>
            <div className="text-sm text-muted-foreground">
              {totalWeekHours.toFixed(1)}h de {weeklyTarget}h
            </div>
          </div>
          <Badge 
            variant={weekProgress >= 80 ? "default" : weekProgress >= 60 ? "secondary" : "destructive"}
            className="text-xs"
          >
            {weekProgress >= 80 ? "Excelente!" : weekProgress >= 60 ? "Bom ritmo" : "Pode melhorar"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Gráfico de barras simples */}
        <div className="space-y-6">
          <div className="flex items-end justify-between h-32 px-2">
            {weekData.map((day, index) => {
              const studiedHeight = (day.hours / maxHours) * 100;
              const targetHeight = (day.target / maxHours) * 100;
              const isToday = index === 3; // Simulando que hoje é quinta
              
              return (
                <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                  <div className="relative w-8 h-24 flex items-end">
                    {/* Barra de meta (fundo) */}
                    <div 
                      className="absolute bottom-0 w-full bg-muted rounded-t-sm opacity-50"
                      style={{ height: `${targetHeight}%` }}
                    />
                    {/* Barra de progresso */}
                    <div 
                      className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-500 ${
                        day.hours >= day.target 
                          ? 'bg-gradient-success' 
                          : day.hours >= day.target * 0.8 
                            ? 'bg-gradient-primary' 
                            : 'bg-gradient-energy'
                      }`}
                      style={{ 
                        height: `${studiedHeight}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                      {day.day}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {day.hours.toFixed(1)}h
                    </div>
                    {isToday && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Hoje
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-success rounded-sm" />
              <span>Meta atingida</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-primary rounded-sm" />
              <span>Bom progresso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-energy rounded-sm" />
              <span>Precisa melhorar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted rounded-sm" />
              <span>Meta diária</span>
            </div>
          </div>

          {/* Estatísticas por matéria */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Por Matéria (Esta Semana)
            </h4>
            {subjects.slice(0, 3).map((subject) => {
              const progress = (subject.timeStudied / subject.target) * 100;
              return (
                <div key={subject.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${subject.color}`} />
                    <span className="font-medium text-sm">{subject.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">
                      {Math.round(subject.timeStudied / 60 * 10) / 10}h
                    </div>
                    <Badge 
                      variant={progress >= 80 ? "default" : progress >= 50 ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {Math.round(progress)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};