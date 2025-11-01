/**
 * Configuration des tâches par défaut pour chaque méthode de production
 * 
 * Structure de chaque tâche:
 * {
 *   name: "Nom de la tâche",
 *   moment: "Matin" | "Midi" | "Soir" | "Matin et soir" | "Midi et soir" | "Flexible",
 *   frequency: "1x" | "1x/jour" | "2x/jour" | "3x/jour" | "1x/semaine" | "2x/semaine",
 *   duration: "Durée estimée (ex: 10 min, 15 min, 30 min, 1h)"
 * }
 */

export const DEFAULT_TASKS_CONFIG = {
  // Germination en pot
  "germination_en_pot": [
    {
      name: "Rinçage 2x/jour",
      moment: "Matin et soir",
      frequency: "2x/jour",
      duration: "10 min"
    },
    {
      name: "Vérifier humidité",
      moment: "Matin",
      frequency: "1x/jour",
      duration: "5 min"
    }
  ],

  // Germination sur plateau
  "germination_sur_plateau": [
    {
      name: "Brumisation",
      moment: "Matin et soir",
      frequency: "2x/jour",
      duration: "10 min"
    },
    {
      name: "Vérifier humidité",
      moment: "Matin",
      frequency: "1x/jour",
      duration: "5 min"
    },
    {
      name: "Rotation des plateaux",
      moment: "Midi",
      frequency: "1x/jour",
      duration: "5 min"
    }
  ],

  // Micro-pousse sur terreau
  "micro_pousse_sur_terreau": [
    {
      name: "Arrosage quotidien",
      moment: "Matin",
      frequency: "1x/jour",
      duration: "15 min"
    },
    {
      name: "Rotation des plateaux",
      moment: "Midi",
      frequency: "1x/jour",
      duration: "10 min"
    },
    {
      name: "Vérifier moisissure",
      moment: "Soir",
      frequency: "1x/jour",
      duration: "10 min"
    }
  ],

  // Micro-pousse hydroponique
  "micro_pousse_hydroponique": [
    {
      name: "Vérifier pH eau",
      moment: "Matin",
      frequency: "1x/jour",
      duration: "15 min"
    },
    {
      name: "Nettoyer système",
      moment: "Matin",
      frequency: "1x/semaine",
      duration: "30 min"
    },
    {
      name: "Contrôler température",
      moment: "Matin et soir",
      frequency: "2x/jour",
      duration: "5 min"
    }
  ],

  // Micro-pousse sur tapis de chanvre
  "micro_pousse_sur_tapis_de_chanvre": [
    {
      name: "Arrosage par vaporisation",
      moment: "Matin et soir",
      frequency: "2x/jour",
      duration: "10 min"
    },
    {
      name: "Maintenir humidité tapis",
      moment: "Midi",
      frequency: "1x/jour",
      duration: "5 min"
    }
  ],

  // Tâches par défaut (fallback)
  "default": [
    {
      name: "Arrosage",
      moment: "Matin",
      frequency: "1x/jour",
      duration: "10 min"
    },
    {
      name: "Surveillance",
      moment: "Matin",
      frequency: "1x/jour",
      duration: "5 min"
    }
  ]
};

/**
 * Fonction helper pour obtenir les tâches par défaut selon la méthode
 * @param {string} method - Nom de la méthode de production
 * @returns {Array} Liste des tâches par défaut
 */
export const getDefaultTasksByMethod = (method) => {
  const methodLower = method.toLowerCase();
  
  // Normaliser le nom de la méthode pour correspondre aux clés
  const methodKey = methodLower
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Retirer les accents
  
  // Chercher la correspondance exacte
  if (DEFAULT_TASKS_CONFIG[methodKey]) {
    return [...DEFAULT_TASKS_CONFIG[methodKey]];
  }
  
  // Chercher par mots-clés
  if (methodLower.includes('germination') && methodLower.includes('pot')) {
    return [...DEFAULT_TASKS_CONFIG.germination_en_pot];
  }
  
  if (methodLower.includes('germination') && methodLower.includes('plateau')) {
    return [...DEFAULT_TASKS_CONFIG.germination_sur_plateau];
  }
  
  if (methodLower.includes('micro') && methodLower.includes('terreau')) {
    return [...DEFAULT_TASKS_CONFIG.micro_pousse_sur_terreau];
  }
  
  if (methodLower.includes('micro') && methodLower.includes('hydro')) {
    return [...DEFAULT_TASKS_CONFIG.micro_pousse_hydroponique];
  }
  
  if (methodLower.includes('micro') && methodLower.includes('chanvre')) {
    return [...DEFAULT_TASKS_CONFIG.micro_pousse_sur_tapis_de_chanvre];
  }
  
  // Retourner les tâches par défaut
  return [...DEFAULT_TASKS_CONFIG.default];
};
