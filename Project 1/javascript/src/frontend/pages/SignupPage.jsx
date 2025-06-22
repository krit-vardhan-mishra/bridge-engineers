import FeaturesSidebar from "../components/FeaturesSidebar";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export const SignupPage = () => {
  useEffect(() => {
    document.title = "Signup - Blog App";
  }, []);

    const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen bg-[#1C222A]">
      <FeaturesSidebar />

      <div className="flex flex-col items-center justify-center w-1/2 bg-[#2A2E36]">
        <p className="text-white text-3xl font-bold mb-8">
          Welcome to Your Blog Space
        </p>
        <h1 className="text-white text-4xl font-bold mb-10">Sign up Here</h1>
        <form className="w-3/4 space-y-6">
          <div className="grid grid-cols-4 gap-4 items-center">
            <label
              className="col-span-1 text-white transform transition-transform duration-200 hover:scale-110"
              htmlFor="email">
              <b>Email:</b>
            </label>
            <input
              type="email"
              id="email"
              className="col-span-3 p-3 bg-[#1C222A] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 hover:border-white hover:border-2 transition duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="grid grid-cols-4 gap-4 items-center">
            <label className="col-span-1 text-white transform transition-transform duration-200 hover:scale-110"
              htmlFor="password">
              <b>Password:</b>
            </label>
            <div className="col-span-3 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full p-3 pr-10 bg-[#1C222A] text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 hover:border-white hover:border-2 transition duration-200"
                placeholder="Enter your password"
                required
              />
              <div
                className="absolute inset-y-0 right-0 pr-1 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
                style={{ right: '0.75rem' }}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-white" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-white" />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <a href="/">Sign up</a>
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;