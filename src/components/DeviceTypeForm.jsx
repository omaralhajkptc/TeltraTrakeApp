// src/components/DeviceTypeForm.jsx
import React, { useState } from "react";
import TrashIcon from "./icons/Trash";
import CloseIcon from "./icons/Close";

const DeviceTypeForm = ({
  deviceTypes,
  addDeviceType,
  removeDeviceType,
  onClose,
}) => {
  const [newType, setNewType] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Pass only the string to addDeviceType
      await addDeviceType(newType);
      setNewType("");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to add device type. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
        aria-label="Close"
      >
        <CloseIcon size={20} className="text-gray-500" />
      </button>

      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Manage Device Types
      </h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <label
          htmlFor="new-device-type"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Add New Device Type
        </label>
        <div className="flex items-center">
          <input
            id="new-device-type"
            type="text"
            value={newType}
            onChange={(e) => {
              setNewType(e.target.value);
              setError("");
            }}
            className={`flex-1 px-4 py-2 border rounded-l-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Push To Talk"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg transition-colors flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Add"
            )}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </form>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Existing Device Types
        </h3>
        {deviceTypes.length === 0 ? (
          <p className="text-gray-500 italic py-3 text-center">
            No device types added yet
          </p>
        ) : (
          <ul className="border rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {deviceTypes.map((type) => (
              <li
                key={type.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <span className="text-gray-800">{type.name}</span>
                {type.name !== "other" ? (
                  <button
                    onClick={() => removeDeviceType(type.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    aria-label={`Remove ${type.name}`}
                  >
                    <TrashIcon size={16} />
                  </button>
                ) : (
                  <span></span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DeviceTypeForm;
