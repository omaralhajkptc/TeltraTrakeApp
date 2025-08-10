import React from "react";
import EditIcon from "./icons/Edit";
import TrashIcon from "./icons/Trash";
import ClockIcon from "./icons/Clock";
import RefreshIcon from "./icons/Refresh";
import CpuIcon from "./icons/Cpu";

const DeviceCard = ({
  device,
  onEdit,
  onDelete,
  onHistory,
  onStatusToggle,
  newSim,
  onSimChange,
  onSimUpdate,
}) => {
  const status = device.status || "unknown";
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900">{device.name}</h3>
            <p className="text-xs text-gray-500 mt-1">ID: {device.id}</p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : status === "warning"
                ? "bg-yellow-100 text-yellow-800"
                : status === "inactive"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {statusText}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500 flex items-center">
              <CpuIcon className="mr-1" size={16} />
              SIM Card
            </p>
            <p className="font-mono font-medium text-gray-900">
              {device.simCard}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Added</p>
            <p className="text-sm text-gray-700">
              {new Date(device.dateAdded).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">SIM Changes</p>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {device.history.length}{" "}
              {device.history.length === 1 ? "change" : "changes"}
            </span>
          </div>
        </div>

        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={newSim}
            onChange={(e) => onSimChange(e.target.value)}
            placeholder="New SIM number"
            className="px-3 py-2 text-sm w-full focus:outline-none text-gray-900"
          />
          <button
            onClick={onSimUpdate}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm flex items-center transition-colors ${
              !newSim.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!newSim.trim()}
          >
            {/* <RefreshIcon className="mr-1" size={16} /> */}
            Update
          </button>
        </div>

        <div className="flex justify-between border-t border-gray-100 pt-3">
          <div className="flex space-x-1">
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              title="Edit"
            >
              <EditIcon size={18} />
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <TrashIcon size={18} />
            </button>
            <button
              onClick={onHistory}
              className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
              title="History"
            >
              <ClockIcon size={18} />
            </button>
          </div>

          <button
            onClick={onStatusToggle}
            className={`p-2 rounded-lg transition-colors ${
              status === "active"
                ? "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-800"
                : "text-green-600 hover:bg-green-50 hover:text-green-800"
            }`}
            title={status === "active" ? "Deactivate" : "Activate"}
          >
            {status === "active" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
