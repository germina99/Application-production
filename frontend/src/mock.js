// Mock data for Germina production tracking

export const productionMethods = [
  'Germination en pot',
  'Germination sur plateau',
  'Micro-pousse sur terreau',
  'Micro-pousse coupelle mucilage',
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

import { getDefaultTasksByMethod as getDefaultTasksFromConfig, getTimeOfDayFromFrequency as getTimeOfDayMapping } from './config/defaultTasks';

// Export the functions from config
export const getDefaultTasksByMethod = getDefaultTasksFromConfig;
export const getTimeOfDayFromFrequency = getTimeOfDayMapping;

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
        tasks: [
          { name: 'Rinçage', when: 'Germination', frequency: '2x/jour', duration: '10 min' },
          { name: 'Vérifier humidité', when: 'Germination', frequency: '1x/jour', duration: '5 min' }
        ]
      },
      'Micro-pousse sur terreau': {
        soakDuration: 8,
        germinationDuration: 2,
        darkDuration: 3,
        growthDuration: 7,
        specialEquipment: 'Plateaux 10x20',
        tasks: [
          { name: 'Arrosage', when: 'Croissance', frequency: '1x/jour', duration: '15 min' },
          { name: 'Rotation des plateaux', when: 'Croissance', frequency: '1x/jour', duration: '10 min' },
          { name: 'Vérifier moisissure', when: 'Croissance', frequency: '1x/jour', duration: '10 min' }
        ]
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
        tasks: [
          { name: 'Rinçage', when: 'Germination', frequency: '2x/jour', duration: '10 min' },
          { name: 'Vérifier humidité', when: 'Germination', frequency: '1x/jour', duration: '5 min' }
        ]
      },
      'Germination sur plateau': {
        soakDuration: 6,
        germinationDuration: 2,
        darkDuration: 1,
        growthDuration: 3,
        specialEquipment: 'Plateaux avec couvercle',
        tasks: [
          { name: 'Brumisation', when: 'Germination', frequency: '2x/jour', duration: '10 min' },
          { name: 'Vérifier humidité', when: 'Germination', frequency: '1x/jour', duration: '5 min' },
          { name: 'Rotation des plateaux', when: 'Croissance', frequency: '1x/jour', duration: '5 min' }
        ]
      },
      'Micro-pousse sur terreau': {
        soakDuration: 8,
        germinationDuration: 2,
        darkDuration: 2,
        growthDuration: 5,
        specialEquipment: 'Plateaux 10x20',
        tasks: [
          { name: 'Arrosage', when: 'Croissance', frequency: '1x/jour', duration: '15 min' },
          { name: 'Rotation des plateaux', when: 'Croissance', frequency: '1x/jour', duration: '10 min' },
          { name: 'Vérifier moisissure', when: 'Croissance', frequency: '1x/jour', duration: '10 min' }
        ]
      }
    }
  },
  {
    id: '3',
    variety: 'Tournesol',
    description: 'Riche en protéines, saveur de noisette',
    methods: {
      'Micro-pousse coupelle mucilage': {
        soakDuration: 12,
        germinationDuration: 2,
        darkDuration: 2,
        growthDuration: 8,
        specialEquipment: 'Coupelles mucilage',
        tasks: [
          { name: 'Vérifier pH eau', when: 'Croissance', frequency: '1x/jour', duration: '15 min' },
          { name: 'Nettoyer système', when: 'Début', frequency: '1x/semaine', duration: '30 min' },
          { name: 'Contrôler température', when: 'Croissance', frequency: '2x/jour', duration: '5 min' }
        ]
      },
      'Micro-pousse sur terreau': {
        soakDuration: 12,
        germinationDuration: 2,
        darkDuration: 3,
        growthDuration: 10,
        specialEquipment: 'Plateaux profonds',
        tasks: [
          { name: 'Arrosage', when: 'Croissance', frequency: '1x/jour', duration: '15 min' },
          { name: 'Rotation des plateaux', when: 'Croissance', frequency: '1x/jour', duration: '10 min' },
          { name: 'Vérifier moisissure', when: 'Croissance', frequency: '1x/jour', duration: '10 min' }
        ]
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
    projectDate: '2025-11-10',
    projectType: 'photo',
    productions: [
      {
        id: 'prod-1',
        productSheetId: '1',
        variety: 'Brocoli',
        method: 'Micro-pousse sur terreau',
        targetStage: 'Prêt à récolter',
        startDate: '2025-11-01',
        quantity: '2 plateaux',
        notes: 'Pour photo macro'
      },
      {
        id: 'prod-2',
        productSheetId: '2',
        variety: 'Radis',
        method: 'Micro-pousse sur terreau',
        targetStage: 'Germe mature',
        startDate: '2025-11-03',
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
    projectDate: '2025-11-09',
    projectType: 'photo',
    productions: [
      {
        id: 'prod-3',
        productSheetId: '2',
        variety: 'Radis',
        method: 'Germination en pot',
        targetStage: 'Germination',
        startDate: '2025-11-05',
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
      methodData.tasks.forEach((task, idx) => {
        const taskData = typeof task === 'string' ? { name: task } : task;
        const timeOfDay = taskData.frequency ? getTimeOfDayFromFrequency(taskData.frequency) : 'Flexible';
        tasks.push({
          id: `${production.id}-germ-${idx}`,
          productionId: production.id,
          variety: production.variety,
          task: taskData.name,
          duration: taskData.duration || '15 min',
          time: timeOfDay,
          projectName: production.projectName,
          phase: 'germination'
        });
      });
    }
    
    // Dark phase
    if (daysSinceStart > 0 && daysSinceStart <= Math.max(methodData.germinationDuration, methodData.darkDuration) && methodData.darkDuration > 0) {
      tasks.push({
        id: `${production.id}-dark`,
        productionId: production.id,
        variety: production.variety,
        task: 'Maintenir dans le noir',
        duration: '10 min',
        time: 'Midi',
        projectName: production.projectName,
        phase: 'obscurité'
      });
    }
    
    // Growth phase
    if (daysSinceStart > methodData.germinationDuration) {
      methodData.tasks.forEach((task, idx) => {
        const taskData = typeof task === 'string' ? { name: task } : task;
        const timeOfDay = taskData.frequency ? getTimeOfDayFromFrequency(taskData.frequency) : 'Flexible';
        tasks.push({
          id: `${production.id}-growth-${idx}`,
          productionId: production.id,
          variety: production.variety,
          task: taskData.name,
          duration: taskData.duration || '20 min',
          time: timeOfDay,
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