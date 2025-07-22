import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import axios from 'axios';
import { FaPlusCircle, FaTicketAlt } from 'react-icons/fa';

function CustomerDashboard() {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:8000/api/tickets/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(response.data);
      } catch (error) {
        setError('Failed to load tickets.');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchTickets();
  }, [token]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:8000/api/tickets/',
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setTitle('');
      setDescription('');
      const response = await axios.get('http://localhost:8000/api/tickets/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wide">Open</span>;
      case 'in_progress':
        return <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wide">In Progress</span>;
      case 'resolved':
        return <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">Resolved</span>;
      default:
        return <span className="inline-block px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wide">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="flex flex-col lg:flex-row w-full h-full flex-1">
        {/* Left: Main Content */}
        <div className="w-full lg:w-2/3 flex flex-col justify-center items-center p-6 sm:p-10">
          <div className="w-full max-w-4xl rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <FaTicketAlt className="w-8 h-8 text-indigo-700" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 drop-shadow">Customer Dashboard <span className="text-base font-medium text-indigo-500">{user?.email}</span></h1>
            </div>
            {error && <p className="w-full text-center bg-red-100 text-red-700 rounded px-3 py-2 mb-4 text-sm font-medium border border-red-200">{error}</p>}
            {loading && <p className="text-gray-600 text-sm mb-4">Loading...</p>}
            <Card title={<span className="flex items-center gap-2"><FaTicketAlt className="w-5 h-5 text-yellow-400" /> Your Tickets</span>}>
              <ul className="divide-y divide-indigo-50 mb-6">
                {tickets.length === 0 && <li className="py-4 text-gray-500 text-center">No tickets found.</li>}
                {tickets.map((ticket) => (
                  <li key={ticket.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="text-base font-medium text-gray-900">{ticket.title}</div>
                    <div>{getStatusBadge(ticket.status)}</div>
                  </li>
                ))}
              </ul>
              <form onSubmit={handleCreateTicket} className="mt-6 space-y-4 bg-indigo-50 rounded-xl p-4 shadow-inner animate-fade-in-up">
                <h2 className="text-lg font-bold text-indigo-700 flex items-center gap-2 mb-2"><FaPlusCircle className="w-5 h-5 text-green-500" /> Create New Ticket</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm text-base p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition disabled:bg-gray-100"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm text-base p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition disabled:bg-gray-100"
                    rows="4"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-green-300 flex items-center justify-center gap-2"
                >
                  <FaPlusCircle className="w-5 h-5" /> {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </form>
            </Card>
          </div>
        </div>
        {/* Right: Animated Illustration/Welcome (hidden on mobile/tablet) */}
        <div className="hidden lg:flex w-1/3 bg-gradient-to-br from-indigo-100 to-blue-200 flex-col justify-center items-center p-8">
          <lottie-player
            src="https://assets2.lottiefiles.com/packages/lf20_0yfsb3a1.json"
            background="transparent"
            speed="1"
            style={{ width: '260px', height: '260px' }}
            loop
            autoplay
          ></lottie-player>
          <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">Welcome, Customer!</h2>
          <p className="text-gray-600 text-center max-w-xs">
            Book, manage, and track your tickets with ease.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;