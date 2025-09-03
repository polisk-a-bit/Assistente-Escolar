import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, Target, TrendingUp, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: string;
  name: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  timeStudied: number;
  target: number;
}

interface SubjectManagerProps {
  subjects: Subject[];
  onSubjectsChange: (subjects: Subject[]) => void;
  onSelectSubject: (subject: Subject) => void;
}

const colorOptions = [
  { value: 'primary', label: 'Azul', class: 'bg-primary' },
  { value: 'success', label: 'Verde', class: 'bg-success' },
  { value: 'creative', label: 'Roxo', class: 'bg-creative' },
  { value: 'energy', label: 'Laranja', class: 'bg-energy' },
];

export const SubjectManager = ({ subjects, onSubjectsChange, onSelectSubject }: SubjectManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    color: 'primary',
    priority: 'medium' as 'high' | 'medium' | 'low',
    target: 180 // 3 horas por semana em minutos
  });
  const { toast } = useToast();

  const handleAddSubject = () => {
    if (!newSubject.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira o nome da matéria.",
        variant: "destructive"
      });
      return;
    }

    const subject: Subject = {
      id: Date.now().toString(),
      name: newSubject.name,
      color: newSubject.color,
      priority: newSubject.priority,
      timeStudied: 0,
      target: newSubject.target
    };

    onSubjectsChange([...subjects, subject]);
    setNewSubject({
      name: '',
      color: 'primary',
      priority: 'medium',
      target: 180
    });
    setIsDialogOpen(false);

    toast({
      title: "Matéria adicionada! 📚",
      description: `${subject.name} foi adicionada à sua rotina de estudos.`
    });
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <Target className="h-4 w-4 text-primary" />;
      case 'low':
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const sortedSubjects = [...subjects].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Minhas Matérias
        </CardTitle>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Matéria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject-name">Nome da Matéria</Label>
                <Input
                  id="subject-name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Matemática, História..."
                />
              </div>

              <div className="space-y-2">
                <Label>Cor</Label>
                <Select 
                  value={newSubject.color} 
                  onValueChange={(value) => setNewSubject(prev => ({ ...prev, color: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(color => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${color.class}`} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select 
                  value={newSubject.priority} 
                  onValueChange={(value: 'high' | 'medium' | 'low') => 
                    setNewSubject(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Alta Prioridade</SelectItem>
                    <SelectItem value="medium">Média Prioridade</SelectItem>
                    <SelectItem value="low">Baixa Prioridade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-hours">Meta Semanal (horas)</Label>
                <Input
                  id="target-hours"
                  type="number"
                  min="1"
                  max="20"
                  value={newSubject.target / 60}
                  onChange={(e) => setNewSubject(prev => ({ 
                    ...prev, 
                    target: parseInt(e.target.value) * 60 
                  }))}
                />
              </div>

              <Button onClick={handleAddSubject} className="w-full">
                Adicionar Matéria
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-4">
        {sortedSubjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma matéria adicionada ainda.</p>
            <p className="text-sm">Clique no + para começar!</p>
          </div>
        ) : (
          sortedSubjects.map(subject => {
            const progress = (subject.timeStudied / subject.target) * 100;
            const isOnTrack = progress >= 70;
            const needsAttention = progress < 50;

            return (
              <div
                key={subject.id}
                className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectSubject(subject)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-${subject.color}`} />
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(subject.priority)}
                    <Badge 
                      variant={subject.priority === 'high' ? 'destructive' : 
                              subject.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {getPriorityLabel(subject.priority)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {Math.round(subject.timeStudied / 60 * 10) / 10}h de {subject.target / 60}h
                    </span>
                    <span className={`font-medium ${
                      isOnTrack ? 'text-success' : 
                      needsAttention ? 'text-destructive' : 'text-primary'
                    }`}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                </div>

                {needsAttention && (
                  <div className="mt-2 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Precisa de mais atenção
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};