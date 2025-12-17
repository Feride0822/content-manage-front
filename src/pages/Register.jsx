import React, { useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { BsInfoSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [uName, setUname] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (uName.length < 4 || password.length < 6) {
      setError("Username must be 4+ chars, Password must be 6+ chars.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await registerUser(uName, password);
      const { accessToken, user, refreshToken } = data;

      register({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          pseudoname: user.pseudoname,
        },
      });

      setSuccess(data.message);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-[#EFF6FF] to-[#E0E7FF]">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="text-indigo-600">
            <VscAccount className="w-10 h-10" />
          </div>
          <h1 className="text-xl text-gray-900">Anonymous Social</h1>
          <p className="text-lg text-gray-500 mt-1">
            Only username and password required; pseudoname will be
            auto-generated
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={uName}
              onChange={(e) => setUname(e.target.value)}
              placeholder="Enter username"
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-400 text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-400 text-sm"
            />
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-200 text-sm text-gray-700 p-3 rounded-lg">
            <div className="flex items-start justify-start gap-2">
              <BsInfoSquareFill className="w-6 h-6" />
              <p>A pseudoname will be automatically generated for you.</p>
            </div>
          </div>

          {/* Error & Success messages */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
              {success}
            </div>
          )}

          {/* Register button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition duration-150 ease-in-out disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Footer login link */}
        <div className="mt-4">
          <button
            type="button"
            onClick={navigateToLogin}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out cursor-pointer"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
