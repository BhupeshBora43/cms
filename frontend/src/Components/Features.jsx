import React from 'react';

function FeatureCard({ title, description, icon }) {
  return (
    <div className="feature-card bg-white p-6 shadow-md rounded-md flex flex-col items-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}

function Features() {
  return (
    <div className="features-section p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Our Key Features</h2>
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
  );
}

export default Features;
