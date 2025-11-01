import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/toaster';
import { Sprout, LogOut, Plus, Calendar, CheckSquare } from 'lucide-react';
import ProductionForm from './components/ProductionForm';
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
          <div className="mx-auto bg-green-600 w-16 h-16 rounded-full flex items-center justify-center">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-800">Germina</CardTitle>
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
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
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

  const handleProductionCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 w-10 h-10 rounded-full flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">Germina</h1>
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
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="gantt" className="gap-2">
              <Calendar className="w-4 h-4" />
              Gantt
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <CheckSquare className="w-4 h-4" />
              Tâches
            </TabsTrigger>
            <TabsTrigger value="create" className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle fiche
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gantt" className="space-y-6">
            <GanttView refresh={refreshKey} />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <DailyTasks />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <ProductionForm onProductionCreated={() => {
              handleProductionCreated();
              setActiveTab('gantt');
            }} />
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