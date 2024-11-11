import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

function Homepage() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <div className="homepage">
      <div className="hero bg-blue-500 text-white p-8 flex flex-col items-center justify-center h-[40vh]">
        <h1 className="text-4xl font-bold mb-4">Welcome to College Management System</h1>
        <p className="text-lg mb-6">Efficiently manage your attendance and courses online</p>
        {!isLoggedIn ? (
          <div className="space-x-4">
            <Link to="/signup">
              <button className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded">Get Started</button>
            </Link>
            <Link to="/login">
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">Login</button>
            </Link>
          </div>
        ) : (
          <Link to="/dashboard">
            <button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded">Go to Dashboard</button>
          </Link>
        )}
      </div>

      <div className="features-section p-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Our Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Attendance Tracking"
            description="Easily mark and monitor attendance."
            icon="📝"
          />
          <FeatureCard
            title="Course Management"
            description="Add descriptions and resources."
            icon="📚"
          />
          <FeatureCard
            title="Grading System"
            description="Professors can assign and manage grades."
            icon="🎓"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="feature-card bg-white p-6 shadow-md rounded-md flex flex-col items-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}

export default Homepage;
