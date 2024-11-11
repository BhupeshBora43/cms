import React from 'react';
import Logo from './Logo';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/Slices/auth.slice';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-[100vw] bg-pink-400 h-16 flex items-center justify-between px-6 shadow-md">
      <Logo />

      <div className="flex space-x-4 items-center">
        {location.pathname !== '/' && (
          <Link to="/">
            <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
              Home
            </button>
          </Link>
        )}

        {isLoggedIn ? (
          <>
            <Link to="/profile">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Profile
              </button>
            </Link>
            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                Signup
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
