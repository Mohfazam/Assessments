import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  Users, Hotel, Trash2, Edit, Plus, BookOpen, 
  Wifi, Book, Dumbbell, Utensils, LayoutDashboard 
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface HotelData {
  _id: string;
  name: string;
  price: number;
  location: string;
  amenities: string[];
}

export const AdminDashboard = () => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    location: "",
    amenities: [] as string[]
  });

  // Fetch initial data from backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("http://localhost:3000/hotels");
        setHotels(response.data);
      } catch (error) {
        toast.error("Failed to load hotels");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHotel) {
      // Update existing hotel
      setHotels(hotels.map(hotel => 
        hotel._id === editingHotel._id
          ? { 
              ...hotel, 
              name: formData.name,
              price: Number(formData.price),
              location: formData.location,
              amenities: formData.amenities
            }
          : hotel
      ));
      toast.success("Hotel updated successfully");
    } else {
      // Add new hotel
      const newHotel = {
        _id: `temp-${Date.now()}`,
        name: formData.name,
        price: Number(formData.price),
        location: formData.location,
        amenities: formData.amenities
      };
      setHotels([...hotels, newHotel]);
      toast.success("Hotel added successfully");
    }
    
    setShowHotelForm(false);
    setEditingHotel(null);
    setFormData({ name: "", price: "", location: "", amenities: [] });
  };

  // Handle delete hotel
  const handleDelete = (id: string) => {
    setHotels(hotels.filter(hotel => hotel._id !== id));
    toast.success("Hotel deleted successfully");
  };

  // Reset form
  const resetForm = () => {
    setShowHotelForm(false);
    setEditingHotel(null);
    setFormData({ name: "", price: "", location: "", amenities: [] });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8" />
          Admin Dashboard
        </h1>

        <button
          onClick={() => setShowHotelForm(true)}
          className="mb-8 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Hotel
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{hotels.length}</p>
                <p className="text-gray-600">Total Hotels</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Hotel className="w-6 h-6" />
            Hotels Management
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-3">Hotel Name</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Amenities</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel._id} className="border-b">
                    <td className="py-4">{hotel.name}</td>
                    <td className="py-4">${hotel.price}/night</td>
                    <td className="py-4">{hotel.location}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity) => (
                          <span 
                            key={amenity}
                            className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingHotel(hotel);
                            setFormData({
                              name: hotel.name,
                              price: String(hotel.price),
                              location: hotel.location,
                              amenities: hotel.amenities
                            });
                            setShowHotelForm(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit className="w-5 h-5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(hotel._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(showHotelForm || editingHotel) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-md relative"
            >
              <h2 className="text-2xl font-bold mb-4">
                {editingHotel ? "Edit Hotel" : "Add New Hotel"}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Hotel Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Price per Night</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Amenities</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["WiFi", "Swimming Pool", "Gym", "Breakfast"].map((amenity) => (
                        <label key={amenity} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={amenity}
                            checked={formData.amenities.includes(amenity)}
                            onChange={handleInputChange}
                          />
                          {amenity}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {editingHotel ? "Update Hotel" : "Add Hotel"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};