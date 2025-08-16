import React, { createContext, useState, useEffect, useContext } from "react";

const DeviceTypeContext = createContext();

// Fallback to localhost in development
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
// const API_URL = import.meta.env.VITE_API_BASE_URL;

export const useDeviceTypeContext = () => useContext(DeviceTypeContext);

export const DeviceTypeProvider = ({ children }) => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample data for development fallback
  const sampleDeviceTypes = [
    { id: 1, name: "Camera" },
    { id: 2, name: "Tablet" },
    { id: 3, name: "Push To Talk" },
  ];

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  const fetchDeviceTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/deviceTypes`);
      if (!response.ok) throw new Error("Failed to fetch device types");

      const data = await response.json();
      setDeviceTypes(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching device types:", error);
      setError("Failed to load device types");

      // Use sample data only in development
      if (import.meta.env.DEV) {
        setDeviceTypes(sampleDeviceTypes);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addDeviceType = async (typeName) => {
    try {
      const trimmedType = typeName.trim();

      // Check if type already exists
      if (deviceTypes.some((type) => type.name === trimmedType)) {
        throw new Error("Device type already exists");
      }

      const response = await fetch(`${API_URL}/deviceTypes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add device type");
      }

      const newType = await response.json();
      setDeviceTypes((prev) => [...prev, newType]);
      return newType;
    } catch (error) {
      console.error("Error adding device type:", error);
      throw error;
    }
  };

  const removeDeviceType = async (id) => {
    try {
      const response = await fetch(`${API_URL}/deviceTypes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete device type");
      }

      setDeviceTypes((prev) => prev.filter((type) => type.id !== id));
    } catch (error) {
      console.error("Error removing device type:", error);
      throw error;
    }
  };

  return (
    <DeviceTypeContext.Provider
      value={{
        deviceTypes,
        addDeviceType,
        removeDeviceType,
        isLoading,
        error,
      }}
    >
      {children}
    </DeviceTypeContext.Provider>
  );
};
