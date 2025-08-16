import React, { createContext, useState, useEffect, useContext } from "react";

const DeviceTypeContext = createContext();

export const useDeviceTypeContext = () => useContext(DeviceTypeContext);

export const DeviceTypeProvider = ({ children }) => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  const fetchDeviceTypes = async () => {
    try {
      const response = await fetch("http://localhost:3001/deviceTypes");
      const data = await response.json();
      setDeviceTypes(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching device types:", error);
      setIsLoading(false);
    }
  };

  const addDeviceType = async (typeName) => {
    try {
      // FIX: Use typeName instead of type
      const trimmedType = typeName.trim();

      // Check if type already exists
      if (deviceTypes.some((type) => type.name === trimmedType)) {
        throw new Error("Device type already exists");
      }

      const response = await fetch("http://localhost:3001/deviceTypes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedType }),
      });

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
      await fetch(`http://localhost:3001/deviceTypes/${id}`, {
        method: "DELETE",
      });
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
      }}
    >
      {children}
    </DeviceTypeContext.Provider>
  );
};
