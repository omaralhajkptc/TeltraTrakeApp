import React, { useState, useEffect } from "react";
import { useDeviceContext } from "../context/DeviceContext";
import { FiX, FiHardDrive, FiCpu, FiSave } from "react-icons/fi";

const DeviceForm = ({ onClose, editData }) => {
  const { addDevice, updateDevice } = useDeviceContext();
  const [formData, setFormData] = useState({
    name: "",
    simCard: "",
    deviceType: "other",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        simCard: editData.simCard,
        deviceType: editData.deviceType || "other",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Device name is required";
    if (!formData.simCard.trim()) newErrors.simCard = "SIM card is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const deviceData = {
      ...formData,
      dateAdded: editData ? editData.dateAdded : new Date().toISOString(),
    };

    if (editData) {
      updateDevice(editData.id, deviceData);
    } else {
      addDevice(deviceData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-5">
          <h2 className="text-xl font-bold text-gray-800">
            {editData ? "Edit Device" : "Add New Device"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiHardDrive className="mr-2" />
              Device Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Security Camera - Front Door"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiCpu className="mr-2" />
              SIM Card Number
            </label>
            <input
              type="text"
              name="simCard"
              value={formData.simCard}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                errors.simCard ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., SIM-123456"
            />
            {errors.simCard && (
              <p className="mt-1 text-sm text-red-600">{errors.simCard}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Device Type
            </label>
            <select
              name="deviceType"
              value={formData.deviceType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="camera">Camera</option>
              <option value="sensor">Sensor</option>
              <option value="tracker">Tracker</option>
              <option value="meter">Meter</option>
              <option value="terminal">Terminal</option>
              <option value="other">Other</option>
            </select>
          </div>

          {!editData && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                This device will be created with today's date and time
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            >
              <FiSave className="mr-2" />
              {editData ? "Update Device" : "Add Device"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceForm;
