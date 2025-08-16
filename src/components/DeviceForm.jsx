// src/components/DeviceForm.jsx
import React, { useState, useEffect } from "react";
import { useDeviceContext } from "../context/DeviceContext";
import { useDeviceTypeContext } from "../context/DeviceTypeContext";
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
  const { deviceTypes } = useDeviceTypeContext();

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
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-scaleIn relative z-10 max-h-[90vh] overflow-y-auto"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
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
            </div>

            <div>
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
                  {deviceTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center mb-4 sm:mb-5">
                <input
                  type="checkbox"
                  id="useCustomDate"
                  checked={useCustomDate}
                  onChange={(e) => setUseCustomDate(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="useCustomDate"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Set custom date and time
                </label>
              </div>

              {useCustomDate && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4 sm:mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FiCalendar size={16} />
                      Date
                    </label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
                        errors.customDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.customDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <FiInfo size={14} /> {errors.customDate}
                      </p>
                    )}
                  </div>
                  <div className="mb-4 sm:mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FiClock size={16} />
                      Time
                    </label>
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 ${
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
          </div>

          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 mt-2">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
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
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <FiSave className="mr-1 sm:mr-2" />
              )}
              {editData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceForm;
