import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CalendarDays, Trash2, AlertCircle } from 'lucide-react';
import { getAllProductions, getProjects, deleteProject } from '../mock';
import { toast } from '../hooks/use-toast';

const GanttView = ({ refresh }) => {
  const [projects, setProjects] = useState([]);
  const [groupBy, setGroupBy] = useState('project');

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
    
    // Add some padding
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

  const getProgressColor = (production) => {
    const now = new Date();
    const start = new Date(production.startDate);
    const end = new Date(production.endDate);
    
    if (now < start) return 'bg-gray-400';
    if (now > end) return 'bg-green-500';
    
    const total = end - start;
    const elapsed = now - start;
    const progress = elapsed / total;
    
    if (progress < 0.3) return 'bg-blue-500';
    if (progress < 0.7) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  // Check if project date is approaching
  const isProjectDateNear = (projectDate) => {
    const now = new Date();
    const target = new Date(projectDate);
    const daysUntil = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 3;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CalendarDays className="w-6 h-6" />
                Diagramme de Gantt - Projets de Contenu
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Visualisez toutes vos productions groupées par projet
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucun projet en cours</p>
              <p className="text-sm mt-2">Créez votre premier projet pour commencer</p>
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
                        className={`flex-1 text-center text-xs border-l px-1 ${
                          isToday ? 'bg-blue-100' : ''
                        }`}
                        style={{ minWidth: '50px' }}
                      >
                        <div className={`font-semibold ${
                          isToday ? 'text-blue-700' : 'text-green-700'
                        }`}>
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
                    {/* Project header */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-blue-800">{project.projectName}</h3>
                          {isNearDeadline && (
                            <Badge variant="destructive" className="animate-pulse">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Bientôt!
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>
                            <strong>Date projet:</strong>{' '}
                            {new Date(project.projectDate).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long'
                            })}
                          </span>
                          {project.targetStage && (
                            <Badge variant="outline" className="text-xs">
                              {project.targetStage}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {projectProductions.length} production(s)
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id, project.projectName)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    {/* Productions in this project */}
                    {projectProductions.map((production) => {
                      const barPos = getBarPosition(production.startDate, production.endDate);
                      const colorClass = getProgressColor(production);
                      
                      return (
                        <div key={production.id} className="flex items-center group hover:bg-gray-50 rounded-lg p-2 transition-colors ml-6">
                          {/* Production info */}
                          <div className="w-72 flex-shrink-0 pr-4">
                            <div className="font-medium text-sm">{production.variety}</div>
                            <div className="text-xs text-gray-500">{production.method}</div>
                            {production.quantity && (
                              <div className="text-xs text-gray-400 mt-1">{production.quantity}</div>
                            )}
                          </div>

                          {/* Gantt bar */}
                          <div className="flex-1 relative h-10 overflow-x-auto">
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 h-7 ${colorClass} rounded shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center text-xs font-medium text-white overflow-hidden`}
                              style={barPos}
                              title={`${production.variety} - ${production.startDate} à ${production.endDate}`}
                            >
                              <span className="px-2 truncate">
                                {production.variety}
                              </span>
                            </div>
                            {/* Grid lines */}
                            {days.map((day, idx) => {
                              const isToday = day.toDateString() === new Date().toDateString();
                              return (
                                <div
                                  key={idx}
                                  className={`absolute top-0 bottom-0 border-l ${
                                    isToday ? 'border-blue-400 border-2' : 'border-gray-200'
                                  }`}
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

          {/* Legend */}
          {projects.length > 0 && (
            <div className="mt-8 pt-4 border-t">
              <div className="flex items-center gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded" />
                  <span>À venir</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <span>En cours (début)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded" />
                  <span>En cours (milieu)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded" />
                  <span>Proche récolte</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span>Terminé</span>
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