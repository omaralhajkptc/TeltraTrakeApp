import React, { createContext, useContext, useEffect, useState } from "react";

const DeviceContext = createContext();

// Sample devices moved to top as requested
const getSampleDevices = () => [
  {
    id: 1,
    name: "Security Camera - Front Door",
    simCard: "SIM-123456",
    dateAdded: "2023-05-15T08:30:00Z",
    status: "active",
    deviceType: "camera",
    history: [
      {
        oldSim: "SIM-111111",
        newSim: "SIM-123456",
        changedAt: "2023-08-22T14:30:00Z",
      },
    ],
  },
  {
    id: 2,
    name: "Smart Meter - Floor 2",
    simCard: "SIM-789012",
    dateAdded: "2023-06-20T10:15:00Z",
    status: "active",
    deviceType: "meter",
    history: [],
  },
  {
    id: 3,
    name: "Vehicle Tracker - Truck #5",
    simCard: "SIM-345678",
    dateAdded: "2023-07-10T13:45:00Z",
    status: "inactive",
    deviceType: "tracker",
    history: [
      {
        oldSim: "SIM-222222",
        newSim: "SIM-345678",
        changedAt: "2023-09-05T09:15:00Z",
      },
      {
        oldSim: "SIM-345678",
        newSim: "SIM-999999",
        changedAt: "2023-10-12T16:20:00Z",
      },
      {
        oldSim: "SIM-999999",
        newSim: "SIM-345678",
        changedAt: "2023-11-18T11:30:00Z",
      },
    ],
  },
  {
    id: 4,
    name: "POS Terminal - Store #3",
    simCard: "SIM-456789",
    dateAdded: "2023-08-05T09:00:00Z",
    status: "active",
    deviceType: "terminal",
    history: [],
  },
  {
    id: 5,
    name: "Environmental Sensor - Warehouse",
    simCard: "SIM-567890",
    dateAdded: "2023-09-12T14:20:00Z",
    status: "warning",
    deviceType: "sensor",
    history: [
      {
        oldSim: "SIM-000000",
        newSim: "SIM-567890",
        changedAt: "2023-10-01T11:45:00Z",
      },
    ],
  },
];

export const useDeviceContext = () => useContext(DeviceContext);

export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({
    status: "",
    deviceType: "",
    searchTerm: "",
  });

  // Initialize devices from localStorage
  useEffect(() => {
    const loadDevices = () => {
      try {
        const savedDevices = localStorage.getItem("devices");
        if (savedDevices) {
          return JSON.parse(savedDevices);
        }
        const sampleDevices = getSampleDevices();
        localStorage.setItem("devices", JSON.stringify(sampleDevices));
        return sampleDevices;
      } catch (error) {
        console.error("Error loading devices:", error);
        return getSampleDevices();
      }
    };

    setIsLoading(true);
    try {
      const loadedDevices = loadDevices();
      setDevices(loadedDevices);
      setFilteredDevices(loadedDevices);
    } catch (err) {
      setError("Failed to load devices");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (devices.length > 0) {
      localStorage.setItem("devices", JSON.stringify(devices));
    }
  }, [devices]);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters(currentFilters);
  }, [currentFilters, devices]);

  const applyFilters = ({ status, deviceType, searchTerm }) => {
    let result = [...devices];

    if (status) {
      result = result.filter((device) => device.status === status);
    }

    if (deviceType) {
      result = result.filter((device) => device.deviceType === deviceType);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (device) =>
          device.name.toLowerCase().includes(term) ||
          device.simCard.toLowerCase().includes(term)
      );
    }

    setFilteredDevices(result);
  };

  const filterDevices = (filters) => {
    setCurrentFilters(filters);
  };

  const getDeviceById = (id) => {
    return devices.find((device) => device.id === id);
  };

  // For backend readiness: All CRUD operations have async versions commented out
  const addDevice = (device) => {
    /* Backend version:
    setIsLoading(true);
    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(device)
      });
      const newDevice = await response.json();
      setDevices(prev => [...prev, newDevice]);
      return newDevice;
    } catch (err) {
      setError("Failed to add device");
    } finally {
      setIsLoading(false);
    }
    */

    // Local version
    const newDevice = {
      ...device,
      id: Date.now(),
      dateAdded: new Date().toISOString(),
      status: "active",
      history: [],
    };

    setDevices([...devices, newDevice]);
    return newDevice;
  };

  const updateDevice = (id, updatedData) => {
    /* Backend version:
    setIsLoading(true);
    try {
      const response = await fetch(`/api/devices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      const updatedDevice = await response.json();
      setDevices(prev => 
        prev.map(device => device.id === id ? updatedDevice : device)
      );
      return updatedDevice;
    } catch (err) {
      setError("Failed to update device");
    } finally {
      setIsLoading(false);
    }
    */

    // Local version
    setDevices(
      devices.map((device) =>
        device.id === id ? { ...device, ...updatedData } : device
      )
    );
  };

  const updateSimCard = (id, newSim) => {
    /* Backend version:
    setIsLoading(true);
    try {
      const response = await fetch(`/api/devices/${id}/sim`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSim })
      });
      const updatedDevice = await response.json();
      setDevices(prev => 
        prev.map(device => device.id === id ? updatedDevice : device)
      );
      return updatedDevice;
    } catch (err) {
      setError("Failed to update SIM card");
    } finally {
      setIsLoading(false);
    }
    */

    // Local version
    setDevices(
      devices.map((device) => {
        if (device.id !== id) return device;

        const historyEntry = {
          oldSim: device.simCard,
          newSim,
          changedAt: new Date().toISOString(),
        };

        return {
          ...device,
          simCard: newSim,
          history: [...device.history, historyEntry],
        };
      })
    );
  };

  const deleteDevice = (id) => {
    /* Backend version:
    setIsLoading(true);
    try {
      await fetch(`/api/devices/${id}`, { method: "DELETE" });
      setDevices(prev => prev.filter(device => device.id !== id));
    } catch (err) {
      setError("Failed to delete device");
    } finally {
      setIsLoading(false);
    }
    */

    // Local version
    setDevices(devices.filter((device) => device.id !== id));
  };

  const toggleDeviceStatus = (id) => {
    /* Backend version:
    setIsLoading(true);
    try {
      const device = getDeviceById(id);
      const newStatus = device.status === "active" ? "inactive" : "active";
      await updateDevice(id, { status: newStatus });
    } catch (err) {
      setError("Failed to toggle status");
    } finally {
      setIsLoading(false);
    }
    */

    // Local version
    setDevices(
      devices.map((device) => {
        if (device.id !== id) return device;
        const newStatus = device.status === "active" ? "inactive" : "active";
        return { ...device, status: newStatus };
      })
    );
  };

  // Get unique values for filter dropdowns
  const getUniqueStatuses = () => {
    return [...new Set(devices.map((device) => device.status))];
  };

  const getUniqueDeviceTypes = () => {
    return [...new Set(devices.map((device) => device.deviceType))];
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        filteredDevices,
        isLoading,
        error,
        getDeviceById,
        addDevice,
        updateDevice,
        updateSimCard,
        deleteDevice,
        toggleDeviceStatus,
        filterDevices,
        getUniqueStatuses,
        getUniqueDeviceTypes,
        currentFilters,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};
