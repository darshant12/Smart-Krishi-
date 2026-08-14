import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import API_BASE from '../config';

const EquipmentContext = createContext(null);
const initialEquipment = [];

function normalizeBooking(booking) {
  return {
    id: booking._id || booking.id,
    equipmentId: booking.equipment,
    equipmentName: booking.equipmentName,
    rate: booking.rate,
    owner: booking.owner,
    ownerName: booking.ownerName,
    ownerEmail: booking.ownerEmail,
    ownerContact: booking.ownerContact,
    ownerLocation: booking.ownerLocation,
    requester: booking.requester,
    requesterName: booking.requesterName,
    requesterEmail: booking.requesterEmail,
    requesterContact: booking.requesterContact,
    bookingLocation: booking.bookingLocation,
    hours: booking.hours,
    status: booking.status,
    ownerMessage: booking.ownerMessage,
    requesterMessage: booking.requesterMessage,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

export function EquipmentProvider({ children }) {
  const { token } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [ownerBookingRequests, setOwnerBookingRequests] = useState([]);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/equipment`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders },
      });
      if (!response.ok) {
        throw new Error('Unable to load equipment');
      }
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error('Fetch equipment failed:', error);
      setEquipment(initialEquipment);
    }
  };

  const fetchBookingRequests = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/api/bookings/requester`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders },
      });
      if (!response.ok) {
        throw new Error('Unable to load booking requests');
      }
      const data = await response.json();
      setBookingRequests(data.map(normalizeBooking));
    } catch (error) {
      console.error('Fetch requester bookings failed:', error);
      setBookingRequests([]);
    }
  };

  const fetchOwnerBookingRequests = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/api/bookings/owner`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders },
      });
      if (!response.ok) {
        throw new Error('Unable to load owner booking requests');
      }
      const data = await response.json();
      setOwnerBookingRequests(data.map(normalizeBooking));
    } catch (error) {
      console.error('Fetch owner bookings failed:', error);
      setOwnerBookingRequests([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEquipment();
      fetchBookingRequests();
      fetchOwnerBookingRequests();
    }
  }, [token]);

  const addEquipment = async (newItem) => {
    try {
      const hasPhoto = newItem.photoFile instanceof File;
      const headers = hasPhoto ? { ...authHeaders } : { 'Content-Type': 'application/json', ...authHeaders };
      const body = hasPhoto
        ? (() => {
            const formData = new FormData();
            formData.append('name', newItem.name);
            formData.append('type', newItem.type);
            formData.append('rate', newItem.rate);
            formData.append('contact', newItem.contact);
            formData.append('location', newItem.location);
            formData.append('description', newItem.description || '');
            formData.append('photo', newItem.photoFile);
            return formData;
          })()
        : JSON.stringify(newItem);

      const response = await fetch(`${API_BASE}/api/equipment`, {
        method: 'POST',
        headers,
        body,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Unable to add equipment');
      }
      const createdItem = await response.json();
      setEquipment((current) => [...current, createdItem]);
      return createdItem;
    } catch (error) {
      console.error('Add equipment failed:', error);
      throw error;
    }
  };

  const addBookingRequest = async ({ equipmentId, hours, requesterContact, requesterEmail, bookingLocation }) => {
    try {
      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ equipmentId, hours, requesterContact, requesterEmail, bookingLocation }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Unable to request booking');
      }
      const data = await response.json();
      const booking = normalizeBooking(data.booking);
      setBookingRequests((current) => [booking, ...current]);
      await fetchBookingRequests();
      return booking;
    } catch (error) {
      console.error('Add booking request failed:', error);
      throw error;
    }
  };

  const updateBookingRequestStatus = async (id, status) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Unable to update booking status');
      }
      const data = await response.json();
      const updatedBooking = normalizeBooking(data.booking);
      setBookingRequests((current) => current.map((request) => (request.id === updatedBooking.id ? updatedBooking : request)));
      setOwnerBookingRequests((current) => current.map((request) => (request.id === updatedBooking.id ? updatedBooking : request)));
      return updatedBooking;
    } catch (error) {
      console.error('Update booking status failed:', error);
      throw error;
    }
  };

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        addEquipment,
        bookingRequests,
        ownerBookingRequests,
        addBookingRequest,
        updateBookingRequestStatus,
        fetchEquipment,
        fetchBookingRequests,
        fetchOwnerBookingRequests,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider');
  }
  return context;
}
