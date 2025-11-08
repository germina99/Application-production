# 🌱 GERMINA - Code Source Complet

## Table des Matières
- [1. Backend](#1-backend)
- [2. Frontend - Configuration](#2-frontend-configuration)
- [3. Frontend - Composants Principaux](#3-frontend-composants-principaux)
- [4. Frontend - Mock Data](#4-frontend-mock-data)
- [5. Installation et Démarrage](#5-installation-et-démarrage)

---

## 1. Backend

### 📄 backend/server.py

Voir le fichier dans le répertoire `/app/backend/server.py`

### 📄 backend/requirements.txt

Voir le fichier dans le répertoire `/app/backend/requirements.txt`

---

## 2. Frontend - Configuration

### 📄 frontend/src/config/defaultTasks.js

Voir le fichier complet dans `/app/frontend/src/config/defaultTasks.js`

### 📄 frontend/src/config/colors.js

Voir le fichier complet dans `/app/frontend/src/config/colors.js`

---

## 3. Frontend - Composants Principaux

Les composants suivants sont disponibles dans `/app/frontend/src/components/` :

- **App.js** - Composant principal de l'application
- **GanttView.jsx** - Diagramme de Gantt
- **ProductSheetForm.jsx** - Formulaire de création de fiches produits
- **ProductSheetList.jsx** - Liste des fiches produits
- **ProjectForm.jsx** - Formulaire de création de projets
- **DailyTasks.jsx** - Vue des tâches quotidiennes

---

## 4. Frontend - Mock Data

### 📄 frontend/src/mock.js

Voir le fichier complet dans `/app/frontend/src/mock.js`

---

## 5. Installation et Démarrage

### Backend
```bash
cd /app/backend
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Frontend
```bash
cd /app/frontend
yarn install
yarn start
```

### Accès à l'application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- Credentials de démo: admin@germina.com / germina2025

---

## Structure des données

### Product Sheet (Fiche Produit)
```javascript
{
  id: string,
  variety: string,
  description: string,
  methods: {
    [methodName]: {
      soakDuration: number (heures),
      germinationDuration: number (jours),
      darkDuration: number (jours),
      growthDuration: number (jours),
      specialEquipment: string,
      tasks: Array<{
        name: string,
        when: string,
        frequency: string,
        end: string
      }>
    }
  }
}
```

### Project
```javascript
{
  id: string,
  projectName: string,
  projectDescription: string,
  projectDate: string (YYYY-MM-DD),
  projectType: 'photo' | 'tournage' | 'test',
  productions: Array<{
    id: string,
    productSheetId: string,
    variety: string,
    method: string,
    targetStage: string,
    startDate: string (YYYY-MM-DD),
    quantity: string,
    notes: string
  }>,
  status: string
}
```

---

## Fonctionnalités principales

1. **Gestion des fiches produits**
   - Création/modification de fiches
   - Méthodes de production multiples
   - Tâches personnalisables par méthode

2. **Gestion des projets**
   - Création de projets avec plusieurs productions
   - Calcul automatique des dates de début
   - Types de projets: photo, tournage, test

3. **Diagramme de Gantt**
   - Visualisation des productions
   - Alignement précis des dates
   - Horizons variables (1 semaine, 2 semaines, 1 mois)
   - Trempage en heures (début 10:00)
   - Modification de projets avec recalcul automatique

4. **Tâches quotidiennes**
   - Génération automatique selon les productions
   - Fréquence et plages horaires
   - Suivi de progression

---

## Technologies utilisées

### Backend
- FastAPI
- Motor (MongoDB async)
- Python 3.x

### Frontend
- React 18
- Tailwind CSS
- Shadcn UI
- date-fns
- Lucide Icons

---

**Note**: Pour obtenir les fichiers sources complets, consultez les répertoires:
- `/app/backend/`
- `/app/frontend/src/`
