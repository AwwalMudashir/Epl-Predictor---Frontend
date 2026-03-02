import { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';

function Predict() {
  const [matches, setMatches] = useState([]);
  const [gameweek, setGameweek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const { user } = useContext(AuthContext);
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        console.debug('Predict fetching current gameweek');
        const gwRes = await API.get('/gameweeks/current');
        console.debug('gameweek', gwRes.data);
        setGameweek(gwRes.data);
        const gw = gwRes.data;
        if (gw && gw.id) {
          console.debug('Predict fetching matches');
          const matchRes = await API.get('/gameweeks/current/matches');
          console.debug('matches', matchRes.data);
          setMatches(matchRes.data);
        }

        if (gw && gw.id && user && user.id) {
          console.debug('Predict fetching predictions for user', user?.id, gw.id);
          const predRes = await API.get(
            `/predictions/user/${user.id}/gameweek/${gw.id}`
          );
          console.debug('predictions', predRes.data);
          const existing = predRes.data || [];
          const predObj = {};
          existing.forEach(p => {
            predObj[p.matchId] = {
              predictedHomeScore: p.predictedHomeScore,
              predictedAwayScore: p.predictedAwayScore,
              id: p.predictionId,
            };
          });
          setPredictions(prev => ({
            ...prev,
            ...predObj,
          }));
        }
      } catch (err) {
        console.debug('Predict fetch error', err);
        setError('Could not load matches');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleChange = (matchId, field, value) => {
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: value,
      },
    }));
  };

  const submitPrediction = async (matchId) => {
    if (!user || !user.id) {
      alert('You must be logged in to save predictions');
      return;
    }
    const entry = predictions[matchId] || {};
    const homeVal = parseInt(entry.predictedHomeScore);
    const awayVal = parseInt(entry.predictedAwayScore);
    const { id } = entry;
    if (isNaN(homeVal) || isNaN(awayVal)) return;

    try {
      const payload = id
        ? { predictedHomeScore: homeVal, predictedAwayScore: awayVal }
        : { userId: user.id, matchId, predictedHomeScore: homeVal, predictedAwayScore: awayVal };
      console.debug('sending payload', payload);
      if (id) {
        console.debug('updating prediction', id, homeVal, awayVal);
        await API.put(`/predictions/${id}`, payload);
        alert('Prediction updated');
      } else {
        console.debug('creating prediction', matchId, homeVal, awayVal);
        const res = await API.post('/predictions', payload);
        console.debug('prediction created', res.data);
        setPredictions(prev => ({
          ...prev,
          [matchId]: { predictedHomeScore: homeVal, predictedAwayScore: awayVal, id: res.data.predictionId || res.data.id },
        }));
        alert('Prediction saved');
      }
    } catch (err) {
      // log response body if available
      console.debug('submitPrediction error', err.response?.data || err.message || err);
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Error saving prediction';
      alert(msg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading current gameweek…
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#371d54]">
            Current Gameweek {gameweek ? `#${gameweek.weekNumber}` : ''}
          </h2>
          {gameweek && (
            <p className="text-sm text-gray-500 mt-1">
              {new Date(gameweek.startDate).toLocaleDateString()} - {new Date(gameweek.endDate).toLocaleDateString()}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Predict match scores before kickoff
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 text-center text-gray-500 shadow">
              No matches available for this gameweek.
            </div>
            <button
              className="bg-secondary text-white px-4 py-2 rounded"
              onClick={async () => {
                setCreating(true);
                try {
                  const res = await API.post('/gameweeks/create');
                  console.debug('created gameweek', res.data);
                  setGameweek(res.data.gameweek);
                  setMatches(res.data.matches);
                } catch (e) {
                  console.debug('create gameweek error', e);
                  alert('Failed to create gameweek');
                } finally {
                  setCreating(false);
                }
              }}
              disabled={creating}
            >
              {creating ? 'Creating…' : 'Create Gameweek'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map(match => {
              const prediction = predictions[match.id] || {};
              return (
                <div
                  key={match.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  {/* Match info */}
                  <div className="font-medium text-gray-800 text-center sm:text-left">
                    <span className="block sm:inline">
                      {match.homeTeam}
                    </span>
                    <span className="mx-2 text-gray-400">vs</span>
                    <span className="block sm:inline">
                      {match.awayTeam}
                    </span>
                  </div>

                  {/* Prediction inputs */}
                  <div className="flex items-center justify-center sm:justify-end gap-2">
                    <input
                      type="number"
                      placeholder="H"
                      className="w-12 rounded-lg border border-gray-300 text-center py-1 focus:outline-none focus:ring-2 focus:ring-[#614c77]/50"
                      value={prediction.predictedHomeScore ?? ''}
                      onChange={e =>
                        handleChange(match.id, 'predictedHomeScore', e.target.value)
                      }
                      disabled={
                        match.status !== 'UPCOMING' ||
                        new Date(match.kickoffTime) <= new Date()
                      }
                    />
                    <span className="font-semibold text-gray-500">:</span>
                    <input
                      type="number"
                      placeholder="A"
                      className="w-12 rounded-lg border border-gray-300 text-center py-1 focus:outline-none focus:ring-2 focus:ring-[#614c77]/50"
                      value={prediction.predictedAwayScore ?? ''}
                      onChange={e =>
                        handleChange(match.id, 'predictedAwayScore', e.target.value)
                      }
                      disabled={
                        match.status !== 'UPCOMING' ||
                        new Date(match.kickoffTime) <= new Date()
                      }
                    />

                    <button
                      onClick={() => submitPrediction(match.id)}
                      className="ml-2 bg-[#614c77] hover:bg-[#614c77]/90 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-all active:scale-95"
                      disabled={
                        match.status !== 'UPCOMING' ||
                        new Date(match.kickoffTime) <= new Date() ||
                        isNaN(Number(prediction?.predictedHomeScore)) ||
                        isNaN(Number(prediction?.predictedAwayScore))
                      }
                    >
                      Save
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Predict;
