import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';

function Leagues() {
  const { user } = useContext(AuthContext);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createName, setCreateName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchLeagues() {
      try {
        const res = await API.get(`/league/user/${user.id}/leagues`);
        setLeagues(res.data || []);
      } catch (err) {
        setError('Unable to load leagues. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchLeagues();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const res = await API.post('/league/create', {
        name: createName,
        userId: user.id,
      });
      setMessage('League created successfully 🎉');
      setLeagues(prev => [...prev, res.data]);
      setCreateName('');
    } catch (err) {
      setError('Failed to create league. Please try again.');
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await API.post('/league/join', null, {
        params: { userId: user.id, inviteCode: joinCode },
      });
      setMessage('You have joined the league ✅');
      const res = await API.get(`/league/user/${user.id}/leagues`);
      setLeagues(res.data || []);
      setJoinCode('');
    } catch (err) {
      setError('Invalid invite code or already a member.');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-400">
        Loading your leagues...
      </div>
    );

  return (
    <div className="max-w-5xl mt-4 mx-auto space-y-8 px-4">
      {/* Header */}
      <div className="space-y-2 mt-6">
        <h2 className="text-3xl font-bold  text-[#371d54]">
          My Leagues
        </h2>
        <p className="text-gray-600 max-w-2xl">
          Leagues let you compete privately with friends. Create your own league
          and invite others, or join an existing one using an invite code.
        </p>
      </div>

      {/* Feedback Messages */}
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 font-medium">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* League List */}
      <div className="space-y-3">
        {leagues.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-200 p-6 text-center text-gray-400">
            You are not in any leagues yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {leagues.map(l => (
              <li
                key={l.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{l.name}</p>
                  <p className="text-xs text-gray-500">
                    Invite code: <span className="font-mono">{l.inviteCode}</span>
                  </p>
                </div>
                <Link
                  to={`/leagues/${l.id}/standings`}
                  className="text-[#371d54] font-semibold hover:underline"
                >
                  View Standings →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create / Join */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create League */}
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-3"
        >
          <h3 className="text-lg font-semibold text-[#371d54]">
            Create a League
          </h3>
          <p className="text-sm text-gray-500">
            Start a new private league and invite your friends.
          </p>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#614c77]/40"
            value={createName}
            onChange={e => setCreateName(e.target.value)}
            placeholder="League name"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#371d54] hover:bg-[#2f1746] transition text-white px-4 py-2 rounded-lg font-semibold"
          >
            Create League
          </button>
        </form>

        {/* Join League */}
        <form
          onSubmit={handleJoin}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-3"
        >
          <h3 className="text-lg font-semibold text-[#371d54]">
            Join a League
          </h3>
          <p className="text-sm text-gray-500">
            Enter an invite code shared by a friend.
          </p>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#614c77]/40"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            placeholder="Invite code"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#614c77] hover:bg-[#544168] transition text-white px-4 py-2 rounded-lg font-semibold"
          >
            Join League
          </button>
        </form>
      </div>
    </div>
  );
}

export default Leagues;