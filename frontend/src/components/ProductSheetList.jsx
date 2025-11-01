import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Leaf, Trash2, Clock } from 'lucide-react';
import { getProductSheets, deleteProductSheet } from '../mock';
import { toast } from '../hooks/use-toast';

const ProductSheetList = ({ refresh }) => {
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    loadSheets();
  }, [refresh]);

  const loadSheets = () => {
    const data = getProductSheets();
    setSheets(data);
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Leaf className="w-6 h-6 text-green-600" />
        Fiches Produits ({sheets.length})
      </h2>
      
      {sheets.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <Leaf className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Aucune fiche produit créée</p>
            <p className="text-sm mt-2">Créez votre première fiche pour définir vos variétés</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sheets.map(sheet => (
            <Card key={sheet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-green-800">{sheet.variety}</CardTitle>
                    {sheet.description && (
                      <p className="text-sm text-gray-600 mt-1">{sheet.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(sheet.id, sheet.variety)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{Object.keys(sheet.methods).length} méthode(s) configurée(s)</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(sheet.methods).map(([methodName, methodData]) => {
                    const totalDays = 
                      Math.ceil(methodData.soakDuration / 24) +
                      methodData.germinationDuration +
                      methodData.darkDuration +
                      methodData.growthDuration;
                    
                    return (
                      <div key={methodName} className="bg-green-50 p-3 rounded border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800">{methodName}</span>
                          <Badge variant="secondary" className="text-xs">
                            ~{totalDays} jours
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
                          <div>
                            <span className="text-gray-500">Trempage:</span>
                            <div className="font-medium">{methodData.soakDuration}h</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Germ:</span>
                            <div className="font-medium">{methodData.germinationDuration}j</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Noir:</span>
                            <div className="font-medium">{methodData.darkDuration}j</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Croiss:</span>
                            <div className="font-medium">{methodData.growthDuration}j</div>
                          </div>
                        </div>
                        {methodData.tasks.length > 0 && (
                          <div className="mt-2 text-xs text-gray-600">
                            <span className="text-gray-500">Tâches:</span> {methodData.tasks.join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSheetList;