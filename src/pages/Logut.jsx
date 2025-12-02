import React, { useEffect, useState } from "react";

const useNavigate = () => {
  return (path) => {
    navigate("/login");
  };
};

function Logut() {
  const [status, setStatus] = useState("Ending session...");
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      try {
        localStorage.removeItem("authToken");
        setStatus("Logout successful! Redirecting...");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch (error) {
        console.error("Logout Error:", error);
        setStatus("An error occurred during logout.");
      }
    };
    handleLogout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-100">
      <div className="p-8 bg-white shadow-xl rounded-xl text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{status}</h2>
        {status.includes("error") && (
          <p className="text-red-500 text-sm">
            Could not clear session data. Please try refreshing the page.
          </p>
        )}
      </div>
    </div>
  );
}

export default Logut;
