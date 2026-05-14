import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex flex-col lg:flex-row items-center justify-between gap-5 px-6 lg:px-10 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white text-lg font-bold">T</span>
            </div>

            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">
                Team Task Manager
              </h1>

            </div>
          </div>

          {user && (
            <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white uppercase">
                {user.name?.charAt(0)}
              </div>

              <div>
                

                <p className="text-xs text-slate-400 capitalize">
                  {user.role} Login
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300"
          >
            Dashboard
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:scale-105 transition-all duration-300 text-white font-medium shadow-lg shadow-red-500/20"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}