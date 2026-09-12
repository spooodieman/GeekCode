import { StarsBackground } from "@/components/ui/stars-background";
import React, { useState } from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Icons for inputs
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

import { useNavigate } from "react-router";
import axios from "axios";

type formData = {
  email: string;
  password: string;
};
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<formData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        console.log("User registered: ", response.data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed: ", err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative bg-black w-full min-h-screen flex items-center justify-center login">
      <StarsBackground className="z-0" />
      <ShootingStars />
      <div className="slide-up relative z-10 bg-black/50 backdrop-blur-md border-2 border-white/50 w-[400px] p-8 rounded-lg text-white shadow-lg transition-transform transform hover:scale-105">
        <TextGenerateEffect words="Hey there," textSize="xl" duration={0.2} />
        <TextGenerateEffect
          textSize="sm"
          words="Coding made fun with friends!"
          duration={0.2}
          className="mb-6"
        />
        <form className="mt-5" onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="email" className="block font-bold mb-2">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-white/70 pointer-events-none" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange(e)}
                placeholder="Enter your email.."
                className="w-full pl-10 rounded-md p-2 mb-1 border border-white/80 bg-transparent text-white placeholder-white/70 focus:outline-blue-500 transition"
              />
            </div>
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-white/70 pointer-events-none" />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange(e)}
                placeholder="Enter your password.."
                className="w-full pl-10 rounded-md p-2 mb-1 border border-white/80 bg-transparent text-white placeholder-white/70 focus:outline-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`cursor-pointer text-white w-full p-2 bg-blue-700 hover:scale-105 hover:bg-white hover:text-black rounded-md hover:bg-blue-800  transition-all duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
