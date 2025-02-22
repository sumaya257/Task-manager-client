import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../provider/AuthProvider";

const Login = () => {
  const { signInWithGoogle } = useAuth(); // Get function from context
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard"); // Navigate to dashboard after login
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center">Task Manager Login</h2>
        <p className="text-center text-gray-400">Manage your tasks efficiently</p>
        
        <button 
          onClick={handleLogin} 
          className="flex items-center justify-center w-full p-3 space-x-3 border rounded-lg transition bg-gray-700 hover:bg-gray-600"
        >
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
