import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function Profile() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-[#371d54]">
          My Profile
        </h2>

        {user ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Top accent */}
            <div className="h-2 bg-gradient-to-r from-[#371d54] to-[#614c77]" />

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* User Info */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-lg font-semibold text-gray-800">
                  {user.username}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-800">
                  {user.email}
                </p>
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Logged in and ready to predict ⚽
                </p>

                <button
                  onClick={logout}
                  className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 active:scale-95 transition text-white font-semibold px-6 py-2 rounded-xl shadow"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-gray-600 mb-2">
              You are not signed in.
            </p>
            <Link
              to="/login"
              className="text-[#371d54] font-semibold hover:underline"
            >
              Login to continue →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;