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

const API_URL = "http://localhost:3001";

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
      setDevices(getSampleDevices());
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
      return {
        success: false,
        message: "SIM number is already in use by another device",
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
      return { success: false, message: "API update failed" };
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
      // Fallback to local state if API fails, useful for testing
      const localNewDevice = { ...newDevice, id: Date.now() };
      setDevices([...devices, localNewDevice]);
      return localNewDevice;
    }
  };

  const deleteDevice = async (id) => {
    try {
      await axios.delete(`${API_URL}/devices/${id}`);
      setDevices(devices.filter((device) => device.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
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
