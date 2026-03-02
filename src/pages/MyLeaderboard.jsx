import { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';

function MyLeaderboard() {
  const { user } = useContext(AuthContext);
  const [points, setPoints] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      if (!user || !user.id) return;
      try {
        const res = await API.get(`/predictions/user/${user.id}/points`);
        setPoints(res.data || {});
      } catch (err) {
        setError('Unable to load leaderboard');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-400">
        Loading leaderboard...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-medium py-10">
        {error}
      </div>
    );

  const entries = Object.entries(points);

  if (entries.length === 0) {
    return (
      <div className="text-center text-gray-400 py-16">
        No points recorded yet.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 px-4">
      <h2 className="text-3xl font-bold text-[#371d54] text-center">
        My Leaderboard
      </h2>

      <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-[#371d54] text-white">
            <tr>
              <th className="px-4 py-3 text-left">Gameweek</th>
              <th className="px-4 py-3 text-center">Points</th>
            </tr>
          </thead>

          <tbody>
            {entries.map(([gw, pts], idx) => (
              <tr
                key={gw}
                className={`
                  transition
                  ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  hover:bg-[#614c77]/10
                `}
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  Gameweek {gw}
                </td>
                <td className="px-4 py-3 text-center font-bold text-green-600">
                  {pts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyLeaderboard;