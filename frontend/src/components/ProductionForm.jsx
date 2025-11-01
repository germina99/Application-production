import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Plus, Sprout } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { productionMethods, seedVarieties, growthStages, saveMockProduction } from '../mock';

const ProductionForm = ({ onProductionCreated }) => {
  const [formData, setFormData] = useState({
    variety: '',
    method: '',
    startDate: null,
    endDate: null,
    projectDate: null,
    projectName: '',
    targetStage: '',
    soakDuration: '',
    germinationDuration: '',
    darkDuration: '',
    growthDuration: '',
    specialEquipment: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.variety || !formData.method || !formData.startDate) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir la variété, méthode et date de début.",
        variant: "destructive"
      });
      return;
    }

    const production = {
      ...formData,
      startDate: formData.startDate ? format(formData.startDate, 'yyyy-MM-dd') : null,
      endDate: formData.endDate ? format(formData.endDate, 'yyyy-MM-dd') : null,
      projectDate: formData.projectDate ? format(formData.projectDate, 'yyyy-MM-dd') : null,
      status: 'en_cours'
    };

    saveMockProduction(production);
    
    toast({
      title: "Production créée!",
      description: `Fiche de production pour ${formData.variety} créée avec succès.`
    });

    // Reset form
    setFormData({
      variety: '',
      method: '',
      startDate: null,
      endDate: null,
      projectDate: null,
      projectName: '',
      targetStage: '',
      soakDuration: '',
      germinationDuration: '',
      darkDuration: '',
      growthDuration: '',
      specialEquipment: '',
      notes: ''
    });

    if (onProductionCreated) onProductionCreated();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl text-green-800">
          <Sprout className="w-7 h-7" />
          Nouvelle Fiche de Production
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="variety">Variété de semence *</Label>
              <Select value={formData.variety} onValueChange={(val) => handleChange('variety', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une variété" />
                </SelectTrigger>
                <SelectContent>
                  {seedVarieties.map(variety => (
                    <SelectItem key={variety} value={variety}>{variety}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Méthode de production *</Label>
              <Select value={formData.method} onValueChange={(val) => handleChange('method', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  {productionMethods.map(method => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom du projet</Label>
              <Input
                placeholder="Ex: Contenu Instagram Juillet"
                value={formData.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Stade voulu pour le projet</Label>
              <Select value={formData.targetStage} onValueChange={(val) => handleChange('targetStage', val)}>
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
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date de début *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, 'PPP', { locale: fr }) : 'Choisir'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleChange('startDate', date)}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, 'PPP', { locale: fr }) : 'Choisir'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => handleChange('endDate', date)}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Date du projet</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.projectDate ? format(formData.projectDate, 'PPP', { locale: fr }) : 'Choisir'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.projectDate}
                    onSelect={(date) => handleChange('projectDate', date)}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Durations */}
          <div className="bg-green-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold text-green-800">Durées des phases</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Trempage (heures)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="8"
                  value={formData.soakDuration}
                  onChange={(e) => handleChange('soakDuration', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Germination (jours)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="2"
                  value={formData.germinationDuration}
                  onChange={(e) => handleChange('germinationDuration', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Noir (jours)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="3"
                  value={formData.darkDuration}
                  onChange={(e) => handleChange('darkDuration', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Croissance (jours)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="7"
                  value={formData.growthDuration}
                  onChange={(e) => handleChange('growthDuration', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Equipment & Notes */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Équipement spécial</Label>
              <Input
                placeholder="Ex: Plateaux 10x20, Bocaux Mason, etc."
                value={formData.specialEquipment}
                onChange={(e) => handleChange('specialEquipment', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes additionnelles</Label>
              <Textarea
                placeholder="Observations, remarques..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Créer la fiche de production
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductionForm;