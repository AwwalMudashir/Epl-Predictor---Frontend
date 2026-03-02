import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.debug('Register form submit', { username, email, password });
    try {
      const res = await register({ username, email, password });
      console.debug('post-register', res);
      navigate('/login');
    } catch (err) {
      console.debug('register error', err);
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen mt-[-48px] flex items-center justify-center bg-gradient-to-br from-[#371d54] to-[#614c77] px-4">
      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#371d54] mb-2">
          Create account
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Join leagues, predict scores, climb the leaderboard
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#614c77]/50 focus:border-[#614c77]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#614c77]/50 focus:border-[#614c77]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#614c77]/50 focus:border-[#614c77]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#371d54] hover:bg-[#371d54]/90 text-white font-semibold py-2.5 rounded-xl transition-all active:scale-95 shadow-md"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-[#614c77] font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;