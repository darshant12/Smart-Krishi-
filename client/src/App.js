import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FarmerEquipment from './pages/FarmerEquipment';
import FarmerAddEquipment from './pages/FarmerAddEquipment';
import FarmerSearchEquipment from './pages/FarmerSearchEquipment';
import FarmerBookings from './pages/FarmerBookings';
import FarmerOwnerBookings from './pages/FarmerOwnerBookings';
import FarmerMarketplace from './pages/FarmerMarketplace';
import Weather from './pages/Weather';
import AdminUsers from './pages/AdminUsers';
import AdminEquipment from './pages/AdminEquipment';
import AdminBookings from './pages/AdminBookings';
import AdminReports from './pages/AdminReports';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/farmer-equipment/:slotId?" element={<FarmerEquipment />} />
          <Route path="/farmer-add-equipment/:slotId?" element={<FarmerAddEquipment />} />
          <Route path="/farmer-search-equipment" element={<FarmerSearchEquipment />} />
          <Route path="/farmer-bookings" element={<FarmerBookings />} />
          <Route path="/farmer-owner-bookings" element={<FarmerOwnerBookings />} />
          <Route path="/farmer-marketplace" element={<FarmerMarketplace />} />
          <Route path="/weather" element={<Weather />} />

          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<AdminUsers />} />
          <Route path="/admin-equipment" element={<AdminEquipment />} />
          <Route path="/admin-bookings" element={<AdminBookings />} />
          <Route path="/admin-reports" element={<AdminReports />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
