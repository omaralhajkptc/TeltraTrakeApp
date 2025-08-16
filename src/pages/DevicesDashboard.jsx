// src/pages/DevicesDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useDeviceContext } from "../context/DeviceContext";
import { useDeviceTypeContext } from "../context/DeviceTypeContext";
import DeviceForm from "../components/DeviceForm";
import DeviceHistoryModal from "../components/DeviceHistoryModal";
import DeviceCard from "../components/DeviceCard";
import StatsSummary from "../components/StatsSummary";
import DeviceTypeForm from "../components/DeviceTypeForm"; // New component
// Removed: import SimTransferHistory from "../components/SimTransferHistory"; // Moved to its own page

import PlusIcon from "../components/icons/Plus";
import SearchIcon from "../components/icons/Search";
import RefreshIcon from "../components/icons/Refresh";
import ChartIcon from "../components/icons/Chart";
import SettingsIcon from "../components/icons/Settings";
import BellIcon from "../components/icons/Bell";
import UserIcon from "../components/icons/User";
import EditIcon from "../components/icons/Edit";
import TrashIcon from "../components/icons/Trash";
import ClockIcon from "../components/icons/Clock";
import GridIcon from "../components/icons/Grid";
import ListIcon from "../components/icons/List";
import FilterIcon from "../components/icons/Filter";
import SortIcon from "../components/icons/Sort";
import LockClosedIcon from "../components/icons/LockClosed";
import LockOpenIcon from "../components/icons/LockOpen";
import ChevronLeftIcon from "../components/icons/ChevronLeft";
import DashboardIcon from "../components/icons/Dashboard";
import CloseIcon from "../components/icons/Close";
import CalendarIcon from "../components/icons/Calendar";
import ChipIcon from "../components/icons/Chip";
// Removed: import Sidebar from "../components/Sidebar"; // Sidebar is now in App.jsx

const DevicesDashboard = ({ sidebarOpen, setSidebarOpen }) => {
  // Accept sidebarOpen and setSidebarOpen as props
  const {
    devices,
    deleteDevice,
    updateSimCard,
    toggleDeviceStatus,
    refreshDevices,
    isLoading,
    // Removed simTransfers as it's no longer directly used here
  } = useDeviceContext();

  const {
    deviceTypes,
    addDeviceType,
    removeDeviceType,
    isLoading: isTypesLoading,
  } = useDeviceTypeContext();

  const [showForm, setShowForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false); // New state for device type form
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newSim, setNewSim] = useState({});
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const filtersRef = useRef(null);
  const formRef = useRef(null);

  const activeFilters =
    (statusFilter !== "all" ? 1 : 0) +
    (filter ? 1 : 0) +
    (dateRange.start || dateRange.end ? 1 : 0) +
    selectedTypes.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showForm &&
        formRef.current &&
        !formRef.current.contains(event.target)
      ) {
        setShowForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  const filteredDevices = devices
    .filter(
      (device) =>
        device.name.toLowerCase().includes(filter.toLowerCase()) ||
        device.simCard.toLowerCase().includes(filter.toLowerCase())
    )
    .filter(
      (device) => statusFilter === "all" || device.status === statusFilter
    )
    .filter((device) => {
      if (!dateRange.start && !dateRange.end) return true;
      const deviceDate = new Date(device.dateAdded);
      const startDate = dateRange.start
        ? new Date(dateRange.start)
        : new Date(0);
      const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
      endDate.setHours(23, 59, 59, 999);
      return deviceDate >= startDate && deviceDate <= endDate;
    })
    .filter((device) => {
      if (selectedTypes.length === 0) return true;
      return selectedTypes.includes(device.deviceType);
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      } else if (sortBy === "oldest") {
        return new Date(a.dateAdded) - new Date(b.dateAdded);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const activeDevices = devices.filter((d) => d.status === "active").length;
  const inactiveDevices = devices.filter((d) => d.status === "inactive").length;
  const warningDevices = devices.filter((d) => d.status === "warning").length;
  const devicesWithHistory = devices.filter((d) => d.history.length > 0).length;

  const handleSimChange = async (deviceId) => {
    const simValue = newSim[deviceId]?.trim();
    if (simValue) {
      const result = await updateSimCard(deviceId, simValue); // Await the result
      setNewSim((prev) => {
        const updated = { ...prev };
        delete updated[deviceId];
        return updated;
      });
      return result; // Return the result from updateSimCard
    }
    return { success: false, message: "SIM value cannot be empty." }; // Handle empty SIM
  };

  const handleRefresh = () => {
    refreshDevices();
  };

  const handleStatClick = (filterType) => {
    setStatusFilter(filterType);
  };

  const toggleDeviceType = (typeName) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName)
        ? prev.filter((t) => t !== typeName)
        : [...prev, typeName]
    );
  };

  const resetFilters = () => {
    setFilter("");
    setStatusFilter("all");
    setSortBy("newest");
    setDateRange({ start: "", end: "" });
    setSelectedTypes([]);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    // Removed the outer flex container, as it's now in App.jsx
    <div className="flex-1 flex flex-col overflow-hidden">
      {" "}
      {/* This div now represents the main content area */}
      {/* Removed Mobile sidebar toggle, as it's now in App.jsx */}
      {/* Removed Sidebar component, as it's now in App.jsx */}
      {/* Top Bar */}
      <div className="bg-white border-b flex items-center justify-between p-4 shadow-sm">
        <div className="flex items-center">
          {/* REMOVED: Mobile sidebar toggle button */}
          {!sidebarOpen && (
            <h2 className="text-xl font-bold text-gray-800 hidden md:block">
              Device Management
            </h2>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40 sm:w-64 bg-gray-50 transition-colors"
            />
          </div>

          <div className="flex space-x-3">
            <button className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <BellIcon size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          <div className="flex items-center">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-medium">
              AU
            </div>
            <span className="ml-2 text-sm font-medium hidden md:block">
              Admin
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100">
        <StatsSummary
          activeDevices={activeDevices}
          inactiveDevices={inactiveDevices}
          warningDevices={warningDevices}
          totalDevices={devices.length}
          onStatClick={handleStatClick}
        />

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-5">
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setEditData(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-all shadow-md hover:shadow-lg active:scale-[0.98] text-sm sm:text-base"
              >
                <PlusIcon className="mr-2" size={18} />
                Add Device
              </button>
              {/* Add Device Type Button */}
              <button
                onClick={() => setShowTypeForm(true)}
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-all shadow-md hover:shadow-lg active:scale-[0.98] text-sm sm:text-base"
                disabled={isTypesLoading}
              >
                {isTypesLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <PlusIcon className="mr-2" size={18} />
                )}
                Add Device Type
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="flex items-center">
              <label className="text-sm text-gray-600 mr-2 hidden sm:block">
                View:
              </label>
              <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md flex items-center transition-colors text-xs sm:text-sm ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <GridIcon className="mr-1 sm:mr-1.5" size={16} />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md flex items-center transition-colors text-xs sm:text-sm ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <ListIcon className="mr-1 sm:mr-1.5" size={16} /> List
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center border px-3 py-2 rounded-lg transition-colors relative text-sm ${
                  isFiltersOpen
                    ? "bg-blue-100 text-blue-700 border-blue-400"
                    : activeFilters > 0
                    ? "bg-blue-50 text-blue-700 border-blue-300"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FilterIcon className="mr-1 sm:mr-1.5" size={16} /> Filters
                {activeFilters > 0 && (
                  <span className="ml-1 sm:ml-2 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilters}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {isFiltersOpen && (
          <div
            ref={filtersRef}
            className="bg-white rounded-xl shadow-lg p-4 sm:p-5 mb-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Filter Devices
              </h3>
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close filters"
              >
                <CloseIcon size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <FilterIcon className="mr-2 text-blue-600" size={16} />
                  Status & Type
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1.5">
                      Device Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["all", "active", "inactive", "warning"].map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              statusFilter === status
                                ? status === "active"
                                  ? "bg-green-100 text-green-800 border border-green-300"
                                  : status === "inactive"
                                  ? "bg-red-100 text-red-800 border border-red-300"
                                  : status === "warning"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                  : "bg-blue-100 text-blue-800 border border-blue-300"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                            }`}
                          >
                            {status === "all"
                              ? "All"
                              : status.charAt(0).toUpperCase() +
                                status.slice(1)}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1.5">
                      Device Type
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {deviceTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => toggleDeviceType(type.name)}
                          className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-full transition-colors ${
                            selectedTypes.includes(type.name)
                              ? "bg-blue-100 text-blue-700 border border-blue-300"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                          }`}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <CalendarIcon className="mr-2 text-blue-600" size={16} />
                  Date & Sorting
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1.5">
                      Date Added
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-gray-600">From:</span>
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) =>
                            setDateRange({
                              ...dateRange,
                              start: e.target.value,
                            })
                          }
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-sm text-gray-600">To:</span>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) =>
                            setDateRange({
                              ...dateRange,
                              end: e.target.value,
                            })
                          }
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1.5">
                      Sort By
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "newest", label: "Newest" },
                        { value: "oldest", label: "Oldest" },
                        { value: "name", label: "Name" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            sortBy === option.value
                              ? "bg-blue-100 text-blue-800 border border-blue-300"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-6 pt-4 border-t border-gray-200 gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Active Filters Bar */}
        {(statusFilter !== "all" ||
          filter ||
          dateRange.start ||
          dateRange.end ||
          selectedTypes.length > 0) && (
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filters:</span>

            {statusFilter !== "all" && (
              <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center text-xs">
                Status:{" "}
                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 text-blue-900 hover:text-blue-700"
                >
                  &times;
                </button>
              </div>
            )}

            {filter && (
              <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center text-xs">
                Search: "{filter}"
                <button
                  onClick={() => setFilter("")}
                  className="ml-1 text-blue-900 hover:text-blue-700"
                >
                  &times;
                </button>
              </div>
            )}

            {dateRange.start && (
              <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center text-xs">
                From: {new Date(dateRange.start).toLocaleDateString()}
                <button
                  onClick={() => setDateRange({ ...dateRange, start: "" })}
                  className="ml-1 text-blue-900 hover:text-blue-700"
                >
                  &times;
                </button>
              </div>
            )}

            {dateRange.end && (
              <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center text-xs">
                To: {new Date(dateRange.end).toLocaleDateString()}
                <button
                  onClick={() => setDateRange({ ...dateRange, end: "" })}
                  className="ml-1 text-blue-900 hover:text-blue-700"
                >
                  &times;
                </button>
              </div>
            )}

            {selectedTypes.map((typeName) => (
              <div
                key={typeName}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center text-xs"
              >
                Type: {typeName}
                <button
                  onClick={() => toggleDeviceType(typeName)}
                  className="ml-1 text-blue-900 hover:text-blue-700"
                >
                  &times;
                </button>
              </div>
            ))}

            <button
              onClick={resetFilters}
              className="ml-auto text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Devices Grid/List */}
        {filteredDevices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-12 text-center max-w-2xl mx-auto border border-gray-200">
            <div className="mx-auto bg-gradient-to-br from-blue-50 to-cyan-50 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center">
                <PlusIcon size={20} className="text-white" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
              No devices found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm sm:text-base">
              {filter ||
              statusFilter !== "all" ||
              dateRange.start ||
              dateRange.end ||
              selectedTypes.length > 0
                ? "No devices match your current filters. Try adjusting your search criteria."
                : "You haven't added any devices yet. Add your first device to get started."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={resetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-colors text-sm sm:text-base"
              >
                Clear Filters
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setEditData(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
              >
                Add New Device
              </button>
            </div>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onEdit={() => {
                  setEditData(device);
                  setShowForm(true);
                }}
                onDelete={() => deleteDevice(device.id)}
                onHistory={() => {
                  setSelectedDevice(device);
                  setShowHistory(true);
                }}
                onStatusToggle={() => toggleDeviceStatus(device.id)}
                newSim={newSim[device.id] || ""}
                onSimChange={(value) =>
                  setNewSim({ ...newSim, [device.id]: value })
                }
                onSimUpdate={() => handleSimChange(device.id)} // Pass device.id to handleSimChange
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SIM
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Added
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {device.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {device.id}
                        </div>
                        {device.deviceType && (
                          <div className="text-xs text-blue-600 mt-1">
                            Type: {device.deviceType}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {device.simCard}
                        </div>
                        {device.history.length > 0 && (
                          <div className="text-xs text-blue-600 flex items-center mt-1">
                            <ClockIcon size={12} className="mr-1" />
                            {device.history.length} change
                            {device.history.length > 1 ? "s" : ""}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            device.status === "active"
                              ? "bg-green-100 text-green-800"
                              : device.status === "warning"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {device.status.charAt(0).toUpperCase() +
                            device.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                        {new Date(device.dateAdded).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2 sm:space-x-3">
                          <button
                            onClick={() => {
                              setEditData(device);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => deleteDevice(device.id)}
                            className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDevice(device);
                              setShowHistory(true);
                            }}
                            className="text-green-600 hover:text-green-800 p-1.5 rounded-full hover:bg-green-50 transition-colors"
                            title="History"
                          >
                            <ClockIcon size={16} />
                          </button>
                          <button
                            onClick={() => toggleDeviceStatus(device.id)}
                            className={`p-1.5 rounded-full transition-colors ${
                              device.status === "active"
                                ? "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                                : "text-green-600 hover:text-green-800 hover:bg-green-50"
                            }`}
                            title={
                              device.status === "active"
                                ? "Deactivate"
                                : "Activate"
                            }
                          >
                            {device.status === "active" ? (
                              <LockClosedIcon size={16} />
                            ) : (
                              <LockOpenIcon size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Modals */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)]  flex items-center justify-center p-4">
          <div ref={formRef} className="w-full max-w-2xl">
            <DeviceForm
              onClose={() => setShowForm(false)}
              editData={editData}
            />
          </div>
        </div>
      )}
      {showHistory && selectedDevice && (
        <DeviceHistoryModal
          device={selectedDevice}
          onClose={() => setShowHistory(false)}
        />
      )}
      {/* Device Type Form Modal */}
      {showTypeForm && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <DeviceTypeForm
              deviceTypes={deviceTypes}
              addDeviceType={addDeviceType}
              removeDeviceType={removeDeviceType}
              onClose={() => setShowTypeForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesDashboard;
