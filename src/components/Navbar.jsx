import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';

function Navbar() {
  const { user, token, logout } = useContext(AuthContext);
  const isLoggedIn = user || token;
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // transparent on splash/dashboard so nav blends with page
  const isBlend = location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/login' || location.pathname === '/register';
  const navClass = `fixed inset-x-0 top-0 mb-5 p-4 pb-6 text-white flex justify-between items-center z-50 ${
    isBlend ? '' : 'bg-gradient-to-br from-[#371d54] via-[#4b2a6b] to-[#614c77]'
  }`;

  const toggle = () => setOpen(o => !o);

  return (
    <>
      <nav className={navClass}>
        <div className="font-bold text-xl cursor-pointer" onClick={() => navigate('/dashboard')} >EPL Predictor</div>
        <div className="hidden md:flex space-x-4">
          {isLoggedIn ? (
            <>
              {/* <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/predict" className="hover:underline">Predict</Link>
              <Link to="/leaderboard/me" className="hover:underline">My Leaderboard</Link>
              <Link to="/leaderboard/global" className="hover:underline">Global Leaderboard</Link>
              <Link to="/leagues" className="hover:underline">Leagues</Link>
              <Link to="/history" className="hover:underline">History</Link>
              <Link to="/profile" className="hover:underline">Profile</Link> */}
              <button onClick={logout} className="bg-secondary px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
        {/* hamburger */}
        <button className="md:hidden" onClick={toggle} aria-label="Menu">
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </nav>
      {/* mobile sliding panel */}
      <div
        className={`fixed top-0 right-0 h-full w-0 bg-gradient-to-br from-[#371d54] via-[#4b2a6b] to-[#614c77] text-white overflow-hidden transition-all duration-300 ease-in-out z-50 ${
          open ? 'w-3/4 sm:w-1/2' : ''
        }`}
      >
        <div className="p-4 flex flex-col space-y-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="block" onClick={toggle}>Dashboard</Link>
              <Link to="/predict" className="block" onClick={toggle}>Predict</Link>
              <Link to="/leaderboard/me" className="block" onClick={toggle}>My Leaderboard</Link>
              <Link to="/leaderboard/global" className="block" onClick={toggle}>Global Leaderboard</Link>
              <Link to="/leagues" className="block" onClick={toggle}>Leagues</Link>
              <Link to="/history" className="block" onClick={toggle}>History</Link>
              <Link to="/profile" className="block" onClick={toggle}>Profile</Link>
              <button onClick={() => { logout(); toggle(); }} className="bg-secondary px-3 py-1 rounded text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block" onClick={toggle}>Login</Link>
              <Link to="/register" className="block" onClick={toggle}>Register</Link>
            </>
          )}
        </div>
      </div>
      {/* dark overlay when open */}
      {open && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={toggle}></div>}
    </>
  );
}

export default Navbar;
