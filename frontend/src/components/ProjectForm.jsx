import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Plus, Trash2, Camera, Save } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { getProductSheets, growthStages, saveProject, calculateEndDate } from '../mock';

const ProjectForm = ({ onProjectCreated }) => {
  const [productSheets, setProductSheets] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectDate, setProjectDate] = useState(null);
  const [targetStage, setTargetStage] = useState('');
  const [productions, setProductions] = useState([]);

  useEffect(() => {
    loadProductSheets();
  }, []);

  const loadProductSheets = () => {
    const sheets = getProductSheets();
    setProductSheets(sheets);
  };

  const addProduction = () => {
    setProductions(prev => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        productSheetId: '',
        variety: '',
        method: '',
        startDate: null,
        quantity: '',
        notes: '',
        availableMethods: []
      }
    ]);
  };

  const removeProduction = (id) => {
    setProductions(prev => prev.filter(p => p.id !== id));
  };

  const updateProduction = (id, field, value) => {
    setProductions(prev => prev.map(p => {
      if (p.id !== id) return p;
      
      const updated = { ...p, [field]: value };
      
      // When product sheet is selected, update variety and available methods
      if (field === 'productSheetId') {
        const sheet = productSheets.find(s => s.id === value);
        if (sheet) {
          updated.variety = sheet.variety;
          updated.availableMethods = Object.keys(sheet.methods);
          updated.method = ''; // Reset method selection
        }
      }
      
      return updated;
    }));
  };

  const calculateSuggestedStartDate = (productSheetId, method) => {
    if (!projectDate || !productSheetId || !method) return null;
    
    const sheet = productSheets.find(s => s.id === productSheetId);
    if (!sheet || !sheet.methods[method]) return null;
    
    const methodData = sheet.methods[method];
    const totalDays = 
      Math.ceil(methodData.soakDuration / 24) +
      methodData.germinationDuration +
      methodData.darkDuration +
      methodData.growthDuration;
    
    const suggested = new Date(projectDate);
    suggested.setDate(suggested.getDate() - totalDays);
    return suggested;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!projectName || !projectDate || productions.length === 0) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir le nom du projet, la date et ajouter au moins une production.",
        variant: "destructive"
      });
      return;
    }

    // Validate all productions
    const invalidProduction = productions.find(
      p => !p.productSheetId || !p.method || !p.startDate
    );
    
    if (invalidProduction) {
      toast({
        title: "Productions incomplètes",
        description: "Veuillez remplir tous les champs pour chaque production.",
        variant: "destructive"
      });
      return;
    }

    const project = {
      projectName,
      projectDate: format(projectDate, 'yyyy-MM-dd'),
      targetStage,
      productions: productions.map(p => ({
        productSheetId: p.productSheetId,
        variety: p.variety,
        method: p.method,
        startDate: format(p.startDate, 'yyyy-MM-dd'),
        quantity: p.quantity,
        notes: p.notes
      }))
    };

    saveProject(project);
    
    toast({
      title: "Projet créé!",
      description: `Projet "${projectName}" créé avec ${productions.length} production(s).`
    });

    // Reset form
    setProjectName('');
    setProjectDate(null);
    setTargetStage('');
    setProductions([]);

    if (onProjectCreated) onProjectCreated();
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl text-blue-800">
          <Camera className="w-7 h-7" />
          Nouveau Projet de Contenu
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Planifiez vos productions pour créer du contenu visuel
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Nom du projet *</Label>
              <Input
                placeholder="Ex: Contenu Instagram - Juillet"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Date du projet *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {projectDate ? format(projectDate, 'PPP', { locale: fr }) : 'Choisir'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={projectDate}
                    onSelect={setProjectDate}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Stade voulu pour le projet</Label>
            <Select value={targetStage} onValueChange={setTargetStage}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un stade" />
              </SelectTrigger>
              <SelectContent>
                {growthStages.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Productions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Productions *</Label>
              <Button
                type="button"
                onClick={addProduction}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une production
              </Button>
            </div>

            {productions.length === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Aucune production ajoutée</p>
                <p className="text-sm mt-1">Cliquez sur "Ajouter une production" pour commencer</p>
              </div>
            )}

            {productions.map((prod, idx) => {
              const suggestedStart = calculateSuggestedStartDate(prod.productSheetId, prod.method);
              
              return (
                <div key={prod.id} className="bg-gray-50 p-4 rounded-lg space-y-4 border">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Production {idx + 1}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProduction(prod.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Fiche produit</Label>
                      <Select
                        value={prod.productSheetId}
                        onValueChange={(val) => updateProduction(prod.id, 'productSheetId', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une variété" />
                        </SelectTrigger>
                        <SelectContent>
                          {productSheets.map(sheet => (
                            <SelectItem key={sheet.id} value={sheet.id}>
                              {sheet.variety}
                              {sheet.description && (
                                <span className="text-xs text-gray-500 ml-2">- {sheet.description}</span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Méthode</Label>
                      <Select
                        value={prod.method}
                        onValueChange={(val) => updateProduction(prod.id, 'method', val)}
                        disabled={!prod.productSheetId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une méthode" />
                        </SelectTrigger>
                        <SelectContent>
                          {prod.availableMethods.map(method => (
                            <SelectItem key={method} value={method}>{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Date de début</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {prod.startDate ? format(prod.startDate, 'PPP', { locale: fr }) : 'Choisir'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={prod.startDate}
                            onSelect={(date) => updateProduction(prod.id, 'startDate', date)}
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>
                      {suggestedStart && (
                        <p className="text-xs text-blue-600">
                          Suggéré: {format(suggestedStart, 'PPP', { locale: fr })}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Quantité</Label>
                      <Input
                        placeholder="Ex: 2 plateaux, 3 bocaux..."
                        value={prod.quantity}
                        onChange={(e) => updateProduction(prod.id, 'quantity', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Notes</Label>
                    <Textarea
                      placeholder="Notes spécifiques pour cette production..."
                      value={prod.notes}
                      onChange={(e) => updateProduction(prod.id, 'notes', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Créer le projet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectForm;