import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/Slices/auth.slice';

function AdminGetUsers() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Users listed in the application</h1>
      <ul className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 space-y-6">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
          >
            <div className="flex items-center space-x-6">
              <img
                src={
                  user.avatar?.secure_url ||
                  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
                }
                alt="Profile Avatar"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-800">{user.name}</span>
                <span className="text-gray-600">{user.email}</span>
              </div>
            </div>
            <span className="text-lg font-medium text-gray-700">{user.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminGetUsers;
