import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Dashboard() {
  const userRole = useSelector((state) => state.auth.role);
  const data = useSelector((state) => state.auth.data);
  const studentActions = [
    { name: 'View Courses', path: '/courses', icon: '📚' },
    { name: 'Request Course', path: '/request-course', icon: '📝' },
    { name: 'View Attendance', path: '/attendance', icon: '📅' },
  ];

  const professorActions = [
    ...studentActions,
    { name: 'Mark Attendance', path: '/mark-attendance', icon: '✅' },
    { name: 'Add Synopsis', path: '/add-synopsis', icon: '✏️' },
  ];

  const adminActions = [
    { name: 'Get User Account', path: '/get-user', icon: '🧑‍💼' },
    { name: 'Assign Role', path: '/assign-role', icon: '🔄' },
    { name: 'Delete User', path: '/delete-user', icon: '🗑️' },
    { name: 'Add Course', path: '/add-course', icon: '➕' },
    { name: 'Courses to Verify', path: '/verify-courses', icon: '✅' },
    { name: 'Verify Course', path: '/verify-course', icon: '✔️' },
  ];

  const noRoleMessage = "You don't have a role assigned yet. Please contact admin.";

  const getActions = () => {
    if (userRole === 'STUDENT') return studentActions;
    if (userRole === 'PROFESSOR') return professorActions;
    if (userRole === 'ADMIN') return adminActions;
    return [];
  };

  const actions = getActions();

  return (
    <div className="min-h-screen bg-gray-100 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome!!! {data.name}</h1>
      {actions.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {actions.map((action, index) => (
            <Link key={index} to={action.path}>
              <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1">
                <div className="text-4xl">{action.icon}</div>
                <h2 className="text-xl font-semibold mt-4 text-gray-700">{action.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-md mt-8">
          {noRoleMessage}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
