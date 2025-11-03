import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CalendarDays, Trash2, AlertCircle, Video, Image as ImageIcon, FlaskConical, Pencil } from 'lucide-react';
import { getAllProductions, getProjects, deleteProject, updateProject } from '../mock';
import { toast } from '../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

const GanttView = ({ refresh }) => {
  const [projects, setProjects] = useState([]);
  const [horizon, setHorizon] = useState(14); // 2 semaines par défaut
  const [editingProject, setEditingProject] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    projectName: '',
    projectDescription: '',
    projectDate: null,
    projectType: 'photo'
  });

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

  const handleEditProject = (project) => {
    setEditingProject(project);
    setEditForm({
      projectName: project.projectName,
      projectDescription: project.projectDescription || '',
      projectDate: project.projectDate ? new Date(project.projectDate) : null,
      projectType: project.projectType
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editForm.projectName || !editForm.projectDate) {
      toast({
        title: "Erreur",
        description: "Le nom et la date du projet sont requis",
        variant: "destructive"
      });
      return;
    }

    const updatedProject = {
      ...editingProject,
      projectName: editForm.projectName,
      projectDescription: editForm.projectDescription,
      projectDate: format(editForm.projectDate, 'yyyy-MM-dd'),
      projectType: editForm.projectType
    };

    updateProject(editingProject.id, updatedProject);
    loadData();
    setEditDialogOpen(false);
    setEditingProject(null);
    toast({
      title: "Projet modifié",
      description: `Le projet ${editForm.projectName} a été modifié avec succès.`
    });
  };

  const allProductions = getAllProductions();

  const getDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculer la plage basée sur l'horizon et les dates de production
    let earliestDate = new Date(today);
    let latestDate = new Date(today);
    
    if (allProductions.length > 0) {
      const dates = allProductions.flatMap(p => [
        new Date(p.startDate),
        new Date(p.endDate)
      ]);
      
      dates.forEach(d => d.setHours(0, 0, 0, 0));
      
      earliestDate = new Date(Math.min(today.getTime(), ...dates.map(d => d.getTime())));
      latestDate = new Date(Math.max(today.getTime(), ...dates.map(d => d.getTime())));
    }
    
    // S'assurer que l'horizon couvre au moins la période demandée
    const horizonEnd = new Date(today);
    horizonEnd.setDate(horizonEnd.getDate() + horizon);
    
    if (latestDate < horizonEnd) {
      latestDate = horizonEnd;
    }
    
    // Ajouter un jour de padding de chaque côté
    earliestDate.setDate(earliestDate.getDate() - 1);
    latestDate.setDate(latestDate.getDate() + 1);
    
    // Normaliser les dates
    earliestDate.setHours(0, 0, 0, 0);
    latestDate.setHours(0, 0, 0, 0);
    
    return { start: earliestDate, end: latestDate };
  };

  const { start: rangeStart, end: rangeEnd } = getDateRange();
  
  // Calculer le nombre exact de jours
  const daysDiff = Math.round((rangeEnd - rangeStart) / (1000 * 60 * 60 * 24));
  
  const days = Array.from({ length: daysDiff }, (_, i) => {
    const date = new Date(rangeStart);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const getBarPosition = (startDate, endDate, production) => {
    const start = new Date(startDate);
    start.setHours(10, 0, 0, 0); // Trempage commence à 10:00
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    const rangeStartNormalized = new Date(rangeStart);
    rangeStartNormalized.setHours(0, 0, 0, 0);
    
    // Calculer l'offset en heures depuis le début de la plage, puis convertir en jours
    const startOffsetHours = (start - rangeStartNormalized) / (1000 * 60 * 60);
    const startOffsetDays = startOffsetHours / 24;
    
    const endOffsetHours = (end - rangeStartNormalized) / (1000 * 60 * 60);
    const endOffsetDays = endOffsetHours / 24;
    
    const durationDays = endOffsetDays - startOffsetDays;
    
    return {
      left: `${(startOffsetDays / daysDiff) * 100}%`,
      width: `${(durationDays / daysDiff) * 100}%`
    };
  };

  // Get phase segments with darkness overlay
  const getPhaseSegments = (production) => {
    const methodData = production.methodData;
    
    // Trempage en heures (commence à 10:00, représenté comme fraction de jour)
    const soakHours = methodData.soakDuration;
    const soakDays = soakHours / 24; // Représentation exacte en jours
    
    const germinationDays = methodData.germinationDuration;
    const darkDays = methodData.darkDuration;
    const growthDays = methodData.growthDuration;
    const totalDays = soakDays + germinationDays + growthDays;
    
    const segments = [];
    
    // Trempage - représenté proportionnellement aux heures
    segments.push({
      name: 'Trempage',
      color: 'bg-blue-400',
      width: (soakDays / totalDays) * 100,
      days: soakDays,
      hours: soakHours,
      darkOverlay: false
    });
    
    // Germination (avec ou sans obscurité)
    if (darkDays > 0 && darkDays <= germinationDays) {
      // Obscurité pendant germination
      segments.push({
        name: 'Germination',
        color: 'bg-green-400',
        width: (germinationDays / totalDays) * 100,
        days: germinationDays,
        darkOverlay: true,
        darkDays: darkDays,
        darkPercentage: (darkDays / germinationDays) * 100
      });
    } else if (darkDays > germinationDays) {
      // Obscurité déborde sur la croissance
      segments.push({
        name: 'Germination',
        color: 'bg-green-400',
        width: (germinationDays / totalDays) * 100,
        days: germinationDays,
        darkOverlay: true,
        darkDays: germinationDays,
        darkPercentage: 100
      });
    } else {
      // Pas d'obscurité
      segments.push({
        name: 'Germination',
        color: 'bg-green-400',
        width: (germinationDays / totalDays) * 100,
        days: germinationDays,
        darkOverlay: false
      });
    }
    
    // Croissance (avec obscurité si elle déborde)
    if (growthDays > 0) {
      const darkInGrowth = Math.max(0, darkDays - germinationDays);
      if (darkInGrowth > 0) {
        segments.push({
          name: 'Croissance',
          color: 'bg-yellow-400',
          width: (growthDays / totalDays) * 100,
          days: growthDays,
          darkOverlay: true,
          darkDays: darkInGrowth,
          darkPercentage: (darkInGrowth / growthDays) * 100
        });
      } else {
        segments.push({
          name: 'Croissance',
          color: 'bg-yellow-400',
          width: (growthDays / totalDays) * 100,
          days: growthDays,
          darkOverlay: false
        });
      }
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
        <CardHeader className="border-b bg-gradient-to-r from-germina-light to-germina-light">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-germina">
                <CalendarDays className="w-6 h-6" />
                Diagramme de Gantt - Projets de Contenu
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant={horizon === 7 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHorizon(7)}
                className={horizon === 7 ? 'bg-germina' : ''}
              >
                1 semaine
              </Button>
              <Button
                variant={horizon === 14 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHorizon(14)}
                className={horizon === 14 ? 'bg-germina' : ''}
              >
                2 semaines
              </Button>
              <Button
                variant={horizon === 30 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHorizon(30)}
                className={horizon === 30 ? 'bg-germina' : ''}
              >
                1 mois
              </Button>
            </div>
          </div>
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
                        style={{ minWidth: '60px' }}
                      >
                        <div className={`font-semibold ${isToday ? 'text-blue-700' : 'text-germina'}`}>
                          {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                        </div>
                        <div className={`text-xs ${isToday ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
                          {day.getDate()} {day.toLocaleDateString('fr-FR', { month: 'short' })}
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
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1.5 rounded border border-blue-200">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-blue-800 truncate">{project.projectName}</h3>
                        <Badge variant="outline" className="gap-1 text-xs py-0 h-5 flex-shrink-0">
                          {getProjectTypeIcon(project.projectType)}
                          {project.projectType}
                        </Badge>
                        <span className="text-xs text-gray-600 flex-shrink-0">
                          {new Date(project.projectDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                        {isNearDeadline && (
                          <Badge variant="destructive" className="animate-pulse text-xs py-0 h-5 flex-shrink-0">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Bientôt!
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEditProject(project)}>
                          <Pencil className="w-3.5 h-3.5 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDeleteProject(project.id, project.projectName)}>
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      </div>
                    </div>

                    {/* Zone de productions avec grille de lignes */}
                    <div className="relative">
                      {/* Grille de lignes verticales - une seule fois pour tout le projet */}
                      <div className="absolute inset-0 pointer-events-none" style={{ left: '17rem' }}>
                        {days.map((day, idx) => {
                          const isToday = day.toDateString() === new Date().toDateString();
                          const isProjectDate = day.toDateString() === new Date(project.projectDate).toDateString();
                          
                          return (
                            <div key={idx} className="absolute top-0 bottom-0" style={{ left: `${(idx / daysDiff) * 100}%` }}>
                              {/* Ligne normale */}
                              <div className={`w-px h-full ${isToday || isProjectDate ? '' : 'border-l border-gray-200'}`} />
                              
                              {/* Ligne bleue pour aujourd'hui */}
                              {isToday && (
                                <div className="absolute top-0 bottom-0 w-1 bg-blue-500 opacity-50" style={{ left: '-2px' }}>
                                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full" />
                                </div>
                              )}
                              
                              {/* Ligne rouge pour la date du projet */}
                              {isProjectDate && (
                                <div className="absolute top-0 bottom-0 w-1 bg-red-500 opacity-70" style={{ left: '-2px' }}>
                                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    {projectProductions.map((production) => {
                      const barPos = getBarPosition(production.startDate, production.endDate, production);
                      const phaseSegments = getPhaseSegments(production);
                      const progressPercent = getProgressPosition(production.startDate, production.endDate);
                      
                      return (
                        <div key={production.id} className="flex items-center group hover:bg-gray-50 rounded p-1 transition-colors ml-4">
                          <div className="w-64 flex-shrink-0 pr-3">
                            <div className="font-medium text-xs">{production.variety}</div>
                            <div className="text-xs text-gray-500">{production.method}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {production.quantity && (
                                <span className="text-xs text-gray-400">{production.quantity}</span>
                              )}
                              {production.targetStage && (
                                <Badge variant="outline" className="text-xs py-0 h-4">
                                  {production.targetStage}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 relative h-10 overflow-x-auto">
                            <div
                              className="absolute top-1/2 -translate-y-1/2 h-8 rounded shadow-md hover:shadow-lg transition-all cursor-pointer flex overflow-hidden"
                              style={{ left: barPos.left, width: barPos.width }}
                            >
                              {phaseSegments.map((phase, idx) => (
                                <div
                                  key={idx}
                                  className={`relative ${phase.color} flex items-center justify-center text-xs font-medium text-white border-r border-white/30 overflow-hidden`}
                                  style={{ width: `${phase.width}%` }}
                                  title={`${phase.name}: ${phase.hours ? `${phase.hours}h (débute à 10:00)` : `${phase.days}j`}${phase.darkOverlay ? ` (dont ${phase.darkDays}j noir)` : ''}`}
                                >
                                  {phase.darkOverlay && (
                                    <div 
                                      className="absolute left-0 top-0 bottom-0 bg-gray-700 opacity-60"
                                      style={{ width: `${phase.darkPercentage}%` }}
                                    />
                                  )}
                                  {phase.width > 15 && (
                                    <span className="relative z-10 truncate px-1">
                                      {phase.name}
                                      {phase.darkOverlay && phase.width > 20 && (
                                        <span className="ml-1 text-[10px]">({phase.darkDays}j🌙)</span>
                                      )}
                                    </span>
                                  )}
                                </div>
                              ))}
                              
                              {progressPercent !== null && progressPercent < 100 && (
                                <div
                                  className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-lg"
                                  style={{ left: `${progressPercent}%` }}
                                >
                                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500" />
                                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-red-500" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    </div>
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
                    <div className="w-4 h-4 bg-green-400 rounded relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gray-700 opacity-60" />
                    </div>
                    <span>Germination (zone foncée = obscurité)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded" />
                    <span>Croissance</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Indicateurs:</p>
                <div className="flex items-center gap-6 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-500 opacity-50 relative">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full" />
                    </div>
                    <span>Aujourd'hui</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-red-500 opacity-70 relative">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
                    </div>
                    <span>Date du projet</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition de projet */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Nom du projet */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom du projet *</Label>
              <Input
                id="edit-name"
                value={editForm.projectName}
                onChange={(e) => setEditForm({ ...editForm, projectName: e.target.value })}
                placeholder="Ex: Contenu Instagram - Semaine 1"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.projectDescription}
                onChange={(e) => setEditForm({ ...editForm, projectDescription: e.target.value })}
                placeholder="Description du projet..."
                rows={3}
              />
            </div>

            {/* Type de projet */}
            <div className="space-y-2">
              <Label>Type de projet *</Label>
              <Select value={editForm.projectType} onValueChange={(value) => setEditForm({ ...editForm, projectType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Photo
                    </div>
                  </SelectItem>
                  <SelectItem value="tournage">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Tournage
                    </div>
                  </SelectItem>
                  <SelectItem value="test">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-4 h-4" />
                      Test
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date du projet */}
            <div className="space-y-2">
              <Label>Date du projet/événement *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editForm.projectDate ? format(editForm.projectDate, 'PPP', { locale: fr }) : 'Sélectionner une date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editForm.projectDate}
                    onSelect={(date) => setEditForm({ ...editForm, projectDate: date })}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveEdit} className="bg-germina hover:bg-germina-dark">
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GanttView;
