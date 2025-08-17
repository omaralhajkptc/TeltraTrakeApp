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

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const getSimTransfersFromDevices = (devices) => {
  const transfers = [];

  devices.forEach((device) => {
    transfers.push({
      sim: device.simCard,
      fromDevice: null,
      toDevice: { id: device.id, name: device.name },
      timestamp: device.dateAdded,
    });

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

  const simTransfers = useMemo(() => {
    return getSimTransfersFromDevices(devices);
  }, [devices]);

  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/devices`);
      setDevices(response.data);
      setFilteredDevices(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load data from server");
      console.error("API Error:", err);
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
    if (!device) throw new Error("Device not found");

    const newSimTrimmed = newSim.trim();
    const simInUse = devices.some(
      (d) => d.id !== id && d.simCard === newSimTrimmed
    );

    if (simInUse) {
      const conflictingDevice = devices.find(
        (d) => d.id !== id && d.simCard === newSimTrimmed
      );

      const error = new Error(
        `SIM is already used by ${conflictingDevice?.name || "another device"}`
      );
      error.conflictDevice = conflictingDevice;
      throw error;
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
    } catch (err) {
      console.error("API update failed:", err);
      throw new Error("Failed to update SIM");
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

    // Check for duplicate SIM
    const simInUse = devices.some(
      (d) =>
        d.simCard.trim().toLowerCase() === device.simCard.trim().toLowerCase()
    );

    if (simInUse) {
      const conflictingDevice = devices.find(
        (d) =>
          d.simCard.trim().toLowerCase() === device.simCard.trim().toLowerCase()
      );
      throw new Error(
        `SIM card is already used by device: ${conflictingDevice.name}`
      );
    }

    // Check for duplicate name on same date
    const datePart = now.split("T")[0];
    const isDuplicate = devices.some((d) => {
      const deviceDate = d.dateAdded.split("T")[0];
      return (
        d.name.toLowerCase() === device.name.toLowerCase() &&
        deviceDate === datePart
      );
    });

    if (isDuplicate) {
      throw new Error("A device with this name already exists on this date");
    }

    try {
      const response = await axios.post(`${API_URL}/devices`, newDevice);
      setDevices([...devices, response.data]);
      return response.data;
    } catch (err) {
      console.error("Add device error:", err);
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

  const updateDevice = async (id, updatedFields) => {
    try {
      const device = devices.find((d) => d.id === id);
      if (!device) throw new Error("Device not found");

      const updatedDevice = { ...device, ...updatedFields };

      // Check for duplicate name on same date
      const datePart = new Date(updatedDevice.dateAdded)
        .toISOString()
        .split("T")[0];
      const isDuplicate = devices.some((d) => {
        if (d.id === id) return false; // Skip current device
        const deviceDate = new Date(d.dateAdded).toISOString().split("T")[0];
        return (
          d.name.toLowerCase() === updatedDevice.name.toLowerCase() &&
          deviceDate === datePart
        );
      });

      if (isDuplicate) {
        throw new Error("A device with this name already exists on this date");
      }

      const response = await axios.put(
        `${API_URL}/devices/${id}`,
        updatedDevice
      );
      setDevices(devices.map((d) => (d.id === id ? response.data : d)));

      return response.data;
    } catch (err) {
      console.error("Update device error:", err);
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
        updateDevice,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};
