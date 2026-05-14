import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage('');

      if (isSignup) {
        await API.post('/auth/signup', form);

        setMessage('✅ Signup successful! Please login.');

        setIsSignup(false);

        setForm({
          name: '',
          email: '',
          password: '',
          role: 'member'
        });
      } else {
        const res = await API.post('/auth/login', form);

        const { token, user } = res.data;

        localStorage.setItem('token', token);

        localStorage.setItem(
          'user',
          JSON.stringify({
            name: user.name,
            email: user.email,
            role: user.role
          })
        );

        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 overflow-hidden relative">
      
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/20 blur-3xl rounded-full"></div>

 
      <div className="relative w-full max-w-md">

        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur opacity-20"></div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
        >
          {/* Heading */}
          <div className="text-center mb-8">
            

            <h2 className="text-4xl font-bold text-white">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>

            <p className="text-slate-400 mt-3">
              {isSignup
                ? 'Signup to manage your projects efficiently'
                : 'Login to continue to your dashboard'}
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-5 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-3 rounded-2xl text-sm">
              {message}
            </div>
          )}

          {/* Name */}
          {isSignup && (
            <div className="mb-5">
              <label className="block text-sm text-slate-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-slate-500"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm text-slate-300 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-slate-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 rounded-2xl px-5 py-4 outline-none text-white placeholder:text-slate-500"
              required
            />
          </div>

          {/* Role */}
          {isSignup && (
            <div className="mb-6">
              <label className="block text-sm text-slate-300 mb-2">
                Select Role
              </label>

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-2xl px-5 py-4 outline-none text-white"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition-all duration-300 py-4 rounded-2xl font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading
              ? isSignup
                ? 'Creating Account...'
                : 'Logging In...'
              : isSignup
              ? 'Create Account'
              : 'Login'}
          </button>

          {/* Toggle */}
          <p className="text-center text-slate-400 mt-6">
            {isSignup
              ? 'Already have an account?'
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage('');
              }}
              className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              {isSignup ? 'Login' : 'Sign up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;