import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  MapPin, 
  Star, 
  Wifi, 
  Utensils, 
  Dumbbell, 
  Book, 
  CalendarDays,
  User,
  X 
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AllHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("http://localhost:3000/hotels");
        setHotels(response.data);
      } catch (err) {
        setError("Failed to fetch hotels. Please try again later.");
        console.error("Fetch hotels error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const getAmenityIcon = (amenity) => {
    const icons = {
      "WiFi": <Wifi className="w-4 h-4" />,
      "Breakfast": <Utensils className="w-4 h-4" />,
      "Gym": <Dumbbell className="w-4 h-4" />,
      "Swimming Pool": <Book className="w-4 h-4" />
    };
    return icons[amenity] || null;
  };

  const handleBookClick = (hotel) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to book a hotel");
      return;
    }
    setSelectedHotel(hotel);
    setBookingData({ checkIn: "", checkOut: "", guests: 1 });
  };

  const validateBooking = () => {
    const { checkIn, checkOut, guests } = bookingData;
    const today = new Date().toISOString().split('T')[0];

    if (!checkIn || !checkOut) {
      toast.error("Please select both dates");
      return false;
    }

    if (new Date(checkIn) < new Date(today)) {
      toast.error("Check-in date cannot be in the past");
      return false;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error("Check-out must be after check-in");
      return false;
    }

    if (guests < 1 || guests > 10) {
      toast.error("Guests must be between 1-10");
      return false;
    }

    return true;
  };

  const handleBookingSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");

      if (!token || !username) {
        toast.error("Authentication expired. Please login again.");
        return;
      }

      if (!validateBooking()) return;

      const payload = {
        username,
        hotelId: selectedHotel._id,
        checkIn: new Date(bookingData.checkIn).toISOString(),
        checkOut: new Date(bookingData.checkOut).toISOString(),
        guests: Number(bookingData.guests)
      };

      const response = await axios.post(
        "http://localhost:3000/book-hotel",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      setSelectedHotel(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         "Booking failed";
      toast.error(errorMessage);
      console.error("Booking error:", error.response?.data);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <ToastContainer position="top-center" />

      {/* Booking Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md relative"
          >
            <button
              onClick={() => setSelectedHotel(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Book {selectedHotel.name}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Check-in</label>
                  <div className="flex items-center border rounded-lg p-3">
                    <CalendarDays className="w-5 h-5 mr-2 text-gray-400" />
                    <input
                      type="date"
                      value={bookingData.checkIn}
                      onChange={(e) => setBookingData({ 
                        ...bookingData, 
                        checkIn: e.target.value 
                      })}
                      className="w-full outline-none"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Check-out</label>
                  <div className="flex items-center border rounded-lg p-3">
                    <CalendarDays className="w-5 h-5 mr-2 text-gray-400" />
                    <input
                      type="date"
                      value={bookingData.checkOut}
                      onChange={(e) => setBookingData({ 
                        ...bookingData, 
                        checkOut: e.target.value 
                      })}
                      className="w-full outline-none"
                      min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Guests</label>
                <div className="flex items-center border rounded-lg p-3">
                  <User className="w-5 h-5 mr-2 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bookingData.guests}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(10, Number(e.target.value)));
                      setBookingData({
                        ...bookingData,
                        guests: Number.isNaN(value) ? 1 : value
                      });
                    }}
                    className="w-full outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleBookingSubmit}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg 
                         hover:bg-blue-700 transition-colors font-medium"
              >
                Confirm Booking
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Available Hotels
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <motion.div
              key={hotel._id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {hotel.name}
                  </h2>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1">4.8</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <p className="text-sm">{hotel.location}</p>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ${hotel.price}
                  </span>
                  <span className="text-gray-500 ml-1">/ night</span>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities?.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center px-3 py-1 bg-gray-100 
                                 rounded-full text-sm text-gray-700"
                      >
                        {getAmenityIcon(amenity)}
                        <span className="ml-1">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4">
                <button
                  onClick={() => handleBookClick(hotel)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg 
                           hover:bg-blue-700 transition-colors font-medium"
                >
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
