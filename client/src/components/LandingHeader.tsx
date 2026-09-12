import React from "react";
import { useNavigate } from "react-router";

function LandingHeader() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-20 p-4 flex items-center">
      <div className="flex justify-end gap-3 w-full">
        {/* Login Button */}
        <div className="p-2 bg-black rounded-md transition-transform duration-300 hover:scale-110 cursor-pointer">
          <h1
            className="text-white/70 transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
            onClick={() => navigate("/login")}
          >
            Login
          </h1>
        </div>

        {/* Get Started Button */}
        <div className="p-2 bg-black rounded-md transition-transform duration-300 hover:scale-110 cursor-pointer">
          <h1
            className="text-white/70 transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
            onClick={() => navigate("/get-started")}
          >
            Get Started!
          </h1>
        </div>
      </div>
    </div>
  );
}

export default LandingHeader;
