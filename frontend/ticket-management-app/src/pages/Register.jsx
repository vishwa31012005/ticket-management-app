import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosPublic from '../utils/axiosPublic';
import { FaTicketAlt } from 'react-icons/fa';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axiosPublic.post('http://localhost:8000/register/', {
        username,
        email,
        password,
        role,
      });
      await login(email, password);
      navigate(role === 'agent' ? '/agent-dashboard' : '/customer-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 px-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden animate-fade-in-down mx-auto">
        {/* Left side - Register Form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-6 sm:p-10">
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-10 flex flex-col items-center w-full">
            <div className="bg-gradient-to-tr from-yellow-300 to-yellow-400 rounded-full p-3 mb-6 shadow-lg">
              <FaTicketAlt className="w-12 h-12 text-indigo-700" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-2 drop-shadow">Register</h1>
            {error && <p className="w-full text-center bg-red-100 text-red-700 rounded px-3 py-2 mb-4 text-sm font-medium border border-red-200">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-5 w-full">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm text-base p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition disabled:bg-gray-100"
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm text-base p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition disabled:bg-gray-100"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm text-base p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition disabled:bg-gray-100"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm text-base p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition disabled:bg-gray-100"
                  disabled={loading}
                >
                  <option value="customer">Customer</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-green-300"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
            <p className="mt-6 text-sm text-gray-600 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline font-semibold">Login</Link>
            </p>
          </div>
        </div>
        {/* Right side - Info Box (hidden on mobile) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-100 to-blue-200 flex-col justify-center items-center p-8">
          <FaTicketAlt className="w-20 h-20 text-yellow-400 mb-6 drop-shadow-lg" />
          <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">Welcome to Ticket Booking!</h2>
          <p className="text-gray-600 text-center max-w-xs">Easily book, manage, and track your tickets. Register now to get started and enjoy a seamless experience.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;