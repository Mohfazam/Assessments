import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { X, Building, MapPin, DollarSign, Wifi, SwimmingPool, Dumbbell, Utensils, LayoutDashboard } from "lucide-react";

export const Landing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [formData, setFormData] = useState({
    hotelName: "",
    price: "",
    location: "",
    amenities: []
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        amenities: checked 
          ? [...prev.amenities, value]
          : prev.amenities.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleListYourHotel = async () => {
    setLoading(true);
    const username = localStorage.getItem("username");
    
    try {
      const response = await axios.post("http://localhost:3000/hotels", {
        username,
        hotelName: formData.hotelName,
        price: formData.price,
        location: formData.location,
        amenities: formData.amenities
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success(response.data.message);
      setShowHotelForm(false);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating hotel");
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
      <div className="w-full max-w-4xl p-8 space-y-8">
        <div className="flex justify-end">
          {localStorage.getItem("isAdmin") === "true" && (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center bg-white/10 backdrop-blur-lg px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </button>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">Welcome to HotelHub</h1>
          <p className="mt-4 text-xl text-gray-200">
            Discover amazing hotels or list your own.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* View All Hotels Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 cursor-pointer"
            onClick={() => navigate("/allhotels")}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">View All Hotels</h2>
              <p className="mt-4 text-gray-200">
                Explore a wide range of hotels and book your stay.
              </p>
            </div>
          </motion.div>

          {/* List Your Hotel Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-8 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 cursor-pointer"
            onClick={() => setShowHotelForm(true)}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">List Your Hotel</h2>
              <p className="mt-4 text-gray-200">
                Become an admin and list your hotel to reach more guests.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Hotel Form Modal */}
        {showHotelForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-md relative"
            >
              <button
                onClick={() => setShowHotelForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold mb-4">List Your Hotel</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Hotel Name</label>
                  <div className="flex items-center border rounded-lg p-3">
                    <Building className="w-5 h-5 mr-2 text-gray-400" />
                    <input
                      type="text"
                      name="hotelName"
                      value={formData.hotelName}
                      onChange={handleInputChange}
                      className="w-full outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price per Night</label>
                  <div className="flex items-center border rounded-lg p-3">
                    <DollarSign className="w-5 h-5 mr-2 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <div className="flex items-center border rounded-lg p-3">
                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amenities</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["WiFi", "Swimming Pool", "Gym", "Breakfast"].map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onChange={handleInputChange}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleListYourHotel}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "List Hotel"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

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
      </div>
    </motion.div>
  );
};