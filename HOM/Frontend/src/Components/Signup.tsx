import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/signup", formData);
      if (response.data.message === "User Signed Up") {
        toast.success("Signup successful! Redirecting to login...", {
          autoClose: 2000,
          onClose: () => navigate("/signin"), // Navigate to /signin after toast closes
        });
        setFormData({
          username: "",
          email: "",
          password: "",
          isAdmin: false,
        });
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        toast.error(err.response.data.message); // Display backend error message
      } else {
        toast.error("An error occurred. Please try again."); // Generic error message
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600"
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white">Create an Account</h2>
          <p className="mt-2 text-gray-200">
            Join us to unlock exclusive features.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Username</label>
            <div className="flex items-center p-3 bg-white/10 rounded-lg">
              <User className="w-5 h-5 text-gray-200" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full ml-3 bg-transparent outline-none text-white placeholder-gray-300"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Email</label>
            <div className="flex items-center p-3 bg-white/10 rounded-lg">
              <Mail className="w-5 h-5 text-gray-200" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full ml-3 bg-transparent outline-none text-white placeholder-gray-300"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Password</label>
            <div className="flex items-center p-3 bg-white/10 rounded-lg">
              <Lock className="w-5 h-5 text-gray-200" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full ml-3 bg-transparent outline-none text-white placeholder-gray-300"
                required
              />
            </div>
          </div>

          {/* Admin Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-200">Sign up as Admin</label>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex items-center justify-center p-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-semibold"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-gray-200">
          Already have an account?{" "}
          <a href="/signin" className="text-white hover:underline">
            Log in
          </a>
        </p>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </motion.div>
  );
};
