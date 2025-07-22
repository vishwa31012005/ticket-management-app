import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaTicketAlt } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(email, password);
      const isAgent = response?.is_agent ?? false;
      navigate(isAgent ? '/agent-dashboard' : '/customer-dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden animate-fade-in-down mx-auto flex-1">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 sm:p-10">
          <div className="bg-gradient-to-tr from-yellow-300 to-yellow-400 rounded-full p-3 mb-6 shadow-lg">
            <FaTicketAlt className="w-12 h-12 text-indigo-700" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-2 drop-shadow">Login</h1>
          {error && <p className="w-full text-center bg-red-100 text-red-700 rounded px-3 py-2 mb-4 text-sm font-medium border border-red-200">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm text-base p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition disabled:bg-gray-100"
                required
                disabled={loading}
                autoComplete="username"
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
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-indigo-300"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="mt-6 text-sm text-gray-600 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline font-semibold">Register</Link>
          </p>
        </div>
        {/* Right: Animated Illustration/Welcome (hidden on mobile/tablet) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-100 to-blue-200 flex-col justify-center items-center p-8">
          <lottie-player
            src="https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json"
            background="transparent"
            speed="1"
            style={{ width: '260px', height: '260px' }}
            loop
            autoplay
          ></lottie-player>
          <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">Secure Login</h2>
          <p className="text-gray-600 text-center max-w-xs">
            Your credentials are encrypted and safe. Welcome back!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;