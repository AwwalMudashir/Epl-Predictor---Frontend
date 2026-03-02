import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

function LeagueStandings() {
  const { id } = useParams();
  const [standings, setStandings] = useState([]);
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const [res, leagueRes] = await Promise.all([
          API.get(`/league/${id}/standings`),
          API.get(`/league/${id}`)
        ]);
        setStandings(res.data || []);
        setLeague(leagueRes.data);
      } catch (err) {
        setError('Unable to load standings');
      } finally {
        setLoading(false);
      }
    }
    fetchStandings();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-400">
        Loading standings...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-medium py-10">
        {error}
      </div>
    );

  const medal = (idx) => {
    if (idx === 0) return '🥇';
    if (idx === 1) return '🥈';
    if (idx === 2) return '🥉';
    return idx + 1;
  };

  return (
    <div className="max-w-5xl mt-6 pt-4 mx-auto space-y-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#371d54]">
            League Standings
          </h2>
          {league && (
            <div className="text-sm text-gray-600">
              Invite code: <span className="font-mono">{league.inviteCode}</span>{' '}
              <button
                onClick={() => navigator.clipboard.writeText(league.inviteCode)}
                className="ml-2 text-blue-600 hover:underline"
              >
                copy
              </button>
            </div>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {standings.length} players
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
        <table className="w-full text-sm md:text-base">
          <thead className="bg-[#371d54] text-white">
            <tr>
              <th className="px-4 py-3 text-center w-16">#</th>
              <th className="px-4 py-3 text-left">Player</th>
              <th className="px-4 py-3 text-center w-32">Points</th>
            </tr>
          </thead>

          <tbody>
            {standings.map((row, idx) => (
              <tr
                key={row.userId}
                className={`
                  transition
                  ${idx === 0 ? 'bg-green-50' : idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  hover:bg-[#614c77]/10
                `}
              >
                {/* Rank / Medal */}
                <td className="px-4 py-3 text-center font-bold text-gray-700">
                  {medal(idx)}
                </td>

                {/* Username */}
                <td className="px-4 py-3 font-medium text-gray-800">
                  {row.username}
                </td>

                {/* Points */}
                <td className="px-4 py-3 text-center font-bold text-green-600">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {standings.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No standings available yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default LeagueStandings;