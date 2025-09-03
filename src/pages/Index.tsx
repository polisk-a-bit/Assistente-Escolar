import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Play,
  Pause,
  RotateCcw,
  Plus
} from "lucide-react";
import heroImage from "@/assets/hero-students.jpg";
import { StudyTimer } from "@/components/StudyTimer";
import { SubjectManager } from "@/components/SubjectManager";
import { StudySchedule } from "@/components/StudySchedule";
import { ProgressChart } from "@/components/ProgressChart";
import { AIStudyAssistant } from "@/components/AIStudyAssistant";

interface Subject {
  id: string;
  name: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  timeStudied: number;
  target: number;
}

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Matemática',
      color: 'primary',
      priority: 'high',
      timeStudied: 180,
      target: 300
    },
    {
      id: '2', 
      name: 'História',
      color: 'creative',
      priority: 'medium',
      timeStudied: 120,
      target: 200
    },
    {
      id: '3',
      name: 'Português',
      color: 'success',
      priority: 'high',
      timeStudied: 90,
      target: 240
    }
  ]);

  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [weeklyGoal] = useState(1200); // minutos por semana
  const totalStudied = subjects.reduce((sum, subject) => sum + subject.timeStudied, 0);
  const weeklyProgress = (totalStudied / weeklyGoal) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                Seu Assistente Virtual de 
                <span className="bg-gradient-to-r from-white to-creative-light bg-clip-text text-transparent">
                  {" "}Estudos
                </span>
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Organize sua rotina, acompanhe seu progresso e conquiste seus objetivos acadêmicos com inteligência artificial.
              </p>
              <div className="flex gap-4">
                <Button variant="secondary" size="lg" className="shadow-glow">
                  <Plus className="mr-2 h-5 w-5" />
                  Nova Matéria
                </Button>
                <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10">
                  <Calendar className="mr-2 h-5 w-5" />
                  Ver Cronograma
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Estudantes organizando rotina de estudos"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Meta Semanal</p>
                    <p className="text-xs text-muted-foreground">{Math.round(weeklyProgress)}% concluída</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Principal */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Cards de Status */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="shadow-card hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      Tempo Hoje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-1">
                      2h 15m
                    </div>
                    <p className="text-sm text-muted-foreground">+30min vs ontem</p>
                  </CardContent>
                </Card>

                <Card className="shadow-card hover:shadow-success transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-success" />
                      Meta Semanal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success mb-2">
                      {Math.round(weeklyProgress)}%
                    </div>
                    <Progress value={weeklyProgress} className="h-2" />
                  </CardContent>
                </Card>

                <Card className="shadow-card hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-creative" />
                      Matérias Ativas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-creative mb-1">
                      {subjects.length}
                    </div>
                    <p className="text-sm text-muted-foreground">3 prioritárias</p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico de Progresso */}
              <ProgressChart subjects={subjects} />

              {/* Cronograma de Estudos */}
              <StudySchedule subjects={subjects} />

              {/* Assistente de IA */}
              <AIStudyAssistant currentSubject={currentSubject?.name} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Timer Pomodoro */}
              <StudyTimer 
                currentSubject={currentSubject} 
                onSubjectChange={setCurrentSubject}
                subjects={subjects}
              />

              {/* Gerenciador de Matérias */}
              <SubjectManager 
                subjects={subjects} 
                onSubjectsChange={setSubjects}
                onSelectSubject={setCurrentSubject}
              />

              {/* Sugestões do Assistente */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">🤖 Sugestões do Assistente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="font-medium text-sm">Foque em Matemática</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Você está 40% abaixo da meta semanal nesta matéria.
                    </p>
                  </div>
                  <div className="p-4 bg-success/5 rounded-lg border-l-4 border-success">
                    <p className="font-medium text-sm">Parabéns! 🎉</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Você mantém uma sequência de 5 dias estudando.
                    </p>
                  </div>
                  <div className="p-4 bg-energy/5 rounded-lg border-l-4 border-energy">
                    <p className="font-medium text-sm">Hora do intervalo</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Que tal uma pausa de 15 minutos?
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;