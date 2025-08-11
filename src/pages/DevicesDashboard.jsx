// src/pages/DevicesDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useDeviceContext } from "../context/DeviceContext";
import DeviceForm from "../components/DeviceForm";
import DeviceHistoryModal from "../components/DeviceHistoryModal";
import DeviceCard from "../components/DeviceCard";
import StatsSummary from "../components/StatsSummary";
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
import MenuIcon from "../components/icons/Menu";
import ChevronLeftIcon from "../components/icons/ChevronLeft";
import DashboardIcon from "../components/icons/Dashboard";
import CloseIcon from "../components/icons/Close";
import CalendarIcon from "../components/icons/Calendar";
import ChipIcon from "../components/icons/Chip";

// Predefined device types for filtering
const DEVICE_TYPES = [
  "Smartphone",
  "Tablet",
  "Laptop",
  "Smartwatch",
  "Router",
  "Sensor",
  "Camera",
  "Other",
];

const DevicesDashboard = () => {
  const {
    devices,
    deleteDevice,
    updateSimCard,
    toggleDeviceStatus,
    refreshDevices,
  } = useDeviceContext();
  const [showForm, setShowForm] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newSim, setNewSim] = useState({});
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const filtersRef = useRef(null);
  const formRef = useRef(null); // Ref for form modal

  // Calculate active filters count
  const activeFilters =
    (statusFilter !== "all" ? 1 : 0) +
    (filter ? 1 : 0) +
    (dateRange.start || dateRange.end ? 1 : 0) +
    selectedTypes.length;

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close filters if clicked outside
      if (
        isFiltersOpen &&
        filtersRef.current &&
        !filtersRef.current.contains(event.target)
      ) {
        setIsFiltersOpen(false);
      }

      // Close form if clicked outside
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
  }, [isFiltersOpen, showForm]);

  // Filter and sort devices
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
      endDate.setHours(23, 59, 59, 999); // End of day
      return deviceDate >= startDate && deviceDate <= endDate;
    })
    .filter((device) => {
      if (selectedTypes.length === 0) return true;
      const deviceType = device.type || "Other";
      return selectedTypes.includes(deviceType);
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
  const devicesWithHistory = devices.filter((d) => d.history.length > 0).length;

  const handleSimChange = (deviceId) => {
    const simValue = newSim[deviceId]?.trim();
    if (simValue) {
      updateSimCard(deviceId, simValue);
      setNewSim((prev) => {
        const updated = { ...prev };
        delete updated[deviceId];
        return updated;
      });
    }
  };

  const handleRefresh = () => {
    refreshDevices();
  };

  const handleStatClick = (filterType) => {
    setStatusFilter(filterType);
  };

  const toggleDeviceType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const resetFilters = () => {
    setFilter("");
    setStatusFilter("all");
    setSortBy("newest");
    setDateRange({ start: "", end: "" });
    setSelectedTypes([]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Collapsible Sidebar */}
      <div
        className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-lg z-20 transition-all duration-500 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-5 border-b border-gray-700 flex items-center justify-between">
          <h1
            className={`text-xl font-bold flex items-center transition-opacity ${
              sidebarOpen ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            <ChartIcon className="mr-2 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
              Device Manager Pro
            </span>
          </h1>
        </div>

        <nav className="flex-1 mt-5 px-3">
          <div
            className={`rounded-lg p-3 mb-2 flex items-center ${
              sidebarOpen
                ? "bg-gradient-to-r from-blue-600 to-blue-500"
                : "hover:bg-gray-700"
            }`}
          >
            <div className="bg-white p-2 rounded-lg">
              <DashboardIcon size={18} className="text-blue-500" />
            </div>
            <span
              className={`font-medium ml-3 transition-opacity ${
                sidebarOpen ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              Dashboard
            </span>
          </div>

          <div className="rounded-lg p-3 mb-2 text-gray-300 hover:text-white transition-colors hover:bg-gray-700 flex items-center">
            <div className="p-2 rounded-lg">
              <SettingsIcon size={18} />
            </div>
            <span
              className={`ml-3 transition-opacity ${
                sidebarOpen ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              Device Settings
            </span>
          </div>

          <div className="rounded-lg p-3 mb-2 text-gray-300 hover:text-white transition-colors hover:bg-gray-700 flex items-center">
            <div className="p-2 rounded-lg">
              <BellIcon size={18} />
            </div>
            <span
              className={`ml-3 transition-opacity ${
                sidebarOpen ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              Notifications
            </span>
          </div>

          <div className="rounded-lg p-3 text-gray-300 hover:text-white transition-colors hover:bg-gray-700 flex items-center">
            <div className="p-2 rounded-lg">
              <UserIcon size={18} />
            </div>
            <span
              className={`ml-3 transition-opacity ${
                sidebarOpen ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              Account Settings
            </span>
          </div>
        </nav>

        <div
          className={`p-4 border-t border-gray-700 flex items-center ${
            sidebarOpen ? "" : "justify-center"
          }`}
        >
          <div className="bg-gradient-to-br from-blue-500 to-cyan-400 w-10 h-10 rounded-full flex items-center justify-center border border-white border-opacity-30">
            <UserIcon size={18} className="text-white" />
          </div>
          <div
            className={`ml-3 transition-opacity ${
              sidebarOpen ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-gray-300">admin@devicemanager.com</p>
          </div>
        </div>
      </div>

      {/* Floating Sidebar Toggle - Fixed position */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-5 z-30 p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 ${
          sidebarOpen ? "left-[15.5rem]" : "left-5"
        }`}
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <ChevronLeftIcon
          className={`text-white transition-transform ${
            !sidebarOpen && "rotate-180"
          }`}
          size={20}
        />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top Bar */}
        <div className="bg-white border-b flex items-center justify-between p-4 shadow-sm">
          <div className="flex items-center">
            {!sidebarOpen && (
              <h2 className="text-xl font-bold text-gray-800">
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
                placeholder="Search devices..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 bg-gray-50 transition-colors"
              />
            </div>

            <div className="flex space-x-3">
              {/* Refresh button Side Notification button */}
              {/* <button
                onClick={handleRefresh}
                className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors group relative"
                title="Refresh devices"
              >
                <RefreshIcon size={18} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75 group-hover:animate-none"></span>
              </button> */}
              <button className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                <BellIcon size={18} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            <div className="flex items-center">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-medium">
                AU
              </div>
              <span className="ml-2 text-sm font-medium hidden md:block">
                Admin User
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {/* Stats Summary */}
          <StatsSummary
            activeDevices={activeDevices}
            inactiveDevices={inactiveDevices}
            devicesWithHistory={devicesWithHistory}
            totalDevices={devices.length}
            onStatClick={handleStatClick}
          />

          {/* Enhanced Controls */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setEditData(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <PlusIcon className="mr-2" size={18} />
                Add New Device
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <label className="text-sm text-gray-600 mr-2">View:</label>
                <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 rounded-md flex items-center transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <GridIcon className="mr-1.5" size={16} />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 rounded-md flex items-center transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <ListIcon className="mr-1.5" size={16} />
                    List
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center border px-3 py-2 rounded-lg transition-colors relative ${
                    isFiltersOpen
                      ? "bg-blue-100 text-blue-700 border-blue-400"
                      : activeFilters > 0
                      ? "bg-blue-50 text-blue-700 border-blue-300"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FilterIcon className="mr-1.5" size={16} />
                  Filters
                  {activeFilters > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFilters}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Blue & White Filters Panel */}
          {isFiltersOpen && (
            <div
              ref={filtersRef}
              className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-200"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <div className="flex flex-wrap gap-2">
                        {DEVICE_TYPES.map((type) => (
                          <button
                            key={type}
                            onClick={() => toggleDeviceType(type)}
                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                              selectedTypes.includes(type)
                                ? "bg-blue-100 text-blue-700 border border-blue-300"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                            }`}
                          >
                            {type}
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
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            From:
                          </span>
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
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            To:
                          </span>
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

              <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <RefreshIcon size={16} className="mr-2" />
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
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Active Filters:
              </span>

              {statusFilter !== "all" && (
                <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full flex items-center text-sm">
                  Status:{" "}
                  {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-2 text-blue-900 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </div>
              )}

              {filter && (
                <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full flex items-center text-sm">
                  Search: "{filter}"
                  <button
                    onClick={() => setFilter("")}
                    className="ml-2 text-blue-900 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </div>
              )}

              {dateRange.start && (
                <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full flex items-center text-sm">
                  From: {new Date(dateRange.start).toLocaleDateString()}
                  <button
                    onClick={() => setDateRange({ ...dateRange, start: "" })}
                    className="ml-2 text-blue-900 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </div>
              )}

              {dateRange.end && (
                <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full flex items-center text-sm">
                  To: {new Date(dateRange.end).toLocaleDateString()}
                  <button
                    onClick={() => setDateRange({ ...dateRange, end: "" })}
                    className="ml-2 text-blue-900 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </div>
              )}

              {selectedTypes.map((type) => (
                <div
                  key={type}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full flex items-center text-sm"
                >
                  Type: {type}
                  <button
                    onClick={() => toggleDeviceType(type)}
                    className="ml-2 text-blue-900 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </div>
              ))}

              <button
                onClick={resetFilters}
                className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Devices Grid/List with enhanced empty state */}
          {filteredDevices.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-2xl mx-auto border border-gray-200">
              <div className="mx-auto bg-gradient-to-br from-blue-50 to-cyan-50 w-24 h-24 rounded-full flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center">
                  <PlusIcon size={32} className="text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                No devices found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {filter ||
                statusFilter !== "all" ||
                dateRange.start ||
                dateRange.end ||
                selectedTypes.length > 0
                  ? "No devices match your current filters. Try adjusting your search criteria."
                  : "You haven't added any devices yet. Add your first device to get started."}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg shadow-sm transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => {
                    resetFilters();
                    setEditData(null);
                    setShowForm(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Add New Device
                </button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  onSimUpdate={() => handleSimChange(device.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SIM Card
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Added
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDevices.map((device) => (
                      <tr key={device.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {device.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {device.id}
                          </div>
                          {device.type && (
                            <div className="text-xs text-blue-600 mt-1">
                              Type: {device.type}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
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
                        <td className="px-6 py-4">
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
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(device.dateAdded).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                setEditData(device);
                                setShowForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <EditIcon size={18} />
                            </button>
                            <button
                              onClick={() => deleteDevice(device.id)}
                              className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <TrashIcon size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDevice(device);
                                setShowHistory(true);
                              }}
                              className="text-green-600 hover:text-green-800 p-1.5 rounded-full hover:bg-green-50 transition-colors"
                              title="History"
                            >
                              <ClockIcon size={18} />
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
                                <LockClosedIcon size={18} />
                              ) : (
                                <LockOpenIcon size={18} />
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
      </div>

      {/* Modals with backdrop */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div ref={formRef}>
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
    </div>
  );
};

export default DevicesDashboard;
