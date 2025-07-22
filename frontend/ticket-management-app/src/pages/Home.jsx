import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
      {/* Left: Welcome Card */}
      <div className="flex-1 flex flex-col justify-center items-start p-8 sm:p-16 max-w-xl">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 sm:p-12 w-full">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 drop-shadow">Welcome to Ticket Management System</h1>
          <p className="mb-8 text-base sm:text-lg text-gray-700">Easily book, manage, and track your tickets. Please log in or register to continue.</p>
          <div className="flex gap-4 w-full justify-start">
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400">Login</Link>
            <Link to="/register" className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300">Register</Link>
          </div>
        </div>
      </div>
      {/* Right: Lottie Animation (hidden on mobile/tablet) */}
      <div className="hidden md:flex flex-1 h-full items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <lottie-player
            src="https://assets9.lottiefiles.com/packages/lf20_1pxqjqps.json"
            background="transparent"
            speed="1"
            style={{ width: '340px', height: '340px' }}
            loop
            autoplay
            onerror={() => {
              document.getElementById('lottie-fallback').style.display = 'block';
            }}
          ></lottie-player>
          <img
            id="lottie-fallback"
            src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
            alt="Ticket Illustration"
            className="w-40 h-40 mt-4 hidden"
          />
          <p className="text-indigo-700 font-semibold mt-4 text-center">Fast, modern, and secure ticketing for everyone.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;