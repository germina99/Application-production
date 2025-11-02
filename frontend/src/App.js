import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/toaster';
import { Sprout, LogOut, Plus, Calendar, CheckSquare, Leaf, Camera } from 'lucide-react';
import ProductSheetForm from './components/ProductSheetForm';
import ProductSheetList from './components/ProductSheetList';
import ProjectForm from './components/ProjectForm';
import GanttView from './components/GanttView';
import DailyTasks from './components/DailyTasks';
import { mockUser } from './mock';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === mockUser.email && password === mockUser.password) {
      onLogin();
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-32 h-32 rounded-full flex items-center justify-center overflow-hidden bg-white">
            <img src="/logo-germina.png" alt="Germina" className="w-28 h-28 object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold" style={{ color: '#48bf20' }}>Germina</CardTitle>
          <p className="text-gray-600">Suivi de production - Micro-pousses & Germination</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@germina.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" style={{ backgroundColor: '#48bf20' }}>
              Se connecter
            </Button>
            <p className="text-xs text-center text-gray-500 mt-4">
              Démo: admin@germina.com / germina2025
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Dashboard = ({ onLogout }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('gantt');

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden bg-white">
                <img src="/logo-germina.png" alt="Germina" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#48bf20' }}>Germina</h1>
                <p className="text-xs text-gray-600">Suivi de production</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="gantt" className="gap-2 text-xs sm:text-sm">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Gantt</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2 text-xs sm:text-sm">
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Tâches</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2 text-xs sm:text-sm">
              <Leaf className="w-4 h-4" />
              <span className="hidden sm:inline">Produits</span>
            </TabsTrigger>
            <TabsTrigger value="new-product" className="gap-2 text-xs sm:text-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Fiche</span>
            </TabsTrigger>
            <TabsTrigger value="new-project" className="gap-2 text-xs sm:text-sm">
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Projet</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gantt" className="space-y-6">
            <GanttView refresh={refreshKey} />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <DailyTasks />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductSheetList refresh={refreshKey} />
          </TabsContent>

          <TabsContent value="new-product" className="space-y-6">
            <ProductSheetForm
              onSheetCreated={() => {
                handleRefresh();
                setActiveTab('products');
              }}
            />
          </TabsContent>

          <TabsContent value="new-project" className="space-y-6">
            <ProjectForm
              onProjectCreated={() => {
                handleRefresh();
                setActiveTab('gantt');
              }}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('germina_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('germina_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('germina_auth');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;