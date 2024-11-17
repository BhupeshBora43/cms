import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, fetchUsers } from '../store/Slices/auth.slice';

function DeleteUser() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDoubleClick = (id) => {
    console.log('id in dispatch:', id);
    dispatch(deleteUser(id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Delete Users</h1>
      <ul className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 space-y-4">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg font-medium text-gray-700">{user.name}</span>
            <button
              onDoubleClick={() => {
                console.log('user id:', user._id);
                handleDoubleClick(user._id);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
            >
              DELETE USER
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeleteUser;
