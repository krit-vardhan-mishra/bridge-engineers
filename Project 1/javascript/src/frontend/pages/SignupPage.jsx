import FeaturesSidebar from "../components/FeaturesSidebar";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { SignupPageSkeleton } from "./skeleton/SignupPageSkeleton";


export const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Signup - Blog App";

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return <SignupPageSkeleton />;
  }

  return (
    <div className="flex h-screen bg-[#1C222A]">
      {/* Left Side -Features Sidebar */}
      <FeaturesSidebar />

      {/* Right Side - Form */}
      <div className="flex flex-col items-center justify-center w-1/2 bg-[#2A2E36]">
        <p className="text-white text-3xl font-bold mb-8">
          Welcome to Your Blog Space
        </p>
        <h1 className="text-white text-4xl font-bold mb-10">Sign up Here</h1>

        <form className="w-3/4 space-y-6">
          {/* Email */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <label
              className="col-span-1 text-white transform transition-transform duration-200 hover:scale-110"
              htmlFor="firstName"
            >
              <b>First Name:</b>
            </label>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="col-span-3 w-full"
            >
              <input
                type="text"
                id="firstName"
                className="w-full p-3 bg-[#1C222A] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 hover:border-white hover:border-2 transition duration-200"
                placeholder="Enter your email"
                required
              />
            </motion.div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <label
              className="col-span-1 text-white transform transition-transform duration-200 hover:scale-110"
              htmlFor="lastName"
            >
              <b>Last Name:</b>
            </label>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="col-span-3 w-full"
            >
              <input
                type="text"
                id="lastName"
                className="w-full p-3 bg-[#1C222A] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 hover:border-white hover:border-2 transition duration-200"
                placeholder="Enter your email"
                required
              />
            </motion.div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <label
              className="col-span-1 text-white transform transition-transform duration-200 hover:scale-110"
              htmlFor="email"
            >
              <b>Email:</b>
            </label>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="col-span-3 w-full"
            >
              <input
                type="email"
                id="email"
                className="w-full p-3 bg-[#1C222A] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 hover:border-white hover:border-2 transition duration-200"
                placeholder="Enter your email"
                required
              />
            </motion.div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <label
              className="col-span-1 text-white transform transition-transform duration-200 hover:scale-110"
              htmlFor="password"
            >
              <b>Password:</b>
            </label>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="col-span-3 relative w-full"
            >
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full p-3 pr-10 bg-[#1C222A] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 hover:border-white hover:border-2 transition duration-200"
                placeholder="Enter your password"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-white" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-white" />
                )}
              </div>
            </motion.div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex justify-center space-x-3">
            <input
              type="checkbox"
              id="remember"
              className="h-5 w-5 bg-[#1C222A] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white hover:border-2 transition duration-200"
            />
            <label htmlFor="remember" className="text-white">
              <b>Remember Me</b>
            </label>
          </div>

          {/* Sign up Button */}
          <div className="flex justify-center mt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg rounded-xl" asChild>
                <a href="/home">Sign up</a>
              </Button>
            </motion.div>
          </div>
        </form>
        <p className="text-white mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Log in
          </a>
          </p>
      </div>
    </div>
  );
};

export default SignupPage;