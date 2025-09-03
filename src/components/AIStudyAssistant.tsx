import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  FileText, 
  Share2, 
  BookOpen, 
  Video, 
  Download,
  Sparkles,
  Lightbulb,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIStudyAssistantProps {
  currentSubject?: string;
}

interface StudyResource {
  id: string;
  type: 'apostila' | 'videoaula';
  title: string;
  description: string;
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  duration?: string;
  rating: number;
  url: string;
}

interface MindMapNode {
  id: string;
  text: string;
  level: number;
  parent?: string;
  color: string;
}

export const AIStudyAssistant = ({ currentSubject = "Matemática" }: AIStudyAssistantProps) => {
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState("");
  const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>([]);
  const [recommendations, setRecommendations] = useState<StudyResource[]>([]);
  const { toast } = useToast();

  // Simular geração de resumo com IA
  const generateSummary = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Texto necessário",
        description: "Por favor, insira o conteúdo que deseja resumir.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockSummary = `📝 **Resumo Inteligente - ${currentSubject}**

**Pontos Principais:**
• Conceitos fundamentais identificados no texto
• Relações entre os tópicos principais
• Exemplos práticos mencionados

**Tópicos Centrais:**
1. **Fundamentos:** Base teórica do conteúdo
2. **Aplicações:** Como aplicar na prática
3. **Exercícios:** Sugestões de prática

**💡 Dica de Estudo:** 
Foque nos conceitos destacados e pratique com exercícios similares para fixar o aprendizado.

**⏱️ Tempo de Revisão:** 15-20 minutos
**📊 Complexidade:** Intermediária`;

    setSummary(mockSummary);
    setIsGenerating(false);
    
    toast({
      title: "Resumo gerado! 🎉",
      description: "Seu resumo inteligente está pronto para revisão."
    });
  };

  // Simular geração de mapa mental
  const generateMindMap = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Texto necessário", 
        description: "Por favor, insira o conteúdo para criar o mapa mental.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockMindMap: MindMapNode[] = [
      { id: '1', text: currentSubject, level: 0, color: 'primary' },
      { id: '2', text: 'Conceitos Básicos', level: 1, parent: '1', color: 'success' },
      { id: '3', text: 'Fórmulas Principais', level: 1, parent: '1', color: 'creative' },
      { id: '4', text: 'Aplicações Práticas', level: 1, parent: '1', color: 'energy' },
      { id: '5', text: 'Definições', level: 2, parent: '2', color: 'success' },
      { id: '6', text: 'Propriedades', level: 2, parent: '2', color: 'success' },
      { id: '7', text: 'Equações', level: 2, parent: '3', color: 'creative' },
      { id: '8', text: 'Teoremas', level: 2, parent: '3', color: 'creative' },
      { id: '9', text: 'Exercícios', level: 2, parent: '4', color: 'energy' },
      { id: '10', text: 'Projetos', level: 2, parent: '4', color: 'energy' }
    ];

    setMindMapNodes(mockMindMap);
    setIsGenerating(false);
    
    toast({
      title: "Mapa mental criado! 🧠",
      description: "Visualize os conceitos de forma organizada."
    });
  };

  // Simular recomendações de recursos
  const generateRecommendations = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockRecommendations: StudyResource[] = [
      {
        id: '1',
        type: 'apostila',
        title: `Apostila Completa de ${currentSubject}`,
        description: 'Material didático abrangente com teoria e exercícios resolvidos',
        difficulty: 'intermediario',
        rating: 4.8,
        url: '#'
      },
      {
        id: '2',
        type: 'videoaula',
        title: `${currentSubject} - Aula Interativa`,
        description: 'Videoaula dinâmica com exemplos práticos e exercícios',
        difficulty: 'iniciante',
        duration: '45 min',
        rating: 4.9,
        url: '#'
      },
      {
        id: '3',
        type: 'apostila',
        title: 'Exercícios Resolvidos e Comentados',
        description: 'Coleção de exercícios com soluções passo a passo',
        difficulty: 'avancado',
        rating: 4.7,
        url: '#'
      },
      {
        id: '4',
        type: 'videoaula',
        title: 'Masterclass Avançada',
        description: 'Conteúdo aprofundado para estudantes que querem se destacar',
        difficulty: 'avancado',
        duration: '1h 20min',
        rating: 4.9,
        url: '#'
      }
    ];

    setRecommendations(mockRecommendations);
    setIsGenerating(false);
    
    toast({
      title: "Recomendações prontas! 📚",
      description: "Encontramos ótimos recursos para seus estudos."
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'iniciante': return 'bg-success text-success-foreground';
      case 'intermediario': return 'bg-primary text-primary-foreground';
      case 'avancado': return 'bg-energy text-energy-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const renderMindMap = () => {
    const centerNodes = mindMapNodes.filter(node => node.level === 0);
    const firstLevelNodes = mindMapNodes.filter(node => node.level === 1);
    const secondLevelNodes = mindMapNodes.filter(node => node.level === 2);

    return (
      <div className="relative p-8 bg-gradient-to-br from-background to-muted rounded-lg min-h-[400px] overflow-auto">
        {/* Nó central */}
        {centerNodes.map(node => (
          <div
            key={node.id}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className={`px-6 py-3 bg-gradient-primary text-white rounded-full font-bold text-lg shadow-glow`}>
              {node.text}
            </div>
          </div>
        ))}

        {/* Primeiro nível */}
        {firstLevelNodes.map((node, index) => {
          const angle = (index * 120) - 90; // Distribui em círculo
          const radius = 120;
          const x = Math.cos(angle * Math.PI / 180) * radius;
          const y = Math.sin(angle * Math.PI / 180) * radius;
          
          return (
            <div
              key={node.id}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
              }}
            >
              <div className={`px-4 py-2 bg-${node.color} text-white rounded-lg font-medium shadow-md`}>
                {node.text}
              </div>
              {/* Linha conectora */}
              <div
                className="absolute border-t-2 border-gray-300"
                style={{
                  width: `${radius}px`,
                  transformOrigin: 'left center',
                  transform: `rotate(${angle + 180}deg)`,
                  top: '50%',
                  left: '50%'
                }}
              />
            </div>
          );
        })}

        {/* Segundo nível */}
        {secondLevelNodes.map((node, index) => {
          const parentIndex = firstLevelNodes.findIndex(n => n.id === node.parent);
          const baseAngle = (parentIndex * 120) - 90;
          const offset = (index % 2 === 0 ? -30 : 30);
          const angle = baseAngle + offset;
          const radius = 200;
          const x = Math.cos(angle * Math.PI / 180) * radius;
          const y = Math.sin(angle * Math.PI / 180) * radius;
          
          return (
            <div
              key={node.id}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
              }}
            >
              <div className={`px-3 py-1 bg-${node.color}/80 text-white rounded text-sm shadow-sm`}>
                {node.text}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-creative" />
          Assistente de IA - {currentSubject}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resumo" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resumo" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resumos
            </TabsTrigger>
            <TabsTrigger value="mapa" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Mapas Mentais
            </TabsTrigger>
            <TabsTrigger value="recursos" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Recursos
            </TabsTrigger>
          </TabsList>

          {/* Aba de Resumos */}
          <TabsContent value="resumo" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Cole seu conteúdo para resumir:
                </label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Cole aqui o texto, PDF ou conteúdo que você quer resumir..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button 
                onClick={generateSummary}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Gerando resumo...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar Resumo Inteligente
                  </>
                )}
              </Button>

              {summary && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        Resumo Gerado
                      </h4>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {summary}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Aba de Mapas Mentais */}
          <TabsContent value="mapa" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Conteúdo para o mapa mental:
                </label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Descreva o tópico ou cole o conteúdo para criar um mapa mental..."
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={generateMindMap}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Share2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando mapa mental...
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4" />
                    Criar Mapa Mental
                  </>
                )}
              </Button>

              {mindMapNodes.length > 0 && (
                <Card className="bg-creative/5 border-creative/20">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Brain className="h-4 w-4 text-creative" />
                        Mapa Mental Gerado
                      </h4>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                    {renderMindMap()}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Aba de Recursos */}
          <TabsContent value="recursos" className="space-y-4">
            <div className="space-y-4">
              <div className="text-center">
                <Button 
                  onClick={generateRecommendations}
                  disabled={isGenerating}
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Target className="mr-2 h-4 w-4 animate-spin" />
                      Buscando recursos...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Recomendar Recursos para {currentSubject}
                    </>
                  )}
                </Button>
              </div>

              {recommendations.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Recursos Recomendados
                  </h4>
                  
                  {recommendations.map(resource => (
                    <Card key={resource.id} className="hover:shadow-md transition-all">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {resource.type === 'apostila' ? (
                              <FileText className="h-5 w-5 text-primary" />
                            ) : (
                              <Video className="h-5 w-5 text-energy" />
                            )}
                            <div>
                              <h5 className="font-medium">{resource.title}</h5>
                              <p className="text-sm text-muted-foreground">
                                {resource.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              {"★".repeat(Math.floor(resource.rating))}
                              <span className="text-sm">{resource.rating}</span>
                            </div>
                            {resource.duration && (
                              <Badge variant="outline" className="text-xs">
                                {resource.duration}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge className={getDifficultyColor(resource.difficulty)}>
                            {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Acessar Recurso
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};