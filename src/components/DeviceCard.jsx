import React, { useState, useEffect } from "react";
// Importing icons from lucide-react instead of local files to resolve compilation errors.
// import {
//   Edit as EditIcon,
//   Trash2 as TrashIcon,
//   History as ClockIcon,
//   Lock as LockClosedIcon,
//   Unlock as LockOpenIcon,
//   Cpu as ChipIcon,
// } from "lucide-react";

import Edit from "./icons/Edit";
import Trash from "./icons/Trash";
import Clock from "./icons/Clock";
import LockClosed from "./icons/LockClosed";
import LockOpen from "./icons/LockOpen";
import Chip from "./icons/Chip";

const DeviceCard = ({
  device,
  onEdit,
  onDelete,
  onHistory,
  onStatusToggle,
  onSimUpdate, // Ensure this is passed as a prop
  viewMode = "grid",
}) => {
  const status = device.status || "unknown";
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  const [showSimUpdate, setShowSimUpdate] = useState(false);
  // Initialize newSim state with the current device.simCard
  const [newSim, setNewSim] = useState(device.simCard);
  const [simError, setSimError] = useState(null);
  const [simUpdating, setSimUpdating] = useState(false); // New state variable for loading

  // Function to determine status-based Tailwind CSS classes
  const getStatusClasses = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handles the update of the SIM card number
  const handleSimUpdate = async () => {
    if (!newSim.trim()) {
      setSimError("SIM number cannot be empty");
      return;
    }

    setSimUpdating(true); // Set loading state to true
    // Call onSimUpdate with device ID and new SIM number
    const result = await onSimUpdate(device.id, newSim);
    setSimUpdating(false); // Set loading state to false

    if (result && !result.success) {
      setSimError(result.message);
    } else {
      setShowSimUpdate(false);
      setSimError(null);
    }
  };

  // Helper function to prevent event propagation for button clicks
  const handleButtonClick = (action) => (event) => {
    event.stopPropagation();
    action();
  };

  // List view rendering
  if (viewMode === "list") {
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-4">
          <div className="text-sm font-medium text-gray-900">{device.name}</div>
          <div className="text-xs text-gray-500">ID: {device.id}</div>
          {device.deviceType && (
            <div className="text-xs text-blue-600 mt-1">
              Type: {device.deviceType}
            </div>
          )}
        </td>
        <td className="px-4 py-4">
          {showSimUpdate ? (
            <div className="mt-1">
              <div className="flex">
                <input
                  type="text"
                  value={newSim}
                  onChange={(e) => setNewSim(e.target.value)}
                  className={`flex-1 border ${
                    simError ? "border-red-300" : "border-gray-300"
                  } rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter new SIM number"
                />
                <button
                  onClick={handleSimUpdate}
                  disabled={simUpdating}
                  className={`bg-blue-600 text-white px-4 rounded-r-lg ${
                    simUpdating ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {simUpdating ? "Saving..." : "Save"}
                </button>
              </div>
              {simError && (
                <p className="text-red-500 text-xs mt-1">{simError}</p>
              )}
              <button
                onClick={() => {
                  setShowSimUpdate(false);
                  setSimError(null);
                  setNewSim(device.simCard); // Reset to original SIM
                }}
                className="text-gray-600 hover:text-gray-800 text-xs mt-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between group">
              <span className="text-sm font-medium text-gray-900 font-mono">
                {device.simCard}
              </span>
              <button
                onClick={() => setShowSimUpdate(true)}
                className="text-blue-600 hover:text-blue-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                title="Change SIM"
              >
                <Edit size={12} />
              </button>
            </div>
          )}
          {device.history.length > 0 && (
            <div className="text-xs text-blue-600 flex items-center mt-1">
              <Clock size={12} className="mr-1" />
              {device.history.length} change
              {device.history.length > 1 ? "s" : ""}
            </div>
          )}
        </td>
        <td className="px-4 py-4">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses()}`}
          >
            {statusText}
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
              onClick={handleButtonClick(onEdit)}
              className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50 transition-colors"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleButtonClick(onDelete)}
              className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash size={16} />
            </button>
            <button
              onClick={handleButtonClick(onHistory)}
              className="text-green-600 hover:text-green-800 p-1.5 rounded-full hover:bg-green-50 transition-colors"
              title="History"
            >
              <Clock size={16} />
            </button>
            <button
              onClick={handleButtonClick(() => onStatusToggle(device.id))}
              className={`p-1.5 rounded-full transition-colors ${
                device.status === "active"
                  ? "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                  : "text-green-600 hover:text-green-800 hover:bg-green-50"
              }`}
              title={device.status === "active" ? "Deactivate" : "Activate"}
            >
              {device.status === "active" ? (
                <LockClosed size={16} />
              ) : (
                <LockOpen size={16} />
              )}
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
        status === "active"
          ? "border-green-500"
          : status === "warning"
          ? "border-yellow-500"
          : "border-red-500"
      } hover:shadow-lg transition-all flex flex-col`}
    >
      {/* Status warning banner for inactive devices */}
      {device.status === "inactive" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center">
          <LockClosed size={20} className="text-red-500 mr-2" />
          <span className="text-red-700 font-medium text-sm">
            This device is deactivated and not in use
          </span>
        </div>
      )}

      {/* Device Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-gray-100 text-gray-600`}
          >
            <Chip size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 truncate max-w-[150px] sm:max-w-[200px]">
              {device.name}
            </h3>
            <p className="text-sm text-gray-500 font-medium">ID: {device.id}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses()}`}
        >
          {statusText}
        </span>
      </div>

      {/* Device Information Section */}
      <div className="mt-4 border-t border-dashed pt-4 flex-1 flex flex-col justify-between">
        {/* Two-column layout for device info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600 font-medium flex items-center mb-2">
              <Chip size={16} className="mr-2 text-blue-500" />
              SIM Card
            </p>
            {showSimUpdate ? (
              <div className="mt-1">
                <div className="flex">
                  <input
                    type="text"
                    value={newSim}
                    onChange={(e) => setNewSim(e.target.value)}
                    className={`flex-1 border ${
                      simError ? "border-red-300" : "border-gray-300"
                    } rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter new SIM number"
                  />
                  <button
                    onClick={handleSimUpdate}
                    disabled={simUpdating}
                    className={`bg-blue-600 text-white px-4 rounded-r-lg ${
                      simUpdating ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {simUpdating ? "Saving..." : "Save"}
                  </button>
                </div>
                {simError && (
                  <p className="text-red-500 text-xs mt-1">{simError}</p>
                )}
                <button
                  onClick={() => {
                    setShowSimUpdate(false);
                    setSimError(null);
                    setNewSim(device.simCard); // Reset to original SIM
                  }}
                  className="text-gray-600 hover:text-gray-800 text-xs mt-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <span className="font-mono text-gray-800 font-bold truncate">
                  {device.simCard}
                </span>
                <button
                  onClick={() => setShowSimUpdate(true)}
                  className="text-blue-600 hover:text-blue-800 text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                  title="Change SIM"
                >
                  <Edit size={12} />
                </button>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-600 font-medium flex items-center mb-2">
              <Clock size={16} className="mr-2 text-gray-500" />
              Added
            </p>
            <p className="font-medium text-gray-800">
              {new Date(device.dateAdded).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {device.deviceType && (
            <>
              <div>
                <p className="text-sm text-gray-600 font-medium flex items-center mb-2">
                  <Chip size={16} className="mr-2 text-purple-500" />
                  Type
                </p>
                <p className="font-medium text-gray-800">{device.deviceType}</p>
              </div>
            </>
          )}

          <div>
            <p className="text-sm text-gray-600 font-medium flex items-center mb-2">
              <Chip size={16} className="mr-2 text-green-500" />
              Status
            </p>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses()}`}
            >
              {statusText}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleButtonClick(onEdit)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-full transition-colors shadow-sm"
              title="Edit Device"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleButtonClick(() => onStatusToggle(device.id))}
              className={`${
                device.status === "active"
                  ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-600"
                  : "bg-green-50 hover:bg-green-100 text-green-600"
              } p-2 rounded-full transition-colors shadow-sm`}
              title={device.status === "active" ? "Deactivate" : "Activate"}
            >
              {device.status === "active" ? (
                <LockClosed size={16} />
              ) : (
                <LockOpen size={16} />
              )}
            </button>
            <button
              onClick={handleButtonClick(onDelete)}
              className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-full transition-colors shadow-sm"
              title="Delete Device"
            >
              <Trash size={16} />
            </button>
            <button
              onClick={handleButtonClick(onHistory)}
              className="bg-purple-50 hover:bg-purple-100 text-purple-600 p-2 rounded-full transition-colors shadow-sm"
              title="View History"
            >
              <Clock size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
