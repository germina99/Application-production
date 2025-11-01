import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CalendarDays, Eye, Trash2 } from 'lucide-react';
import { getMockProductions, deleteMockProduction } from '../mock';
import { toast } from '../hooks/use-toast';

const GanttView = ({ refresh }) => {
  const [productions, setProductions] = useState([]);
  const [groupBy, setGroupBy] = useState('project'); // 'project' or 'all'

  useEffect(() => {
    loadProductions();
  }, [refresh]);

  const loadProductions = () => {
    const data = getMockProductions();
    setProductions(data.filter(p => p.status === 'en_cours'));
  };

  const handleDelete = (id) => {
    deleteMockProduction(id);
    loadProductions();
    toast({
      title: "Production supprimée",
      description: "La fiche de production a été supprimée."
    });
  };

  const getDateRange = () => {
    if (productions.length === 0) return { start: new Date(), end: new Date() };
    
    const dates = productions.flatMap(p => [
      new Date(p.startDate),
      new Date(p.endDate)
    ]);
    
    const start = new Date(Math.min(...dates));
    const end = new Date(Math.max(...dates));
    
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

  const groupedProductions = () => {
    if (groupBy === 'all') {
      return [{ name: 'Toutes les productions', items: productions }];
    }
    
    const groups = {};
    productions.forEach(p => {
      const project = p.projectName || 'Sans projet';
      if (!groups[project]) groups[project] = [];
      groups[project].push(p);
    });
    
    return Object.entries(groups).map(([name, items]) => ({ name, items }));
  };

  const getProgressColor = (production) => {
    const now = new Date();
    const start = new Date(production.startDate);
    const end = new Date(production.endDate);
    
    if (now < start) return 'bg-gray-300';
    if (now > end) return 'bg-green-500';
    
    const total = end - start;
    const elapsed = now - start;
    const progress = elapsed / total;
    
    if (progress < 0.3) return 'bg-blue-400';
    if (progress < 0.7) return 'bg-yellow-400';
    return 'bg-orange-400';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CalendarDays className="w-6 h-6" />
              Diagramme de Gantt - Suivi des Productions
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={groupBy === 'project' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGroupBy('project')}
                className={groupBy === 'project' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Par projet
              </Button>
              <Button
                variant={groupBy === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGroupBy('all')}
                className={groupBy === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Vue globale
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {productions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucune production en cours. Créez votre première fiche!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Timeline header */}
              <div className="flex border-b pb-2">
                <div className="w-64 flex-shrink-0" />
                <div className="flex-1 flex">
                  {days.map((day, idx) => (
                    <div
                      key={idx}
                      className="flex-1 text-center text-xs border-l px-1"
                      style={{ minWidth: '60px' }}
                    >
                      <div className="font-semibold text-green-700">
                        {day.getDate()}
                      </div>
                      <div className="text-gray-500">
                        {day.toLocaleDateString('fr-FR', { month: 'short' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Production groups */}
              {groupedProductions().map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-3">
                  {groupBy === 'project' && (
                    <h3 className="font-semibold text-lg text-green-800 border-b pb-2">
                      {group.name}
                    </h3>
                  )}
                  {group.items.map((production) => {
                    const barPos = getBarPosition(production.startDate, production.endDate);
                    const colorClass = getProgressColor(production);
                    
                    return (
                      <div key={production.id} className="flex items-center group hover:bg-gray-50 rounded-lg p-2 transition-colors">
                        {/* Production info */}
                        <div className="w-64 flex-shrink-0 pr-4">
                          <div className="font-medium text-sm">{production.variety}</div>
                          <div className="text-xs text-gray-500">{production.method}</div>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {production.targetStage}
                          </Badge>
                        </div>

                        {/* Gantt bar */}
                        <div className="flex-1 relative h-10">
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 h-8 ${colorClass} rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center text-xs font-medium text-white overflow-hidden`}
                            style={barPos}
                          >
                            <span className="px-2 truncate">
                              {production.variety}
                            </span>
                          </div>
                          {/* Grid lines */}
                          {days.map((_, idx) => (
                            <div
                              key={idx}
                              className="absolute top-0 bottom-0 border-l border-gray-200"
                              style={{ left: `${(idx / daysDiff) * 100}%` }}
                            />
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="ml-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(production.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          {productions.length > 0 && (
            <div className="mt-8 pt-4 border-t">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded" />
                  <span>En cours (début)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded" />
                  <span>En cours (milieu)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-400 rounded" />
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