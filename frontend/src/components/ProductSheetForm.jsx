import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Plus, Trash2, Leaf, Save } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { productionMethods, saveProductSheet, updateProductSheet } from '../mock';

const ProductSheetForm = ({ onSheetCreated, editMode = false, existingSheet = null }) => {
  const [variety, setVariety] = useState('');
  const [description, setDescription] = useState('');
  const [methods, setMethods] = useState({});
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [taskInput, setTaskInput] = useState('');

  useEffect(() => {
    if (editMode && existingSheet) {
      setVariety(existingSheet.variety);
      setDescription(existingSheet.description || '');
      setMethods(existingSheet.methods || {});
      if (Object.keys(existingSheet.methods).length > 0) {
        setSelectedMethod(Object.keys(existingSheet.methods)[0]);
      }
    }
  }, [editMode, existingSheet]);

  const addMethod = (method) => {
    if (methods[method]) return;
    
    // Get default tasks for this method
    const defaultTasks = getDefaultTasksByMethod(method);
    
    setMethods(prev => ({
      ...prev,
      [method]: {
        soakDuration: 8,
        germinationDuration: 2,
        darkDuration: 2,
        growthDuration: 7,
        specialEquipment: '',
        tasks: defaultTasks
      }
    }));
    setSelectedMethod(method);
  };

  const removeMethod = (method) => {
    const newMethods = { ...methods };
    delete newMethods[method];
    setMethods(newMethods);
    if (selectedMethod === method) {
      const remaining = Object.keys(newMethods);
      setSelectedMethod(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const updateMethodField = (method, field, value) => {
    setMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value
      }
    }));
  };

  const addTask = (method) => {
    if (!taskInput.trim()) return;
    
    setMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        tasks: [...prev[method].tasks, taskInput.trim()]
      }
    }));
    setTaskInput('');
  };

  const removeTask = (method, taskIndex) => {
    setMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        tasks: prev[method].tasks.filter((_, idx) => idx !== taskIndex)
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!variety || Object.keys(methods).length === 0) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir la variété et au moins une méthode.",
        variant: "destructive"
      });
      return;
    }

    const sheet = {
      variety,
      description,
      methods
    };

    if (editMode && existingSheet) {
      updateProductSheet(existingSheet.id, sheet);
      toast({
        title: "Fiche modifiée!",
        description: `Fiche pour ${variety} mise à jour avec succès.`
      });
    } else {
      saveProductSheet(sheet);
      toast({
        title: "Fiche produit créée!",
        description: `Fiche pour ${variety} créée avec succès.`
      });
    }

    if (!editMode) {
      // Reset form only for new creation
      setVariety('');
      setDescription('');
      setMethods({});
      setSelectedMethod(null);
    }

    if (onSheetCreated) onSheetCreated();
  };

  const availableMethods = productionMethods.filter(m => !methods[m]);

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl text-green-800">
          <Leaf className="w-7 h-7" />
          {editMode ? 'Modifier la Fiche Produit' : 'Nouvelle Fiche Produit'}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Définissez les caractéristiques d'une variété selon les différentes méthodes de production
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="variety">Variété de semence *</Label>
              <Input
                id="variety"
                placeholder="Ex: Brocoli, Radis, Tournesol..."
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Saveur, caractéristiques..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Methods */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Méthodes de production *</Label>
              {availableMethods.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {availableMethods.map(method => (
                    <Button
                      key={method}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addMethod(method)}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {method}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Method tabs */}
            {Object.keys(methods).length > 0 && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(methods).map(method => (
                    <Badge
                      key={method}
                      variant={selectedMethod === method ? "default" : "outline"}
                      className="cursor-pointer px-3 py-2 text-sm"
                      onClick={() => setSelectedMethod(method)}
                    >
                      {method}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMethod(method);
                        }}
                        className="ml-2 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* Method details */}
                {selectedMethod && methods[selectedMethod] && (
                  <div className="bg-green-50 p-4 rounded-lg space-y-4">
                    <h4 className="font-semibold text-green-800">{selectedMethod}</h4>
                    
                    {/* Durations */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Trempage (h)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={methods[selectedMethod].soakDuration}
                          onChange={(e) => updateMethodField(selectedMethod, 'soakDuration', Number(e.target.value))}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Germination (j)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={methods[selectedMethod].germinationDuration}
                          onChange={(e) => updateMethodField(selectedMethod, 'germinationDuration', Number(e.target.value))}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Noir (j)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={methods[selectedMethod].darkDuration}
                          onChange={(e) => updateMethodField(selectedMethod, 'darkDuration', Number(e.target.value))}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Croissance (j)</Label>
                        <Input
                          type="number"
                          min="0"
                          value={methods[selectedMethod].growthDuration}
                          onChange={(e) => updateMethodField(selectedMethod, 'growthDuration', Number(e.target.value))}
                          className="h-9"
                        />
                      </div>
                    </div>

                    {/* Equipment */}
                    <div className="space-y-2">
                      <Label className="text-sm">Équipement spécial</Label>
                      <Input
                        placeholder="Ex: Plateaux 10x20, Bocaux Mason..."
                        value={methods[selectedMethod].specialEquipment}
                        onChange={(e) => updateMethodField(selectedMethod, 'specialEquipment', e.target.value)}
                      />
                    </div>

                    {/* Tasks */}
                    <div className="space-y-2">
                      <Label className="text-sm">Tâches récurrentes</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ex: Rinçage 2x/jour, Arrosage..."
                          value={taskInput}
                          onChange={(e) => setTaskInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTask(selectedMethod))}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addTask(selectedMethod)}
                          size="sm"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {methods[selectedMethod].tasks.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {methods[selectedMethod].tasks.map((task, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border">
                              <span className="flex-1 text-sm">{task}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTask(selectedMethod, idx)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            {editMode ? 'Enregistrer les modifications' : 'Créer la fiche produit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductSheetForm;