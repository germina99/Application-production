# Configuration des Tâches par Défaut - Germina

## 📁 Fichier: `/app/frontend/src/config/defaultTasks.js`

Ce fichier contient toutes les tâches par défaut pour chaque méthode de production. Ces tâches sont automatiquement générées lors de la création d'une fiche produit et peuvent être modifiées manuellement.

## 📝 Structure d'une Tâche

```javascript
{
  name: "Nom de la tâche",        // Description de la tâche
  moment: "Matin",                 // Quand faire la tâche
  frequency: "1x/jour",            // À quelle fréquence
  duration: "10 min"               // Durée estimée
}
```

## 🎯 Options Disponibles

### Moment
- `"Matin"`
- `"Midi"`
- `"Soir"`
- `"Matin et soir"`
- `"Midi et soir"`
- `"Flexible"`

### Fréquence
- `"1x"` - Tâche ponctuelle (une seule fois dans le processus)
- `"1x/jour"` - Une fois par jour
- `"2x/jour"` - Deux fois par jour
- `"3x/jour"` - Trois fois par jour
- `"1x/semaine"` - Une fois par semaine
- `"2x/semaine"` - Deux fois par semaine

### Durée
Format libre, exemples :
- `"5 min"`
- `"10 min"`
- `"15 min"`
- `"30 min"`
- `"1h"`

## ✏️ Comment Modifier

### Ajouter une nouvelle tâche à une méthode existante

```javascript
"germination_en_pot": [
  {
    name: "Rinçage 2x/jour",
    moment: "Matin et soir",
    frequency: "2x/jour",
    duration: "10 min"
  },
  // Ajouter votre nouvelle tâche ici
  {
    name: "Nouvelle tâche",
    moment: "Midi",
    frequency: "1x/jour",
    duration: "5 min"
  }
]
```

### Ajouter une nouvelle méthode de production

```javascript
// Dans DEFAULT_TASKS_CONFIG, ajouter :
"nom_de_votre_methode": [
  {
    name: "Tâche 1",
    moment: "Matin",
    frequency: "1x/jour",
    duration: "10 min"
  },
  {
    name: "Tâche 2",
    moment: "Soir",
    frequency: "1x/jour",
    duration: "5 min"
  }
]
```

**Note:** Utilisez des underscores `_` et pas d'accents dans le nom de la clé.

### Modifier une tâche existante

Simplement éditer les valeurs dans le fichier :

```javascript
{
  name: "Rinçage 2x/jour",
  moment: "Matin et soir",    // Changer le moment
  frequency: "3x/jour",        // Changer la fréquence
  duration: "15 min"           // Changer la durée
}
```

## 📋 Méthodes Actuellement Configurées

1. ✅ **Germination en pot** (`germination_en_pot`)
2. ✅ **Germination sur plateau** (`germination_sur_plateau`)
3. ✅ **Micro-pousse sur terreau** (`micro_pousse_sur_terreau`)
4. ✅ **Micro-pousse coupelle mucilage** (`micro_pousse_coupelle_mucilage`)
5. ✅ **Micro-pousse sur tapis de chanvre** (`micro_pousse_sur_tapis_de_chanvre`)
6. ✅ **Default** (tâches par défaut si aucune correspondance)

## 🔄 Après Modification

Après avoir modifié le fichier `defaultTasks.js` :

1. Sauvegarder le fichier
2. Le frontend se rechargera automatiquement (hot reload)
3. Les nouvelles tâches seront disponibles lors de la création de fiches produits

**Note:** Les fiches produits déjà créées ne seront pas affectées. Seules les nouvelles fiches utiliseront les nouvelles configurations.

## 💡 Conseils

- Gardez des noms de tâches courts et descriptifs
- Soyez cohérent avec les moments (toujours "Matin" et non "matin")
- Pour les tâches ponctuelles, utilisez `frequency: "1x"`
- Les durées sont indicatives, adaptez-les à votre réalité

## 🆘 Support

Si vous avez des questions ou besoin d'aide pour configurer les tâches, n'hésitez pas à demander!
