import React, { useState, useCallback } from "react";
import { VscAccount } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);
    },
    [username, password, navigate]
  );

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    // outer container
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-[#EFF6FF] to-[#E0E7FF]">
      {/* login card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-2xl transition-all duration-300">
        {/* above part of login card */}
        <div className="flex flex-col">
          {/* icons part */}
          <div className="flex flex-col gap-2 items-center text-center mb-8">
            {/* icon */}
            <div className="text-indigo-600">
              <VscAccount className="w-10 h-10" />
            </div>
            <h1 className="text-xl text-gray-900">Anonymous Social</h1>
            <p className="text-lg text-gray-500 mt-1">
              Connect with pseudonymous identities
            </p>
          </div>

          {/* info box */}
          <div className="bg-blue-50 border border-blue-200 text-sm text-blue-700 p-3 rounded-lg mb-6">
            <p className="text-blue-900 font-semibold">First time?</p>
            <p className="">
              Please register a new account to get started with the
              backend-powered app.
            </p>
          </div>
        </div>

        {/* lower part of login card */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* username field */}
          <div className="">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your real username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-400 text-sm"
              disabled={isLoading}
            />
          </div>
          {/* password field */}
          <div className="">
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
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-400 text-sm"
              disabled={isLoading}
            />
          </div>

          {/* error message if will be needed */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          {/* login button */}
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
              "Login"
            )}
          </button>
        </form>

        {/* footer register link */}
        <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={navigateToRegister}
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md cursor-pointer"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
