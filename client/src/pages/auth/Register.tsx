import { StarsBackground } from "@/components/ui/stars-background";
import React, { useState } from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Icons for inputs
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import axios from "axios";
import { useNavigate } from "react-router";

type FormData = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
};

function Register() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      //not using fetchdata because while doing auth, the user doesnt have any token
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData
      );

      if (response.status === 201) {
        // Handle successful registration
        console.log("Registration successful");
        // Reset form data
        setFormData({
          firstname: "",
          lastname: "",
          username: "",
          email: "",
          password: "",
        });
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Error occured during registration: ", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

        {/* form  */}
        <form className="mt-5 max-h-[500px]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 ">
            {/* firstname */}
            <div className="mb-2 relative">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-white/70 pointer-events-none" />
                <input
                  name="firstname"
                  type="text"
                  placeholder="First name"
                  value={formData.firstname}
                  onChange={(e) => handleChange(e)}
                  className="w-full pl-10 rounded-md p-2 mb-1 border border-white/80 bg-transparent text-white placeholder-white/70 focus:outline-blue-500 transition"
                />
              </div>
            </div>

            {/* lastname */}
            <div className="mb-2 relative">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-white/70 pointer-events-none" />
                <input
                  name="lastname"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastname}
                  onChange={(e) => handleChange(e)}
                  className="w-full pl-10 rounded-md p-2 mb-1 border border-white/80 bg-transparent text-white placeholder-white/70 focus:outline-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* username */}
          <div className="mb-2 relative">
            <label htmlFor="username" className="block font-bold mb-2">
              Username
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-white/70 pointer-events-none" />
              <input
                name="username"
                type="text"
                placeholder="Enter your username.."
                value={formData.username}
                onChange={(e) => handleChange(e)}
                className="w-full pl-10 rounded-md p-2 mb-1 border border-white/80 bg-transparent text-white placeholder-white/70 focus:outline-blue-500 transition"
              />
            </div>
          </div>

          {/* email */}
          <div className="mb-4 relative">
            <label htmlFor="email" className="block font-bold mb-2">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-white/70 pointer-events-none" />
              <input
                name="email"
                type="email"
                placeholder="Enter your email.."
                value={formData.email}
                onChange={(e) => handleChange(e)}
                className="w-full pl-10 rounded-md p-2 mb-1 border border-white/80 bg-transparent text-white placeholder-white/70 focus:outline-blue-500 transition"
              />
            </div>
          </div>

          {/* password  */}
          <div className="mb-6 relative">
            <label htmlFor="password" className="block font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-white/70 pointer-events-none" />
              <input
                name="password"
                type="password"
                placeholder="Enter your password.."
                value={formData.password}
                onChange={(e) => handleChange(e)}
                className="w-full pl-10 rounded-md p-2 mb-1 border border-white/80 bg-transparent text-white placeholder-white/70 focus:outline-blue-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`cursor-pointer w-full p-2 bg-blue-700 text-white hover:scale-105 hover:bg-white hover:text-black rounded-md hover:bg-blue-800  transition-all duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
