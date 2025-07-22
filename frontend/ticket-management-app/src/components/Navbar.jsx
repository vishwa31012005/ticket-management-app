import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { FaTicketAlt } from 'react-icons/fa'; // Add icon

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg p-0 fixed w-full top-0 z-20">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <Link to="/" className="flex items-center gap-2 text-white text-2xl font-extrabold tracking-tight">
          <FaTicketAlt className="w-7 h-7 text-yellow-300 drop-shadow" />
          <span>Ticket System</span>
        </Link>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none transition-transform duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
        <div
          className={`$ {
            isMenuOpen ? 'block animate-fade-in-down' : 'hidden'
          } md:flex md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-gradient-to-r from-indigo-700 to-blue-600 md:bg-transparent px-4 md:px-0 py-4 md:py-0 transition-all duration-300`}
        >
          {!user ? (
            <>
              <Link
                to="/login"
                className="block md:inline text-white hover:bg-white/10 hover:text-yellow-300 rounded px-4 py-2 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block md:inline text-white hover:bg-white/10 hover:text-yellow-300 rounded px-4 py-2 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="block md:inline text-white hover:bg-white/10 hover:text-yellow-300 rounded px-4 py-2 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;