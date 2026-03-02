import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import Leagues from './pages/Leagues';
import LeagueStandings from './pages/LeagueStandings';
import History from './pages/History';
import Profile from './pages/Profile';
import MyLeaderboard from './pages/MyLeaderboard';
import GlobalLeaderboard from './pages/GlobalLeaderboard';
import Splash from './pages/Splash';

function App() {
  const { user, token, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-light">
      <Navbar />
      {/* push content down so fixed navbar doesn't overlap */}
      <main className="mt-12">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user || token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/predict" element={user || token ? <Predict /> : <Navigate to="/login" />} />
          <Route path="/leaderboard/me" element={user || token ? <MyLeaderboard /> : <Navigate to="/login" />} />
          <Route path="/leaderboard/global" element={user || token ? <GlobalLeaderboard /> : <Navigate to="/login" />} />
          <Route path="/leagues" element={user || token ? <Leagues /> : <Navigate to="/login" />} />
          <Route path="/leagues/:id/standings" element={user || token ? <LeagueStandings /> : <Navigate to="/login" />} />
          <Route path="/history" element={user || token ? <History /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user || token ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/" element={<Splash />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
