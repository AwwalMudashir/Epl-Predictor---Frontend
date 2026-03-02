import { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';

function History() {
  const { user } = useContext(AuthContext);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      if (!user || !user.id) return;
      try {
        const res = await API.get(`/predictions/user/${user.id}`);
        setPredictions(res.data || []);
      } catch (err) {
        setError('Unable to load history');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-400">
        Loading predictions...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-medium py-10">
        {error}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      <h2 className="text-3xl font-bold text-[#371d54]">
        Prediction History
      </h2>

      {predictions.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          No past predictions yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
          <table className="w-full text-sm md:text-base">
            <thead className="bg-[#371d54] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Match</th>
                <th className="px-4 py-3 text-center">Predicted</th>
                <th className="px-4 py-3 text-center">Actual</th>
                <th className="px-4 py-3 text-center">Points</th>
              </tr>
            </thead>

            <tbody>
              {predictions.map((p, idx) => (
                <tr
                  key={p.predictionId}
                  className={`
                    transition
                    ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    hover:bg-[#614c77]/10
                  `}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {p.homeTeam} vs {p.awayTeam}
                  </td>

                  <td className="px-4 py-3 text-center font-semibold text-[#371d54]">
                    {p.predictedHomeScore}-{p.predictedAwayScore}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-700">
                    {p.actualHomeScore ?? '-'}-{p.actualAwayScore ?? '-'}
                  </td>

                  <td
                    className={`px-4 py-3 text-center font-bold ${
                      p.pointsAwarded > 0
                        ? 'text-green-600'
                        : p.pointsAwarded === 0
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {p.pointsAwarded ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default History;