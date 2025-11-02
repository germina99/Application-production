import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Leaf, Trash2, Edit2, Search } from 'lucide-react';
import { getProductSheets, deleteProductSheet, getTimeOfDayFromFrequency } from '../mock';
import { toast } from '../hooks/use-toast';
import ProductSheetForm from './ProductSheetForm';

const ProductSheetList = ({ refresh }) => {
  const [sheets, setSheets] = useState([]);
  const [editingSheet, setEditingSheet] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSheets();
  }, [refresh]);

  const loadSheets = () => {
    const data = getProductSheets();
    // Trier par ordre alphabétique de variété
    const sortedData = data.sort((a, b) => a.variety.localeCompare(b.variety, 'fr', { sensitivity: 'base' }));
    setSheets(sortedData);
  };

  const handleDelete = (id, variety) => {
    if (window.confirm(`Supprimer la fiche produit "${variety}" ?`)) {
      deleteProductSheet(id);
      loadSheets();
      toast({
        title: "Fiche supprimée",
        description: `La fiche produit ${variety} a été supprimée.`
      });
    }
  };

  const handleEdit = (sheet) => {
    setEditingSheet(sheet);
  };

  const handleEditComplete = () => {
    setEditingSheet(null);
    loadSheets();
  };

  // Filtrer les fiches selon la recherche
  const filteredSheets = sheets.filter(sheet => 
    sheet.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sheet.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (editingSheet) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setEditingSheet(null)}
          className="mb-4"
        >
          ← Retour à la liste
        </Button>
        <ProductSheetForm
          editMode={true}
          existingSheet={editingSheet}
          onSheetCreated={handleEditComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Leaf className="w-6 h-6 text-green-600" />
          Fiches Produits ({filteredSheets.length})
        </h2>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Rechercher une variété..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-base"
        />
      </div>
      
      {sheets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <Leaf className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Aucune fiche produit créée</p>
            <p className="text-sm mt-2">Créez votre première fiche pour définir vos variétés</p>
          </CardContent>
        </Card>
      ) : filteredSheets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Aucune variété ne correspond à "{searchQuery}"</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSheets.map(sheet => (
            <Card key={sheet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-green-800">{sheet.variety}</CardTitle>
                    {sheet.description && (
                      <p className="text-sm text-gray-600 mt-1">{sheet.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(sheet)}
                    >
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sheet.id, sheet.variety)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(sheet.methods).map(([methodName, methodData]) => {
                  const totalDays = 
                    Math.ceil(methodData.soakDuration / 24) +
                    methodData.germinationDuration +
                    methodData.darkDuration +
                    methodData.growthDuration;
                  
                  return (
                    <div key={methodName} className="bg-green-50 p-2 rounded border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{methodName}</span>
                        <Badge variant="secondary" className="text-xs">
                          ~{totalDays} jours
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSheetList;