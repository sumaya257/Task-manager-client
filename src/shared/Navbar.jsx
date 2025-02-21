import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // To navigate programmatically

  const handleLogout = async () => {
    await logout(); // Call the logout function from context
    navigate("/"); // Navigate to home page after logout
  };

  return (
    <div className="navbar bg-gray-900 text-white shadow-md sticky top-0 z-10">
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-gray-800 text-white rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/" className="hover:text-indigo-400">
                Home
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
        {/* Logo */}
        <Link to="/" className="btn btn-ghost text-xl text-indigo-400">
          TaskManager
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className="hover:text-indigo-400">
              Home
            </Link>
          </li>
          {user && (
            <li>
              <Link to="/dashboard" className="hover:text-indigo-400">
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* User Authentication - Login/Logout */}
      <div className="navbar-end">
        {user ? (
          <>
            <span className="px-4 py-2 text-white">{user.displayName}</span>
            <button
              onClick={handleLogout} // Logout and navigate to Home
              className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
