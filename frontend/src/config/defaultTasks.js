/**
 * Configuration des tâches par défaut pour chaque méthode de production
 * 
 * Structure de chaque tâche:
 * {
 *   name: "Nom de la tâche",
 *   when: "Début" | "Jour 1" | "Jour 2" | ... | "Trempage" | "Germination" | "Obscurité" | "Croissance" | "Fin",
 *   frequency: "1x" | "1x/jour" | "2x/jour" | "3x/jour" | "1x/semaine" | "2x/semaine",
 *   end: "Jour 1" | "Jour 2" | ... | "Trempage" | "Germination" | "Obscurité" | "Croissance" | "Fin"
 * }
 * 
 * La fréquence définit automatiquement les moments de la journée:
 * - 1x → Midi
 * - 1x/jour → Midi
 * - 2x/jour → Matin et soir
 * - 3x/jour → Matin, midi et soir
 * - 1x/semaine → Matin
 * - 2x/semaine → Matin et soir
 */

export const DEFAULT_TASKS_CONFIG = {
  // Germination en pot
  "germination_en_pot": [
    {
      name: "Rinçage",
      when: "Germination",
      frequency: "2x/jour",
      end: "Fin"
    },
    {
      name: "Vérifier humidité",
      when: "Germination",
      frequency: "1x/jour",
      end: "Fin"
    }
  ],

  // Germination sur plateau
  "germination_sur_plateau": [
    {
      name: "Brumisation",
      when: "Germination",
      frequency: "2x/jour",
      end: "Croissance"
    },
    {
      name: "Vérifier humidité",
      when: "Germination",
      frequency: "1x/jour",
      end: "Croissance"
    },
    {
      name: "Rotation des plateaux",
      when: "Croissance",
      frequency: "1x/jour",
      end: "Fin"
    }
  ],

  // Micro-pousse sur terreau
  "micro_pousse_sur_terreau": [
    {
      name: "Arrosage",
      when: "Croissance",
      frequency: "1x/jour",
      end: "Fin"
    },
    {
      name: "Rotation des plateaux",
      when: "Croissance",
      frequency: "1x/jour",
      end: "Fin"
    },
    {
      name: "Vérifier moisissure",
      when: "Croissance",
      frequency: "1x/jour",
      end: "Fin"
    }
  ],

  // Micro-pousse coupelle mucilage
  "micro_pousse_coupelle_mucilage": [
    {
      name: "Vérifier pH eau",
      when: "Croissance",
      frequency: "1x/jour",
      end: "Fin"
    },
    {
      name: "Nettoyer système",
      when: "Début",
      frequency: "1x/semaine",
      end: "Fin"
    },
    {
      name: "Contrôler température",
      when: "Croissance",
      frequency: "2x/jour",
      end: "Fin"
    }
  ],

  // Micro-pousse sur tapis de chanvre
  "micro_pousse_sur_tapis_de_chanvre": [
    {
      name: "Arrosage par vaporisation",
      when: "Croissance",
      frequency: "2x/jour",
      end: "Fin"
    },
    {
      name: "Maintenir humidité tapis",
      when: "Croissance",
      frequency: "1x/jour",
      end: "Fin"
    }
  ],

  // Tâches par défaut (fallback)
  "default": [
    {
      name: "Arrosage",
      when: "Croissance",
      frequency: "1x/jour",
      end: "Fin"
    },
    {
      name: "Surveillance",
      when: "Croissance",
      frequency: "1x/jour",
      end: "Fin"
    }
  ]
};

/**
 * Mapper la fréquence vers les moments de la journée
 */
export const getTimeOfDayFromFrequency = (frequency) => {
  const mapping = {
    "1x": "Midi",
    "1x/jour": "Midi",
    "2x/jour": "Matin et soir",
    "3x/jour": "Matin, midi et soir",
    "1x/semaine": "Matin",
    "2x/semaine": "Matin et soir"
  };
  return mapping[frequency] || "Flexible";
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
