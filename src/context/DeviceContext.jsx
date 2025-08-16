import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";

const DeviceContext = createContext();

// Fallback to localhost in development
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Sample data for development fallback
const getSampleDevices = () => [
  {
    id: 1,
    name: "Sample Device 1",
    simCard: "123456",
    deviceType: "Camera",
    dateAdded: new Date().toISOString(),
    status: "active",
    history: [],
  },
  {
    id: 2,
    name: "Sample Device 2",
    simCard: "789012",
    deviceType: "Tablet",
    dateAdded: new Date().toISOString(),
    status: "inactive",
    history: [],
  },
];

// Helper: Build simTransfers from devices
const getSimTransfersFromDevices = (devices) => {
  const transfers = [];

  devices.forEach((device) => {
    // Initial assignment
    transfers.push({
      sim: device.simCard,
      fromDevice: null,
      toDevice: { id: device.id, name: device.name },
      timestamp: device.dateAdded,
    });

    // History
    device.history.forEach((historyItem) => {
      transfers.push({
        sim: historyItem.oldSim,
        fromDevice: { id: device.id, name: device.name },
        toDevice: null,
        timestamp: historyItem.changedAt,
      });

      transfers.push({
        sim: historyItem.newSim,
        fromDevice: null,
        toDevice: { id: device.id, name: device.name },
        timestamp: historyItem.changedAt,
      });
    });
  });

  return transfers;
};

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

  // Compute transfers directly from devices using useMemo
  const simTransfers = useMemo(() => {
    return getSimTransfersFromDevices(devices);
  }, [devices]);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/devices`);
      setDevices(response.data);
      setFilteredDevices(response.data);
    } catch (err) {
      setError("Failed to load data from server");
      console.error("API Error:", err);

      // Use sample data only in development
      if (import.meta.env.DEV) {
        setDevices(getSampleDevices());
        setFilteredDevices(getSampleDevices());
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

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

  const updateSimCard = async (id, newSim) => {
    const device = devices.find((d) => d.id === id);
    if (!device) return { success: false, message: "Device not found" };

    const newSimTrimmed = newSim.trim();

    // Check if SIM is already used by another device
    const simInUse = devices.some(
      (d) => d.id !== id && d.simCard === newSimTrimmed
    );

    if (simInUse) {
      const conflictingDevice = devices.find(
        (d) => d.id !== id && d.simCard === newSimTrimmed
      );

      return {
        success: false,
        message: `SIM is already used by ${
          conflictingDevice?.name || "another device"
        }`,
      };
    }

    const now = new Date().toISOString();
    const oldSim = device.simCard;

    const historyEntry = {
      oldSim,
      newSim: newSimTrimmed,
      changedAt: now,
    };

    try {
      const response = await axios.put(`${API_URL}/devices/${id}`, {
        ...device,
        simCard: newSimTrimmed,
        history: [...device.history, historyEntry],
      });
      setDevices(devices.map((d) => (d.id === id ? response.data : d)));
      return { success: true };
    } catch (err) {
      console.error("API update failed:", err);
      return {
        success: false,
        message: "API update failed",
        details: err.response?.data || err.message,
      };
    }
  };

  const addDevice = async (device) => {
    const now = new Date().toISOString();
    const newDevice = {
      ...device,
      dateAdded: now,
      status: "active",
      history: [],
    };

    try {
      const response = await axios.post(`${API_URL}/devices`, newDevice);
      setDevices([...devices, response.data]);
      return response.data;
    } catch (err) {
      console.error("Add device error:", err);

      // Fallback to local state only in development
      if (import.meta.env.DEV) {
        const localNewDevice = { ...newDevice, id: Date.now() };
        setDevices([...devices, localNewDevice]);
        return localNewDevice;
      }

      throw err;
    }
  };

  const deleteDevice = async (id) => {
    try {
      await axios.delete(`${API_URL}/devices/${id}`);
      setDevices(devices.filter((device) => device.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      throw err;
    }
  };

  const toggleDeviceStatus = async (id) => {
    const device = devices.find((d) => d.id === id);
    if (!device) return;

    const newStatus = device.status === "active" ? "inactive" : "active";

    try {
      const response = await axios.patch(`${API_URL}/devices/${id}`, {
        status: newStatus,
      });
      setDevices(devices.map((d) => (d.id === id ? response.data : d)));
    } catch (err) {
      console.error("Status toggle error:", err);
      throw err;
    }
  };

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
        updateSimCard,
        deleteDevice,
        toggleDeviceStatus,
        filterDevices,
        getUniqueStatuses,
        getUniqueDeviceTypes,
        currentFilters,
        simTransfers,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};
