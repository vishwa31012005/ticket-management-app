import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import axios from 'axios';
import { FaTicketAlt, FaEnvelope } from 'react-icons/fa';

function AgentDashboard() {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:8000/api/tickets/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data);
    } catch (error) {
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTickets();
  }, [token]);

  const handleStatusChange = async (ticketId, newStatus) => {
    setLoading(true);
    setError('');
    try {
      await axios.patch(
        `http://localhost:8000/api/tickets/${ticketId}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTickets();
    } catch (error) {
      setError('Failed to update ticket status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (ticketId) => {
    setLoading(true);
    setError('');
    try {
      await axios.post(
        `http://localhost:8000/api/tickets/${ticketId}/send-email/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('📬 Email sent to customer!');
    } catch (error) {
      alert('❌ Failed to send email.');
      setError('Failed to send email.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="inline-block px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wide">Open</span>;
      case 'in_progress':
        return <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-400 text-gray-900 text-xs font-bold uppercase tracking-wide">In Progress</span>;
      case 'resolved':
        return <span className="inline-block px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold uppercase tracking-wide">Resolved</span>;
      default:
        return <span className="inline-block px-2 py-0.5 rounded-full bg-gray-400 text-white text-xs font-bold uppercase tracking-wide">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="flex flex-col lg:flex-row w-full h-full flex-1">
        {/* Left: Main Content */}
        <div className="w-full lg:w-2/3 flex flex-col justify-center items-center p-6 sm:p-10">
          <div className="w-full max-w-4xl rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6 w-full max-w-2xl mx-auto">
              <FaTicketAlt className="w-8 h-8 text-indigo-700" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 drop-shadow">Agent Dashboard <span className="text-base font-medium text-indigo-500">{user?.email}</span></h1>
            </div>
            {error && <p className="w-full text-center bg-red-100 text-red-700 rounded px-3 py-2 mb-4 text-sm font-medium border border-red-200">{error}</p>}
            {loading && <p className="text-gray-600 text-sm mb-4">Loading tickets...</p>}
            <Card title={<span className="flex items-center gap-2"><FaTicketAlt className="w-5 h-5 text-yellow-400" /> Assigned Tickets</span>}>
              <ul className="divide-y divide-indigo-50 mb-2">
                {tickets.length === 0 && <li className="py-4 text-gray-500 text-center">No tickets assigned.</li>}
                {tickets.map((ticket) => (
                  <li key={ticket.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-base font-medium text-gray-900 flex items-center gap-2">{ticket.title} {getStatusBadge(ticket.status)}</div>
                      <div className="text-xs text-gray-500">Customer: {ticket.customer?.email || 'N/A'}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                      <label className="sr-only" htmlFor={`status-${ticket.id}`}>Status</label>
                      <select
                        id={`status-${ticket.id}`}
                        value={ticket.status || ''}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        className="min-w-[130px] p-2 rounded-lg border border-gray-700 text-sm font-semibold focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition disabled:bg-gray-100 bg-gray-900 text-white shadow"
                        disabled={loading}
                      >
                        <option value="" disabled>Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <button
                        onClick={() => handleSendEmail(ticket.id)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-blue-300 text-sm"
                        disabled={loading}
                      >
                        <FaEnvelope className="w-4 h-4" /> Send Email
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
        {/* Right: Animated Illustration/Welcome (hidden on mobile/tablet) */}
        <div className="hidden lg:flex w-1/3 bg-gradient-to-br from-indigo-100 to-blue-200 flex-col justify-center items-center p-8">
          <lottie-player
            src="https://assets2.lottiefiles.com/packages/lf20_3rwasyjy.json"
            background="transparent"
            speed="1"
            style={{ width: '260px', height: '260px' }}
            loop
            autoplay
          ></lottie-player>
          <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">Support Dashboard</h2>
          <p className="text-gray-600 text-center max-w-xs">
            Stay on top of tickets and help customers efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;