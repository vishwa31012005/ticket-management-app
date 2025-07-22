import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerDashboard from './pages/CustomerDashboard'
import AgentDashboard from './pages/AgentDashboard'
import './index.css'

function App() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen w-full p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
        </Routes>
      </div>
    </div>
  )
}

export default App