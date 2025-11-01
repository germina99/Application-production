import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getDailyTasks } from '../mock';

const DailyTasks = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const loadTasks = () => {
    const dailyTasks = getDailyTasks(selectedDate);
    setTasks(dailyTasks);
  };

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-100 border-red-300';
    return 'bg-white';
  };

  const completedCount = tasks.filter(t => completedTasks.has(t.id)).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Clock className="w-6 h-6" />
            Tâches quotidiennes
          </CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'PPP', { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Progress bar */}
        {tasks.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progression de la journée
              </span>
              <span className="text-sm font-semibold text-green-600">
                {completedCount} / {tasks.length} tâches
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tasks list */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucune tâche pour cette date.</p>
              <p className="text-sm mt-2">Sélectionnez une autre date ou créez une production.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                  completedTasks.has(task.id) ? 'bg-gray-50 opacity-60' : getPriorityColor(task.priority)
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={completedTasks.has(task.id)}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${
                        completedTasks.has(task.id) ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.task}
                      </h4>
                      {task.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-green-700">{task.variety}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {task.duration}
                      </Badge>
                      <span className="text-xs">{task.time}</span>
                    </div>
                    {task.projectName && (
                      <div className="mt-2">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {task.projectName}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {tasks.length > 0 && completedCount === tasks.length && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-800 font-medium">Toutes les tâches sont complétées! Excellent travail!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyTasks;