// Mock data for Germina production tracking

export const productionMethods = [
  'Germination en pot',
  'Germination sur plateau',
  'Micro-pousse sur terreau',
  'Micro-pousse hydroponique',
  'Micro-pousse sur tapis de chanvre'
];

export const seedVarieties = [
  'Brocoli',
  'Radis',
  'Tournesol',
  'Pois',
  'Sarrasin',
  'Roquette',
  'Moutarde',
  'Luzerne'
];

export const growthStages = [
  'Germination',
  'Jeune pousse',
  'Micro-pousse mature',
  'Prêt à récolter'
];

export const mockProductions = [
  {
    id: '1',
    variety: 'Brocoli',
    method: 'Micro-pousse sur terreau',
    startDate: '2025-07-01',
    endDate: '2025-07-12',
    projectDate: '2025-07-10',
    targetStage: 'Micro-pousse mature',
    soakDuration: 8,
    germinationDuration: 2,
    darkDuration: 3,
    growthDuration: 7,
    specialEquipment: 'Plateaux 10x20',
    projectName: 'Contenu Instagram - Semaine 1',
    status: 'en_cours'
  },
  {
    id: '2',
    variety: 'Radis',
    method: 'Germination en pot',
    startDate: '2025-07-05',
    endDate: '2025-07-10',
    projectDate: '2025-07-09',
    targetStage: 'Germination',
    soakDuration: 6,
    germinationDuration: 3,
    darkDuration: 0,
    growthDuration: 2,
    specialEquipment: 'Bocaux Mason 1L',
    projectName: 'Photo produit - Germination',
    status: 'en_cours'
  },
  {
    id: '3',
    variety: 'Tournesol',
    method: 'Micro-pousse hydroponique',
    startDate: '2025-07-03',
    endDate: '2025-07-15',
    projectDate: '2025-07-14',
    targetStage: 'Prêt à récolter',
    soakDuration: 12,
    germinationDuration: 2,
    darkDuration: 2,
    growthDuration: 8,
    specialEquipment: 'Système hydroponique',
    projectName: 'Vidéo tutoriel - Hydroponie',
    status: 'terminé'
  }
];

export const mockUser = {
  email: 'admin@germina.com',
  password: 'germina2025'
};

// Helper functions for mock data
export const saveMockProduction = (production) => {
  const stored = JSON.parse(localStorage.getItem('germina_productions') || '[]');
  const newProduction = {
    ...production,
    id: Date.now().toString()
  };
  stored.push(newProduction);
  localStorage.setItem('germina_productions', JSON.stringify(stored));
  return newProduction;
};

export const getMockProductions = () => {
  const stored = localStorage.getItem('germina_productions');
  if (!stored) {
    localStorage.setItem('germina_productions', JSON.stringify(mockProductions));
    return mockProductions;
  }
  return JSON.parse(stored);
};

export const updateMockProduction = (id, updates) => {
  const stored = JSON.parse(localStorage.getItem('germina_productions') || '[]');
  const index = stored.findIndex(p => p.id === id);
  if (index !== -1) {
    stored[index] = { ...stored[index], ...updates };
    localStorage.setItem('germina_productions', JSON.stringify(stored));
  }
  return stored[index];
};

export const deleteMockProduction = (id) => {
  const stored = JSON.parse(localStorage.getItem('germina_productions') || '[]');
  const filtered = stored.filter(p => p.id !== id);
  localStorage.setItem('germina_productions', JSON.stringify(filtered));
};

export const getDailyTasks = (date) => {
  const productions = getMockProductions();
  const tasks = [];
  
  productions.forEach(production => {
    if (production.status === 'terminé') return;
    
    const start = new Date(production.startDate);
    const current = new Date(date);
    const daysSinceStart = Math.floor((current - start) / (1000 * 60 * 60 * 24));
    
    // Trempage (jour 0)
    if (daysSinceStart === 0) {
      tasks.push({
        id: `${production.id}-soak`,
        productionId: production.id,
        variety: production.variety,
        task: 'Trempage des semences',
        duration: `${production.soakDuration}h`,
        time: 'Matin',
        projectName: production.projectName
      });
    }
    
    // Germination
    if (daysSinceStart > 0 && daysSinceStart <= production.germinationDuration) {
      tasks.push({
        id: `${production.id}-germ`,
        productionId: production.id,
        variety: production.variety,
        task: 'Vérifier germination',
        duration: '15 min',
        time: '2x/jour',
        projectName: production.projectName
      });
    }
    
    // Phase obscurité
    if (daysSinceStart > production.germinationDuration && 
        daysSinceStart <= production.germinationDuration + production.darkDuration) {
      tasks.push({
        id: `${production.id}-dark`,
        productionId: production.id,
        variety: production.variety,
        task: 'Maintenir dans le noir',
        duration: '10 min',
        time: 'Matin',
        projectName: production.projectName
      });
    }
    
    // Croissance
    if (daysSinceStart > production.germinationDuration + production.darkDuration) {
      tasks.push({
        id: `${production.id}-growth`,
        productionId: production.id,
        variety: production.variety,
        task: 'Arrosage et surveillance',
        duration: '20 min',
        time: '1-2x/jour',
        projectName: production.projectName
      });
    }
    
    // Récolte
    const end = new Date(production.endDate);
    const daysUntilHarvest = Math.floor((end - current) / (1000 * 60 * 60 * 24));
    if (daysUntilHarvest === 0) {
      tasks.push({
        id: `${production.id}-harvest`,
        productionId: production.id,
        variety: production.variety,
        task: 'Récolte prévue',
        duration: '1h',
        time: 'À planifier',
        projectName: production.projectName,
        priority: 'high'
      });
    }
  });
  
  return tasks;
};