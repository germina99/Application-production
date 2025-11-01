// Mock data for Germina production tracking

export const productionMethods = [
  'Germination en pot',
  'Germination sur plateau',
  'Micro-pousse sur terreau',
  'Micro-pousse hydroponique',
  'Micro-pousse sur tapis de chanvre'
];

export const growthStages = [
  'Germination',
  'Jeune pousse',
  'Micro-pousse mature',
  'Prêt à récolter'
];

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
        tasks: ['Rinçage 2x/jour']
      },
      'Micro-pousse sur terreau': {
        soakDuration: 8,
        germinationDuration: 2,
        darkDuration: 3,
        growthDuration: 7,
        specialEquipment: 'Plateaux 10x20',
        tasks: ['Arrosage quotidien', 'Rotation des plateaux']
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
        tasks: ['Rinçage 2x/jour']
      },
      'Germination sur plateau': {
        soakDuration: 6,
        germinationDuration: 2,
        darkDuration: 1,
        growthDuration: 3,
        specialEquipment: 'Plateaux avec couvercle',
        tasks: ['Brumisation', 'Vérifier humidité']
      },
      'Micro-pousse sur terreau': {
        soakDuration: 8,
        germinationDuration: 2,
        darkDuration: 2,
        growthDuration: 5,
        specialEquipment: 'Plateaux 10x20',
        tasks: ['Arrosage matin et soir']
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
        tasks: ['Vérifier pH eau', 'Nettoyer système']
      },
      'Micro-pousse sur terreau': {
        soakDuration: 12,
        germinationDuration: 2,
        darkDuration: 3,
        growthDuration: 10,
        specialEquipment: 'Plateaux profonds',
        tasks: ['Arrosage abondant', 'Retirer coques']
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
        targetStage: 'Micro-pousse mature',
        startDate: '2025-07-01',
        quantity: '2 plateaux',
        notes: 'Pour photo macro'
      },
      {
        id: 'prod-2',
        productSheetId: '2',
        variety: 'Radis',
        method: 'Micro-pousse sur terreau',
        targetStage: 'Micro-pousse mature',
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
  const totalDays = 
    Math.ceil(methodData.soakDuration / 24) + 
    methodData.germinationDuration + 
    methodData.darkDuration + 
    methodData.growthDuration;
  
  const end = new Date(startDate);
  end.setDate(end.getDate() + totalDays);
  return end;
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
        projectDate: project.projectDate,
        targetStage: project.targetStage,
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