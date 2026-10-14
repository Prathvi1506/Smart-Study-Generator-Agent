import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import StudyMaterials from './pages/StudyMaterials';
import GenerateNotes from './pages/GenerateNotes';
import AIAssistant from './pages/AIAssistant';
import Flashcards from './pages/Flashcards';
import PracticeQuizzes from './pages/PracticeQuizzes';
import ConceptMaps from './pages/ConceptMaps';
import StudyPlanner from './pages/StudyPlanner';
import ExamPredictor from './pages/ExamPredictor';
import ProgressAnalytics from './pages/ProgressAnalytics';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/materials" element={<StudyMaterials />} />
        <Route path="/generate" element={<GenerateNotes />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quizzes" element={<PracticeQuizzes />} />
        <Route path="/concepts" element={<ConceptMaps />} />
        <Route path="/planner" element={<StudyPlanner />} />
        <Route path="/predictor" element={<ExamPredictor />} />
        <Route path="/analytics" element={<ProgressAnalytics />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
