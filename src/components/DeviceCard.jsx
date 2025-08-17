import React, { useState, useEffect, useCallback } from "react";
import EditIcon from "./icons/Edit";
import TrashIcon from "./icons/Trash";
import ClockIcon from "./icons/Clock";
import RefreshIcon from "./icons/Refresh";
import CpuIcon from "./icons/Cpu";
import PowerIcon from "./icons/Power";
import Spinner from "./icons/Spinner";

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
  isUpdating = false,
  updateError = null,
}) => {
  const status = device?.status || "unknown";
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  const [showSimUpdate, setShowSimUpdate] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [localUpdateError, setLocalUpdateError] = useState(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [conflictDevice, setConflictDevice] = useState(null);

  useEffect(() => {
    if (updateError) {
      setLocalUpdateError(updateError.message || "Failed to update SIM");
      if (updateError.conflictDevice) {
        setConflictDevice(updateError.conflictDevice);
      } else {
        setConflictDevice(null);
      }
    } else if (newSim) {
      setLocalUpdateError(null);
      setConflictDevice(null);
    }
  }, [newSim, updateError]);

  const toggleSimUpdate = () => {
    setShowSimUpdate(!showSimUpdate);
    setLocalUpdateError(null);
    setConflictDevice(null);
    if (showSimUpdate) {
      onSimChange("");
    }
  };

  const handleSimUpdate = async () => {
    if (!newSim.trim()) {
      setLocalUpdateError("SIM number cannot be empty");
      setConflictDevice(null);
      return;
    }

    try {
      await onSimUpdate();
      setShowSimUpdate(false);
      setConflictDevice(null);
    } catch (error) {
      setLocalUpdateError(error.message || "Failed to update SIM");
      if (error.conflictDevice) {
        setConflictDevice(error.conflictDevice);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && newSim.trim()) {
      handleSimUpdate();
    }
  };

  const handleStatusToggle = async () => {
    setIsTogglingStatus(true);
    try {
      await onStatusToggle();
    } catch (error) {
      setLocalUpdateError(error.message || "Failed to toggle status");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const toggleExpanded = () => {
    if (viewMode === "list") {
      setExpanded(!expanded);
    }
  };

  const handleButtonClick = (handler) => (e) => {
    e.stopPropagation();
    handler?.();
  };

  const handleEdit = useCallback(() => {
    onEdit(device);
  }, [onEdit, device]);

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
      className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all relative ${
        viewMode === "list"
          ? `flex flex-row min-h-[120px] cursor-pointer ${
              expanded ? "min-h-[280px]" : ""
            }`
          : "h-full flex flex-col"
      } ${isUpdating ? "opacity-70" : ""}`}
      onClick={toggleExpanded}
    >
      {/* Loading overlay - only for SIM update */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <Spinner size="md" />
        </div>
      )}

      {/* Status Indicator Bar */}
      <div
        className={`${statusColor.bar} ${
          viewMode === "list" ? "w-1.5 min-h-full" : "h-1.5 w-full"
        }`}
      ></div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${statusColor.bg} mt-0.5`}>
              <CpuIcon size={20} className={statusColor.icon} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-base">
                  {device?.name || "Unnamed Device"}
                </h3>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                  {device?.deviceType || "Other"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ID: {device?.id || "N/A"}
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
          >
            {statusText}
          </span>
        </div>

        {/* Info Section */}
        <div
          className={`grid grid-cols-2 gap-4 mb-4 flex-1 ${
            viewMode === "list" ? "mt-2" : ""
          }`}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <CpuIcon size={16} className="text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-500">SIM Card</p>
            </div>
            <p className="font-mono font-medium text-gray-900 text-sm truncate">
              {device?.simCard || "No SIM"}
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <ClockIcon size={16} className="text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-500">Added</p>
            </div>
            <p className="text-sm text-gray-700">
              {device?.dateAdded
                ? new Date(device.dateAdded).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Unknown"}
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <RefreshIcon size={16} className="text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-500">Changes</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full w-fit">
              {device?.history?.length || 0}{" "}
              {device?.history?.length === 1 ? "change" : "changes"}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <PowerIcon size={16} className="text-gray-500 flex-shrink-0" />
              <p className="text-xs text-gray-500">Status</p>
            </div>
            <p className="text-sm font-medium text-gray-900">{statusText}</p>
          </div>
        </div>

        {/* Expanded Details Section (List View Only) */}
        {viewMode === "list" && expanded && (
          <div className="border-t border-gray-100 pt-3 mb-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Device Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 mb-1">Manufacturer</p>
                <p className="text-sm text-gray-900">
                  {device?.manufacturer || "Unknown"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 mb-1">Firmware Version</p>
                <p className="text-sm text-gray-900">
                  {device?.firmware || "Unknown"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 mb-1">Last Connection</p>
                <p className="text-sm text-gray-900">
                  {device?.lastConnection
                    ? new Date(device.lastConnection).toLocaleString()
                    : "Never"}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-gray-500 mb-1">Signal Strength</p>
                <p className="text-sm text-gray-900">
                  {device?.signalStrength || "Unknown"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-900">
                  {device?.description || "No description available"}
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
                  onChange={(e) => {
                    onSimChange(e.target.value);
                    setLocalUpdateError(null);
                    setConflictDevice(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter new SIM number"
                  className="px-3 py-2 text-sm w-full focus:outline-none text-gray-900"
                  disabled={isUpdating}
                />
                <button
                  onClick={handleSimUpdate}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm flex items-center transition-colors ${
                    !newSim.trim() || isUpdating
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={!newSim.trim() || isUpdating}
                >
                  {isUpdating ? <Spinner size="sm" /> : "Update"}
                </button>
              </div>
              {localUpdateError && (
                <div className="text-xs text-red-500 px-1">
                  {localUpdateError}
                  {/* {conflictDevice && (
                    <div className="mt-1">
                      <span className="font-semibold">Used in device:</span>{" "}
                      {conflictDevice.name} (ID: {conflictDevice.id})
                    </div>
                  )} */}
                </div>
              )}
              <p className="text-xs text-gray-500 text-center">
                Press Enter or click Update to save changes
              </p>
            </div>
          ) : (
            <>
              <button
                onClick={handleButtonClick(toggleSimUpdate)}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  showSimUpdate
                    ? "bg-gray-100 text-gray-600"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                }`}
                disabled={isUpdating}
              >
                <RefreshIcon size={16} />
                {showSimUpdate ? "Cancel Update" : "Update SIM Card"}
              </button>

              {showSimUpdate && (
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <input
                      type="text"
                      value={newSim}
                      onChange={(e) => {
                        onSimChange(e.target.value);
                        setLocalUpdateError(null);
                        setConflictDevice(null);
                      }}
                      onKeyDown={handleKeyDown}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Enter new SIM number"
                      className="px-3 py-2 text-sm w-full focus:outline-none text-gray-900"
                      disabled={isUpdating}
                    />
                    <button
                      onClick={handleButtonClick(handleSimUpdate)}
                      className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm flex items-center transition-colors ${
                        !newSim.trim() || isUpdating
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={!newSim.trim() || isUpdating}
                    >
                      {isUpdating ? <Spinner size="sm" /> : "Update"}
                    </button>
                  </div>
                  {localUpdateError && (
                    <div className="text-xs text-red-500 px-1">
                      {localUpdateError}
                      {conflictDevice && (
                        <div className="mt-1">
                          <span className="font-semibold">Used in device:</span>{" "}
                          {conflictDevice.name} (ID: {conflictDevice.id})
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Press Enter or click Update to save changes
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className="flex justify-between border-t border-gray-100 pt-3 mt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-1">
            <button
              onClick={handleButtonClick(handleEdit)}
              className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-600"
              title="Edit"
              disabled={isUpdating || isTogglingStatus}
            >
              <EditIcon size={18} />
            </button>
            <button
              onClick={handleButtonClick(onHistory)}
              className="p-2 rounded-lg hover:bg-green-50 transition-colors text-green-600"
              title="History"
              disabled={isUpdating || isTogglingStatus}
            >
              <ClockIcon size={18} />
            </button>
            <button
              onClick={handleButtonClick(onDelete)}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
              title="Delete"
              disabled={isUpdating || isTogglingStatus}
            >
              <TrashIcon size={18} />
            </button>
          </div>

          <button
            onClick={handleButtonClick(handleStatusToggle)}
            className={`p-2 rounded-lg transition-colors ${
              status === "active"
                ? "text-yellow-600 hover:bg-yellow-50"
                : "text-green-600 hover:bg-green-50"
            }`}
            title={status === "active" ? "Deactivate" : "Activate"}
            disabled={isUpdating || isTogglingStatus}
          >
            {isTogglingStatus ? <Spinner size="sm" /> : <PowerIcon size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
