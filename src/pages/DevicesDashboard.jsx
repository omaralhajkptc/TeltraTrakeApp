// src/pages/DevicesDashboard.jsx
import React, { useState, useEffect } from "react";
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

  // NEW: Handle stat clicks to apply filters
  const handleStatClick = (filterType) => {
    setStatusFilter(filterType);
    setIsFiltersOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-lg z-10">
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-xl font-bold flex items-center">
            <ChartIcon className="mr-2 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Device Manager Pro
            </span>
          </h1>
        </div>

        <nav className="flex-1 mt-5 px-3">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-3 mb-2">
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-lg mr-3">
                <ChartIcon size={18} className="text-blue-500" />
              </div>
              <span className="font-medium text-white">Dashboard</span>
            </div>
          </div>

          <div className="rounded-lg p-3 mb-2 text-gray-300 hover:text-white transition-colors hover:bg-gray-700">
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3">
                <SettingsIcon size={18} />
              </div>
              <span>Device Settings</span>
            </div>
          </div>

          <div className="rounded-lg p-3 mb-2 text-gray-300 hover:text-white transition-colors hover:bg-gray-700">
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3">
                <BellIcon size={18} />
              </div>
              <span>Notifications</span>
            </div>
          </div>

          <div className="rounded-lg p-3 text-gray-300 hover:text-white transition-colors hover:bg-gray-700">
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3">
                <UserIcon size={18} />
              </div>
              <span>Account Settings</span>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 w-10 h-10 rounded-full flex items-center justify-center border border-white border-opacity-30">
              <UserIcon size={18} className="text-white" />
            </div>
            <div className="ml-3">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-gray-300">admin@devicemanager.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b flex items-center justify-between p-4 shadow-sm">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Device Management
            </h2>
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

            <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
              <BellIcon size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform translate-x-1 -translate-y-1"></span>
            </button>

            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-medium">
              AU
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
            onStatClick={handleStatClick} // NEW: Pass click handler
          />

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setEditData(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center transition-all shadow-md hover:shadow-lg"
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
                    className={`px-3 py-1.5 rounded-md flex items-center ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <GridIcon className="mr-1.5" size={16} />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 rounded-md flex items-center ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
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
                  className={`flex items-center border border-gray-300 px-3 py-2 rounded-lg transition-colors ${
                    isFiltersOpen
                      ? "bg-blue-100 text-blue-700 border-blue-400"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FilterIcon className="mr-1.5" size={16} />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Filters Dropdown */}
          {isFiltersOpen && (
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                  <FilterIcon className="mr-2 text-gray-500" size={14} />
                  Status Filter
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["all", "active", "inactive", "warning"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === status
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status === "all"
                        ? "All"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                  <SortIcon className="mr-2 text-gray-500" size={14} />
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Device Name</option>
                </select>
              </div>
            </div>
          )}

          {/* Devices Grid/List */}
          {viewMode === "grid" ? (
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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

          {filteredDevices.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-2xl mx-auto">
              <div className="mx-auto bg-gradient-to-br from-blue-50 to-cyan-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <PlusIcon size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                No devices found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your search or filter to find what you're looking
                for, or add a new device to get started
              </p>
              <button
                onClick={() => {
                  setFilter("");
                  setStatusFilter("all");
                  setEditData(null);
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Add New Device
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <DeviceForm onClose={() => setShowForm(false)} editData={editData} />
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
