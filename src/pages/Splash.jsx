import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Splash() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAction = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen mt-[-48px] w-full flex items-center justify-center bg-gradient-to-br from-[#371d54] via-[#371d54] to-[#614c77] px-4">
      <div className="max-w-2xl w-full text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-10 shadow-xl">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          EPL Predictor
        </h1>

        {/* Subtitle */}
        <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed mb-8">
          Create private leagues with friends, predict match scores each gameweek,
          and climb the leaderboards based on your accuracy.
          <span className="block mt-2 text-gray-300">
            Bragging rights included.
          </span>
        </p>

        {/* CTA Button */}
        <button
          onClick={handleAction}
          className="inline-flex cursor-pointer items-center justify-center w-full sm:w-auto bg-[#614c77] hover:bg-[#614c77]/90 active:scale-95 transition-all duration-200 text-white font-semibold px-8 py-3 rounded-xl text-base sm:text-lg shadow-lg shadow-black/20"
        >
          {user ? 'Go to Dashboard' : 'Login / Sign Up'}
        </button>

        {/* Sub hint */}
        {!user && (
          <p className="mt-6 text-xs sm:text-sm text-gray-400">
            No credit card. No ads. Just football.
          </p>
        )}
      </div>
    </div>
  );
}

export default Splash;