// Mock data for Germina production tracking

export const productionMethods = [
  'Germination en pot',
  'Germination sur plateau',
  'Micro-pousse sur terreau',
  'Micro-pousse hydroponique',
  'Micro-pousse sur tapis de chanvre'
];

// Growth stages by production type
export const getStagesByMethodType = (method) => {
  const methodLower = method.toLowerCase();
  
  // Germination types
  if (methodLower.includes('germination')) {
    return [
      'Après trempage',
      'Germination',
      'Jeune germe',
      'Germe mature',
      'Prêt à récolter'
    ];
  }
  
  // Micro-pousse types
  if (methodLower.includes('micro-pousse')) {
    return [
      'Après trempage',
      'Germination',
      'Jeune germe',
      'Germe mature',
      'Prêt à récolter'
    ];
  }
  
  // Default stages
  return [
    'Après trempage',
    'Germination',
    'Jeune germe',
    'Germe mature',
    'Prêt à récolter'
  ];
};

// Default tasks by method type
export const getDefaultTasksByMethod = (method) => {
  const methodLower = method.toLowerCase();
  
  if (methodLower.includes('germination en pot')) {
    return ['Rinçage 2x/jour', 'Vérifier humidité'];
  }
  
  if (methodLower.includes('germination sur plateau')) {
    return ['Brumisation', 'Vérifier humidité', 'Rotation des plateaux'];
  }
  
  if (methodLower.includes('micro-pousse sur terreau')) {
    return ['Arrosage quotidien', 'Rotation des plateaux', 'Vérifier moisissure'];
  }
  
  if (methodLower.includes('micro-pousse hydroponique')) {
    return ['Vérifier pH eau', 'Nettoyer système', 'Contrôler température'];
  }
  
  if (methodLower.includes('micro-pousse sur tapis de chanvre')) {
    return ['Arrosage par vaporisation', 'Maintenir humidité tapis'];
  }
  
  return ['Arrosage', 'Surveillance'];
};

// Product sheets - templates for seed varieties
export const mockProductSheets = [
  {
    id: '1',
    variety: 'Brocoli',
    description: 'Micro-pousse au goût légèrement piquant',
    methods: {
      'Germination en pot': {
        soakDuration: 6,
        germinationDuration: 2,
        darkDuration: 0,
        growthDuration: 3,
        specialEquipment: 'Bocaux Mason 1L',
        tasks: ['Rinçage 2x/jour', 'Vérifier humidité']
      },
      'Micro-pousse sur terreau': {
        soakDuration: 8,
        germinationDuration: 2,
        darkDuration: 3,
        growthDuration: 7,
        specialEquipment: 'Plateaux 10x20',
        tasks: ['Arrosage quotidien', 'Rotation des plateaux', 'Vérifier moisissure']
      }
    }
  },
  {
    id: '2',
    variety: 'Radis',
    description: 'Saveur piquante et croquante',
    methods: {
      'Germination en pot': {
        soakDuration: 6,
        germinationDuration: 3,
        darkDuration: 0,
        growthDuration: 2,
        specialEquipment: 'Bocaux Mason 1L',
        tasks: ['Rinçage 2x/jour', 'Vérifier humidité']
      },
      'Germination sur plateau': {
        soakDuration: 6,
        germinationDuration: 2,
        darkDuration: 1,
        growthDuration: 3,
        specialEquipment: 'Plateaux avec couvercle',
        tasks: ['Brumisation', 'Vérifier humidité', 'Rotation des plateaux']
      },
      'Micro-pousse sur terreau': {
        soakDuration: 8,
        germinationDuration: 2,
        darkDuration: 2,
        growthDuration: 5,
        specialEquipment: 'Plateaux 10x20',
        tasks: ['Arrosage quotidien', 'Rotation des plateaux', 'Vérifier moisissure']
      }
    }
  },
  {
    id: '3',
    variety: 'Tournesol',
    description: 'Riche en protéines, saveur de noisette',
    methods: {
      'Micro-pousse hydroponique': {
        soakDuration: 12,
        germinationDuration: 2,
        darkDuration: 2,
        growthDuration: 8,
        specialEquipment: 'Système hydroponique',
        tasks: ['Vérifier pH eau', 'Nettoyer système', 'Contrôler température']
      },
      'Micro-pousse sur terreau': {
        soakDuration: 12,
        germinationDuration: 2,
        darkDuration: 3,
        growthDuration: 10,
        specialEquipment: 'Plateaux profonds',
        tasks: ['Arrosage quotidien', 'Rotation des plateaux', 'Vérifier moisissure']
      }
    }
  }
];

// Project sheets - actual production projects
export const mockProjects = [
  {
    id: '1',
    projectName: 'Contenu Instagram - Semaine 1',
    projectDescription: 'Photos pour le feed Instagram',
    projectDate: '2025-07-10',
    projectType: 'photo',
    productions: [
      {
        id: 'prod-1',
        productSheetId: '1',
        variety: 'Brocoli',
        method: 'Micro-pousse sur terreau',
        targetStage: 'Prêt à récolter',
        startDate: '2025-07-01',
        quantity: '2 plateaux',
        notes: 'Pour photo macro'
      },
      {
        id: 'prod-2',
        productSheetId: '2',
        variety: 'Radis',
        method: 'Micro-pousse sur terreau',
        targetStage: 'Germe mature',
        startDate: '2025-07-03',
        quantity: '1 plateau',
        notes: 'Contraste de couleur'
      }
    ],
    status: 'en_cours'
  },
  {
    id: '2',
    projectName: 'Photo produit - Germination',
    projectDescription: 'Photos produits pour le site web',
    projectDate: '2025-07-09',
    projectType: 'photo',
    productions: [
      {
        id: 'prod-3',
        productSheetId: '2',
        variety: 'Radis',
        method: 'Germination en pot',
        targetStage: 'Germination',
        startDate: '2025-07-05',
        quantity: '3 bocaux',
        notes: 'Différents stades'
      }
    ],
    status: 'en_cours'
  }
];

// Helper functions for product sheets
export const getProductSheets = () => {
  const stored = localStorage.getItem('germina_product_sheets');
  if (!stored) {
    localStorage.setItem('germina_product_sheets', JSON.stringify(mockProductSheets));
    return mockProductSheets;
  }
  return JSON.parse(stored);
};

export const saveProductSheet = (sheet) => {
  const stored = getProductSheets();
  const newSheet = {
    ...sheet,
    id: Date.now().toString()
  };
  stored.push(newSheet);
  localStorage.setItem('germina_product_sheets', JSON.stringify(stored));
  return newSheet;
};

export const updateProductSheet = (id, updates) => {
  const stored = getProductSheets();
  const index = stored.findIndex(s => s.id === id);
  if (index !== -1) {
    stored[index] = { ...stored[index], ...updates };
    localStorage.setItem('germina_product_sheets', JSON.stringify(stored));
    return stored[index];
  }
  return null;
};

export const deleteProductSheet = (id) => {
  const stored = getProductSheets();
  const filtered = stored.filter(s => s.id !== id);
  localStorage.setItem('germina_product_sheets', JSON.stringify(filtered));
};

// Helper functions for projects
export const getProjects = () => {
  const stored = localStorage.getItem('germina_projects');
  if (!stored) {
    localStorage.setItem('germina_projects', JSON.stringify(mockProjects));
    return mockProjects;
  }
  return JSON.parse(stored);
};

export const saveProject = (project) => {
  const stored = getProjects();
  const newProject = {
    ...project,
    id: Date.now().toString(),
    status: 'en_cours'
  };
  stored.push(newProject);
  localStorage.setItem('germina_projects', JSON.stringify(stored));
  return newProject;
};

export const updateProject = (id, updates) => {
  const stored = getProjects();
  const index = stored.findIndex(p => p.id === id);
  if (index !== -1) {
    stored[index] = { ...stored[index], ...updates };
    localStorage.setItem('germina_projects', JSON.stringify(stored));
    return stored[index];
  }
  return null;
};

export const deleteProject = (id) => {
  const stored = getProjects();
  const filtered = stored.filter(p => p.id !== id);
  localStorage.setItem('germina_projects', JSON.stringify(filtered));
};

// Calculate end date based on product sheet and method
export const calculateEndDate = (startDate, productSheetId, method) => {
  const sheets = getProductSheets();
  const sheet = sheets.find(s => s.id === productSheetId);
  if (!sheet || !sheet.methods[method]) return null;
  
  const methodData = sheet.methods[method];
  // Obscurité se passe pendant germination, donc pas d'addition
  const totalDays = 
    Math.ceil(methodData.soakDuration / 24) + 
    methodData.germinationDuration + 
    methodData.growthDuration;
  
  const end = new Date(startDate);
  end.setDate(end.getDate() + totalDays);
  return end;
};

// Calculate days until a specific stage
export const calculateDaysToStage = (methodData, method, targetStage) => {
  const methodLower = method.toLowerCase();
  const isGermination = methodLower.includes('germination');
  const soakDays = Math.ceil(methodData.soakDuration / 24);
  const germinationDays = methodData.germinationDuration; // Obscurité se passe pendant
  
  switch (targetStage) {
    case 'Après trempage':
      return soakDays;
    
    case 'Germination':
      return soakDays + germinationDays;
    
    case 'Jeune germe':
      if (isGermination) {
        return soakDays + germinationDays + 3; // 3 jours après germination
      } else {
        return soakDays + germinationDays + 2; // 2 jours pour micro-pousse
      }
    
    case 'Germe mature':
      if (isGermination) {
        // 1 jour avant récolte
        const totalDays = soakDays + germinationDays + methodData.growthDuration;
        return totalDays - 1;
      } else {
        // Tous les 3 jours selon durée de culture (on prend le milieu)
        const totalDays = soakDays + germinationDays + methodData.growthDuration;
        const midPoint = Math.floor((soakDays + germinationDays + totalDays) / 2);
        return midPoint;
      }
    
    case 'Prêt à récolter':
      return soakDays + germinationDays + methodData.growthDuration;
    
    default:
      return soakDays + germinationDays + methodData.growthDuration;
  }
};

// Get all productions from all projects
export const getAllProductions = () => {
  const projects = getProjects();
  const productions = [];
  
  projects.forEach(project => {
    if (project.status === 'terminé') return;
    
    project.productions.forEach(prod => {
      const sheets = getProductSheets();
      const sheet = sheets.find(s => s.id === prod.productSheetId);
      if (!sheet) return;
      
      const methodData = sheet.methods[prod.method];
      if (!methodData) return;
      
      const endDate = calculateEndDate(prod.startDate, prod.productSheetId, prod.method);
      
      productions.push({
        ...prod,
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        projectDate: project.projectDate,
        projectType: project.projectType,
        projectId: project.id,
        endDate: endDate ? endDate.toISOString().split('T')[0] : null,
        methodData
      });
    });
  });
  
  return productions;
};

// Get daily tasks based on all productions
export const getDailyTasks = (date) => {
  const productions = getAllProductions();
  const tasks = [];
  
  productions.forEach(production => {
    const start = new Date(production.startDate);
    const current = new Date(date);
    const daysSinceStart = Math.floor((current - start) / (1000 * 60 * 60 * 24));
    
    if (daysSinceStart < 0) return; // Not started yet
    
    const methodData = production.methodData;
    
    // Trempage (jour 0)
    if (daysSinceStart === 0) {
      tasks.push({
        id: `${production.id}-soak`,
        productionId: production.id,
        variety: production.variety,
        task: 'Trempage des semences',
        duration: `${methodData.soakDuration}h`,
        time: 'Matin',
        projectName: production.projectName,
        phase: 'trempage'
      });
    }
    
    // Germination phase
    if (daysSinceStart > 0 && daysSinceStart <= methodData.germinationDuration) {
      methodData.tasks.forEach((taskName, idx) => {
        tasks.push({
          id: `${production.id}-germ-${idx}`,
          productionId: production.id,
          variety: production.variety,
          task: taskName,
          duration: '15 min',
          time: '2x/jour',
          projectName: production.projectName,
          phase: 'germination'
        });
      });
    }
    
    // Dark phase
    if (daysSinceStart > methodData.germinationDuration && 
        daysSinceStart <= methodData.germinationDuration + methodData.darkDuration) {
      tasks.push({
        id: `${production.id}-dark`,
        productionId: production.id,
        variety: production.variety,
        task: 'Maintenir dans le noir',
        duration: '10 min',
        time: 'Matin',
        projectName: production.projectName,
        phase: 'obscurité'
      });
    }
    
    // Growth phase
    if (daysSinceStart > methodData.germinationDuration + methodData.darkDuration) {
      methodData.tasks.forEach((taskName, idx) => {
        tasks.push({
          id: `${production.id}-growth-${idx}`,
          productionId: production.id,
          variety: production.variety,
          task: taskName,
          duration: '20 min',
          time: '1-2x/jour',
          projectName: production.projectName,
          phase: 'croissance'
        });
      });
    }
    
    // Récolte
    if (production.endDate) {
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
          priority: 'high',
          phase: 'récolte'
        });
      }
    }
  });
  
  return tasks;
};

export const mockUser = {
  email: 'admin@germina.com',
  password: 'germina2025'
};