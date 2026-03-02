import { useEffect, useState, useContext, useRef } from 'react';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';

function GlobalLeaderboard() {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRowRef = useRef(null);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await API.get('/predictions/leaderboard/global');
        setList(res.data || []);
      } catch (err) {
        setError('Unable to load leaderboard');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <div className="text-center py-10">Loading leaderboard...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (list.length === 0) return <p className="text-center">No scores available yet.</p>;

  const allZero = list.every(u => u.totalPoints === 0);

  // determine current user's index
  const myIndex = user && user.id ? list.findIndex(u => u.userId === user.id) : -1;

  return (
    <div className="max-w-4xl mt-10 mx-auto space-y-6 px-4">
      <h2 className="text-3xl pt-6 font-bold text-[#371d54] text-center">
        Global Leaderboard
      </h2>

      <div className="relative overflow-x-auto">
        {myIndex >= 0 && (
          <button
            onClick={() => {
              const el = document.getElementById(`row-${myIndex}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('bg-yellow-100');
                setTimeout(() => el.classList.remove('bg-yellow-100'), 2000);
              }
            }}
            className="fixed right-4 top-1/3 bg-[#371d54] text-white px-3 py-2 rounded shadow-lg hover:bg-[#371d54]/90 z-40"
          >
            My position
          </button>
        )}
        <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <thead className="bg-[#371d54] text-white">
            <tr>
              <th className="p-3 text-center">Rank</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-center">Points</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u, idx) => (
              <tr
                id={`row-${idx}`}
                key={u.userId}
                className={`
                  border-b last:border-none
                  ${idx === 0 ? 'bg-green-50 font-semibold' : 'hover:bg-gray-50'}
                `}
              >
                <td className="p-3 text-center">{idx + 1}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3 text-center">{u.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GlobalLeaderboard;