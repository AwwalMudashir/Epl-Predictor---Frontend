import { Link } from 'react-router-dom';
import { useState } from 'react';
import API from '../api';

function Dashboard() {
  // state for manual score sync
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  const refreshScores = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      await API.post('/gameweeks/current/sync-results');
      setSyncMsg('Latest results pulled successfully');
    } catch (err) {
      console.debug('score sync error', err);
      setSyncMsg('Failed to refresh results');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br mt-[-48px] from-[#371d54] via-[#4b2a6b] to-[#614c77] px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Welcome to EPL Predictor
          </h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Predict scores, climb leaderboards, and dominate your private leagues.
          </p>
        </div>

        {/* Cards */}
        {syncMsg && (
          <div className="text-center text-white font-medium">{syncMsg}</div>
        )}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: '/predict', label: 'Predict Gameweek' },
            { to: '/leaderboard/me', label: 'My Leaderboard' },
            { to: '/leaderboard/global', label: 'Global Leaderboard' },
            { to: '/leagues', label: 'Leagues' },
            { to: '/history', label: 'My Predictions' },
            { to: '/profile', label: 'Profile' },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="
                group bg-white rounded-xl p-6 shadow-md
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-200
                flex items-center justify-center
              "
            >
              <span className="
                text-lg font-semibold text-[#371d54]
                group-hover:text-[#614c77]
              ">
                {item.label}
              </span>
            </Link>
          ))}
          <div
            onClick={refreshScores}
            className="
              cursor-pointer group bg-white rounded-xl p-6 shadow-md
              hover:shadow-xl hover:-translate-y-1
              transition-all duration-200
              flex items-center justify-center
            "
          >
            <span className="
              text-lg font-semibold text-[#371d54]
              group-hover:text-[#614c77]
            ">
              {syncing ? 'Refreshing…' : 'Refresh Results'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;