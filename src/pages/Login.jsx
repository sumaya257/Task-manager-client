import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const Login = () => {
  const handleGoogleSignIn = () => {
    console.log("Google Sign-In Clicked");
    // Firebase Authentication logic should be implemented here
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center">Task Manager Login</h2>
        <p className="text-center text-gray-400">Manage your tasks efficiently</p>
        
        <button 
          onClick={handleGoogleSignIn} 
          className="flex items-center justify-center w-full p-3 space-x-3 border rounded-lg transition bg-gray-700 hover:bg-gray-600"
        >
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </button>

        <p className="text-center text-gray-400">
          Not registered? 
          <Link to="/register" className="text-indigo-400 hover:underline"> Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
