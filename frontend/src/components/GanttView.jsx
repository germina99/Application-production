import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CalendarDays, Trash2, AlertCircle, Video, Image as ImageIcon, FlaskConical } from 'lucide-react';
import { getAllProductions, getProjects, deleteProject } from '../mock';
import { toast } from '../hooks/use-toast';

const GanttView = ({ refresh }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadData();
  }, [refresh]);

  const loadData = () => {
    const projectsData = getProjects().filter(p => p.status === 'en_cours');
    setProjects(projectsData);
  };

  const handleDeleteProject = (id, name) => {
    if (window.confirm(`Supprimer le projet "${name}" et toutes ses productions ?`)) {
      deleteProject(id);
      loadData();
      toast({
        title: "Projet supprimé",
        description: `Le projet ${name} a été supprimé.`
      });
    }
  };

  const allProductions = getAllProductions();

  const getDateRange = () => {
    if (allProductions.length === 0) return { start: new Date(), end: new Date() };
    
    const dates = allProductions.flatMap(p => [
      new Date(p.startDate),
      new Date(p.endDate)
    ]);
    
    const start = new Date(Math.min(...dates));
    const end = new Date(Math.max(...dates));
    
    // Add padding
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() + 2);
    
    return { start, end };
  };

  const { start: rangeStart, end: rangeEnd } = getDateRange();
  const daysDiff = Math.ceil((rangeEnd - rangeStart) / (1000 * 60 * 60 * 24)) + 1;
  const days = Array.from({ length: daysDiff }, (_, i) => {
    const date = new Date(rangeStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  const getBarPosition = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startOffset = Math.floor((start - rangeStart) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      left: `${(startOffset / daysDiff) * 100}%`,
      width: `${(duration / daysDiff) * 100}%`
    };
  };

  // Get phase segments
  const getPhaseSegments = (production) => {
    const methodData = production.methodData;
    const soakDays = Math.ceil(methodData.soakDuration / 24);
    // Germination et obscurité sont juxtaposées (en même temps), donc on prend le max
    const germinationDays = Math.max(methodData.germinationDuration, methodData.darkDuration);
    const totalDays = soakDays + germinationDays + methodData.growthDuration;
    
    const segments = [
      {
        name: 'Trempage',
        color: 'bg-blue-400',
        width: (soakDays / totalDays) * 100,
        days: soakDays
      }
    ];
    
    // Germination avec obscurité (juxtaposée)
    if (methodData.darkDuration > 0 && methodData.darkDuration === germinationDays) {
      // Obscurité couvre toute la germination
      segments.push({
        name: 'Germ + Noir',
        color: 'bg-gradient-to-r from-green-400 to-gray-600',
        width: (germinationDays / totalDays) * 100,
        days: germinationDays
      });
    } else if (methodData.darkDuration > 0) {
      // Obscurité partielle pendant germination
      segments.push({
        name: 'Germination',
        color: 'bg-green-400',
        width: (germinationDays / totalDays) * 100,
        days: germinationDays,
        subtext: `(dont ${methodData.darkDuration}j noir)`
      });
    } else {
      // Pas d'obscurité
      segments.push({
        name: 'Germination',
        color: 'bg-green-400',
        width: (germinationDays / totalDays) * 100,
        days: germinationDays
      });
    }
    
    // Croissance
    if (methodData.growthDuration > 0) {
      segments.push({
        name: 'Croissance',
        color: 'bg-yellow-400',
        width: (methodData.growthDuration / totalDays) * 100,
        days: methodData.growthDuration
      });
    }
    
    return segments;
  };

  // Calculate progress cursor
  const getProgressPosition = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return null;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    const progress = (elapsed / total) * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  };

  const isProjectDateNear = (projectDate) => {
    const now = new Date();
    const target = new Date(projectDate);
    const daysUntil = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 3;
  };

  const getProjectTypeIcon = (type) => {
    switch (type) {
      case 'photo':
        return <ImageIcon className="w-4 h-4" />;
      case 'tournage':
        return <Video className="w-4 h-4" />;
      case 'test':
        return <FlaskConical className="w-4 h-4" />;
      default:
        return <ImageIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CalendarDays className="w-6 h-6" />
            Diagramme de Gantt - Projets de Contenu
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucun projet en cours</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Timeline header */}
              <div className="flex border-b pb-2">
                <div className="w-80 flex-shrink-0" />
                <div className="flex-1 flex overflow-x-auto">
                  {days.map((day, idx) => {
                    const isToday = day.toDateString() === new Date().toDateString();
                    return (
                      <div
                        key={idx}
                        className={`flex-1 text-center text-xs border-l px-1 ${isToday ? 'bg-blue-100' : ''}`}
                        style={{ minWidth: '50px' }}
                      >
                        <div className={`font-semibold ${isToday ? 'text-blue-700' : 'text-green-700'}`}>
                          {day.getDate()}
                        </div>
                        <div className="text-gray-500 text-[10px]">
                          {day.toLocaleDateString('fr-FR', { month: 'short' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Projects */}
              {projects.map((project) => {
                const projectProductions = allProductions.filter(p => p.projectId === project.id);
                const isNearDeadline = isProjectDateNear(project.projectDate);
                
                return (
                  <div key={project.id} className="space-y-3">
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-blue-800">{project.projectName}</h3>
                          <Badge variant="outline" className="gap-1">
                            {getProjectTypeIcon(project.projectType)}
                            {project.projectType}
                          </Badge>
                          {isNearDeadline && (
                            <Badge variant="destructive" className="animate-pulse">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Bientôt!
                            </Badge>
                          )}
                        </div>
                        {project.projectDescription && (
                          <p className="text-sm text-gray-600 mt-1">{project.projectDescription}</p>
                        )}
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>
                            <strong>Date:</strong>{' '}
                            {new Date(project.projectDate).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long'
                            })}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id, project.projectName)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    {projectProductions.map((production) => {
                      const barPos = getBarPosition(production.startDate, production.endDate);
                      const phaseSegments = getPhaseSegments(production);
                      const progressPercent = getProgressPosition(production.startDate, production.endDate);
                      
                      return (
                        <div key={production.id} className="flex items-center group hover:bg-gray-50 rounded-lg p-2 transition-colors ml-6">
                          <div className="w-72 flex-shrink-0 pr-4">
                            <div className="font-medium text-sm">{production.variety}</div>
                            <div className="text-xs text-gray-500">{production.method}</div>
                            <div className="flex items-center gap-2 mt-1">
                              {production.quantity && (
                                <span className="text-xs text-gray-400">{production.quantity}</span>
                              )}
                              {production.targetStage && (
                                <Badge variant="outline" className="text-xs">
                                  {production.targetStage}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 relative h-12 overflow-x-auto">
                            <div
                              className="absolute top-1/2 -translate-y-1/2 h-8 rounded shadow-md hover:shadow-lg transition-all cursor-pointer flex overflow-hidden"
                              style={{ left: barPos.left, width: barPos.width }}
                            >
                              {phaseSegments.map((phase, idx) => (
                                <div
                                  key={idx}
                                  className={`${phase.color} flex items-center justify-center text-xs font-medium text-white border-r border-white/30`}
                                  style={{ width: `${phase.width}%` }}
                                  title={`${phase.name}: ${phase.days}j`}
                                >
                                  {phase.width > 15 && <span className="truncate px-1">{phase.name}</span>}
                                </div>
                              ))}
                              
                              {progressPercent !== null && progressPercent < 100 && (
                                <div className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-lg" style={{ left: `${progressPercent}%` }}>
                                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500" />
                                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-red-500" />
                                </div>
                              )}
                            </div>
                            
                            {days.map((day, idx) => {
                              const isToday = day.toDateString() === new Date().toDateString();
                              return (
                                <div
                                  key={idx}
                                  className={`absolute top-0 bottom-0 border-l ${isToday ? 'border-blue-400 border-2' : 'border-gray-200'}`}
                                  style={{ left: `${(idx / daysDiff) * 100}%` }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {projects.length > 0 && (
            <div className="mt-8 pt-4 border-t space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Phases de production:</p>
                <div className="flex items-center gap-6 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded" />
                    <span>Trempage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded" />
                    <span>Germination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-600 rounded" />
                    <span>Obscurité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded" />
                    <span>Croissance</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Indicateur:</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1 h-6 bg-red-500" />
                  <span>Progression actuelle (aujourd'hui)</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GanttView;
