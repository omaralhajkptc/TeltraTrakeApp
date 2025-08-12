// src/components/DeviceForm.jsx
import React, { useState, useEffect } from "react";
import { useDeviceContext } from "../context/DeviceContext";
import {
  FiX,
  FiHardDrive,
  FiCpu,
  FiSave,
  FiType,
  FiInfo,
  FiCalendar,
  FiClock,
} from "react-icons/fi";

const DeviceForm = ({ onClose, editData }) => {
  const { addDevice, updateDevice } = useDeviceContext();
  const [formData, setFormData] = useState({
    name: "",
    simCard: "",
    deviceType: "other",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        simCard: editData.simCard,
        deviceType: editData.deviceType || "other",
      });

      if (editData.dateAdded) {
        const dateObj = new Date(editData.dateAdded);
        const dateStr = dateObj.toISOString().split("T")[0];
        const timeStr = dateObj.toTimeString().substring(0, 5);
        setCustomDate(dateStr);
        setCustomTime(timeStr);
      }
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Device name is required";
    if (!formData.simCard.trim()) newErrors.simCard = "SIM card is required";

    if (useCustomDate) {
      if (!customDate) newErrors.customDate = "Date is required";
      if (!customTime) newErrors.customTime = "Time is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      let dateAddedValue;
      if (useCustomDate && customDate && customTime) {
        dateAddedValue = new Date(`${customDate}T${customTime}`).toISOString();
      } else {
        dateAddedValue = editData
          ? editData.dateAdded
          : new Date().toISOString();
      }

      const deviceData = {
        ...formData,
        dateAdded: dateAddedValue,
      };

      if (editData) {
        await updateDevice(editData.id, deviceData);
      } else {
        await addDevice(deviceData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving device:", error);
      setErrors({ submit: "Failed to save device. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-scaleIn relative z-10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b p-4 sm:p-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiHardDrive />
            {editData ? "Edit Device" : "Add New Device"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5">
          <div className="mb-4 sm:mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiType size={16} />
              Device Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Security Camera"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <FiInfo size={14} /> {errors.name}
              </p>
            )}
          </div>

          <div className="mb-4 sm:mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiCpu size={16} />
              SIM Card Number
            </label>
            <input
              type="text"
              name="simCard"
              value={formData.simCard}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                errors.simCard ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., SIM-123456"
            />
            {errors.simCard && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <FiInfo size={14} /> {errors.simCard}
              </p>
            )}
          </div>

          <div className="mb-4 sm:mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FiHardDrive size={16} />
              Device Type
            </label>
            <select
              name="deviceType"
              value={formData.deviceType}
              onChange={handleChange}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              <option value="camera">Camera</option>
              <option value="sensor">Sensor</option>
              <option value="tracker">Tracker</option>
              <option value="meter">Meter</option>
              <option value="terminal">Terminal</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Custom Date/Time */}
          <div className="mb-4 sm:mb-5">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={useCustomDate}
                onChange={() => setUseCustomDate(!useCustomDate)}
                className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Set custom date and time
              </span>
            </label>

            {useCustomDate && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiCalendar size={14} />
                    Date
                  </label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                      errors.customDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.customDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiInfo size={14} /> {errors.customDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiClock size={14} />
                    Time
                  </label>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                      errors.customTime ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.customTime && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiInfo size={14} /> {errors.customTime}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-start gap-2">
              <FiInfo className="text-red-600 mt-0.5" size={16} />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 sm:px-5 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-white flex items-center transition-colors font-medium text-sm sm:text-base ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <FiSave className="mr-1 sm:mr-2" />
              {editData ? "Update" : "Add"}
              {isSubmitting && (
                <span className="ml-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceForm;
