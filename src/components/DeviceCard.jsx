// src/components/DeviceCard.jsx
import React, { useState } from "react";
import EditIcon from "./icons/Edit";
import TrashIcon from "./icons/Trash";
import ClockIcon from "./icons/Clock";
import RefreshIcon from "./icons/Refresh";
import CpuIcon from "./icons/Cpu";
import PowerIcon from "./icons/Power";

const DeviceCard = ({
  device,
  onEdit,
  onDelete,
  onHistory,
  onStatusToggle,
  newSim,
  onSimChange,
  onSimUpdate,
  viewMode = "grid",
}) => {
  const status = device.status || "unknown";
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  const [showSimUpdate, setShowSimUpdate] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const toggleSimUpdate = () => {
    setShowSimUpdate(!showSimUpdate);
    if (showSimUpdate) {
      onSimChange("");
    }
  };

  const handleSimUpdate = () => {
    onSimUpdate();
    setShowSimUpdate(false);
  };

  const toggleExpanded = () => {
    if (viewMode === "list") {
      setExpanded(!expanded);
    }
  };

  const handleButtonClick = (handler) => (e) => {
    e.stopPropagation();
    if (handler) handler();
  };

  const statusColors = {
    active: {
      bg: "bg-green-100",
      text: "text-green-800",
      bar: "bg-green-500",
      icon: "text-green-500",
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      bar: "bg-yellow-500",
      icon: "text-yellow-500",
    },
    inactive: {
      bg: "bg-red-100",
      text: "text-red-800",
      bar: "bg-red-500",
      icon: "text-red-500",
    },
    unknown: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      bar: "bg-gray-400",
      icon: "text-gray-500",
    },
  };

  const statusColor = statusColors[status] || statusColors.unknown;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all ${
        viewMode === "list"
          ? `flex flex-row min-h-[100px] cursor-pointer ${
              expanded ? "min-h-[260px]" : ""
            }`
          : "h-full flex flex-col"
      }`}
      onClick={toggleExpanded}
    >
      {/* Status Indicator Bar */}
      <div
        className={`${statusColor.bar} ${
          viewMode === "list" ? "w-1.5 min-h-full" : "h-1.5 w-full"
        }`}
      ></div>

      {/* Main Content */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-lg ${statusColor.bg} mt-0.5`}>
              <CpuIcon size={18} className={statusColor.icon} />
            </div>
            <div className="max-w-[60%]">
              <div className="flex items-center gap-1 sm:gap-2">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                  {device.name}
                </h3>
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                  {device.deviceType || "Other"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">
                ID: {device.id}
              </p>
            </div>
          </div>

          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
          >
            {statusText}
          </span>
        </div>

        {/* Info Section */}
        <div
          className={`grid grid-cols-2 gap-3 mb-3 sm:mb-4 flex-1 ${
            viewMode === "list" ? "mt-1 sm:mt-2" : ""
          }`}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-1">
              <CpuIcon size={14} className="text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-500">SIM Card</p>
            </div>
            <p className="font-mono font-medium text-gray-900 text-xs sm:text-sm truncate">
              {device.simCard}
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-1">
              <ClockIcon size={14} className="text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-500">Added</p>
            </div>
            <p className="text-xs sm:text-sm text-gray-700">
              {new Date(device.dateAdded).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "2-digit",
              })}
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-1">
              <RefreshIcon size={14} className="text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-500">Changes</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-1 rounded-full w-fit">
              {device.history.length}{" "}
              {device.history.length === 1 ? "change" : "changes"}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-1">
              <PowerIcon size={14} className="text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-500">Status</p>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
              {statusText}
            </p>
          </div>
        </div>

        {/* Expanded Details Section */}
        {viewMode === "list" && expanded && (
          <div className="border-t border-gray-100 pt-2 mb-2 sm:mb-3">
            <h4 className="text-sm font-medium text-gray-900 mb-1 sm:mb-2">
              Device Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 mb-1">Manufacturer</p>
                <p className="text-xs sm:text-sm text-gray-900 truncate">
                  {device.manufacturer || "Unknown"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 mb-1">Firmware</p>
                <p className="text-xs sm:text-sm text-gray-900 truncate">
                  {device.firmware || "Unknown"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 mb-1">Last Connection</p>
                <p className="text-xs sm:text-sm text-gray-900 truncate">
                  {device.lastConnection
                    ? new Date(device.lastConnection).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 mb-1">Signal</p>
                <p className="text-xs sm:text-sm text-gray-900 truncate">
                  {device.signalStrength || "Unknown"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-xs sm:text-sm text-gray-900 line-clamp-2">
                  {device.description || "No description available"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SIM Update Section */}
        <div className="mt-auto">
          {viewMode === "grid" ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={newSim}
                  onChange={(e) => onSimChange(e.target.value)}
                  placeholder="New SIM number"
                  className="px-2 py-1.5 text-xs sm:text-sm w-full focus:outline-none text-gray-900"
                />
                <button
                  onClick={handleSimUpdate}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 text-xs sm:text-sm flex items-center transition-colors ${
                    !newSim.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!newSim.trim()}
                >
                  Update
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center hidden sm:block">
                Enter new SIM and click Update
              </p>
            </div>
          ) : (
            <>
              <button
                onClick={handleButtonClick(toggleSimUpdate)}
                className={`w-full py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                  showSimUpdate
                    ? "bg-gray-100 text-gray-600"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
              >
                <RefreshIcon size={14} />
                {showSimUpdate ? "Cancel" : "Update SIM"}
              </button>

              {showSimUpdate && (
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <input
                      type="text"
                      value={newSim}
                      onChange={(e) => onSimChange(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="New SIM number"
                      className="px-2 py-1.5 text-xs sm:text-sm w-full focus:outline-none text-gray-900"
                    />
                    <button
                      onClick={handleButtonClick(handleSimUpdate)}
                      className={`bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 text-xs sm:text-sm flex items-center transition-colors ${
                        !newSim.trim() ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={!newSim.trim()}
                    >
                      Update
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Enter new SIM number</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className="flex justify-between border-t border-gray-100 pt-2 mt-2 sm:pt-3 sm:mt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-1">
            <button
              onClick={handleButtonClick(onEdit)}
              className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-blue-600"
              title="Edit"
            >
              <EditIcon size={16} />
            </button>
            <button
              onClick={handleButtonClick(onHistory)}
              className="p-1.5 rounded-lg hover:bg-green-50 transition-colors text-green-600"
              title="History"
            >
              <ClockIcon size={16} />
            </button>
            <button
              onClick={handleButtonClick(onDelete)}
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-600"
              title="Delete"
            >
              <TrashIcon size={16} />
            </button>
          </div>

          <button
            onClick={handleButtonClick(onStatusToggle)}
            className={`p-1.5 rounded-lg transition-colors ${
              status === "active"
                ? "text-yellow-600 hover:bg-yellow-50"
                : "text-green-600 hover:bg-green-50"
            }`}
            title={status === "active" ? "Deactivate" : "Activate"}
          >
            <PowerIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
