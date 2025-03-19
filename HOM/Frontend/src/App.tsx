import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Signup } from './Components/Signup';
import { Signin } from './Components/Signin';
import { Landing } from './Components/Landing';
import { AllHotels } from './Components/AllHotels';
import { AdminDashboard } from './Components/AdminDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/allhotels" element={<AllHotels />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
        {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      </div>
    </Router>
  );
};

export default App;