import React from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// =========== Device APIs ==========

/**
 *  Fetches all Devices from the database
 * @returns {Array} Array of device objects: [{ id, name, status, sim, dateAdded }]
 */
export const fetchAllDevices = () => {
	try {
		const data = axios.get(`${API_URL}/devices/getAll`);
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

/**
 *  Gets device details WITH its sim history
 * @param id Device ID
 * @returns {Object} { id, name, status, sim, dateAdded, history: [{ newSim, oldSim, dataChanged }] }
 */
export const getDeviceById = (id) => {
	try {
		const data = axios.get(`${API_URL}/devices/getById/id=${id}`);
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

/**
 *  Creates a new Device
 * @param {string} deviceName Name of the device
 * @param {number} deviceTypeId DeviceType ID for the device
 * @returns {Object} Created Device Object: { id, name, status, sim, dateAdded }
 */
export const createDevice = (deviceName, deviceTypeId) => {
	try {
		const data = axios.post(`${API_URL}/devices/create`, {
			name: deviceName,
			deviceTypeId: deviceTypeId,
		});
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

/**
 *  Updates device Name and DeviceType ONLY
 * @param {number} deviceId ID of the device to be edited
 * @param {string} deviceName New Name of the Device
 * @param {number} deviceTypeId DeviceType ID for the device
 * @returns {Object} Updated Device Object: { id, name, status, sim, dateAdded }
 */
export const updateDevice = (deviceId, deviceName, deviceTypeId) => {
	try {
		const data = axios.put(`${API_URL}/devices/update/id=${deviceId}`, {
			name: deviceName,
			deviceTypeId: deviceTypeId,
		});
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

/**
 *  Updates Status of a Device ONLY
 * @param {number} deviceId ID of device to update
 * @param {Boolean} status New Status for the Device
 * @returns Updated Device Object: { id, name, status, sim, dateAdded }
 */
export const updateDeviceStatus = (deviceId, status) => {
	try {
		const data = axios.put(`${API_URL}/devices/updateStatus/id=${deviceId}`, {
			status: status,
		});
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

/**
 *  Updates Device SIM ONLY
 * @param {number} deviceId ID of device to update
 * @param {string} newSim New Sim for the device
 * @returns {Object} Updated Device Details, History and Success Message: { message, history: [{ newSim, oldSim, dataChanged }], device: : { id, name, status, sim, dateAdded } }
 */
export const updateDeviceSim = (deviceId, newSim) => {
	try {
		const data = axios.put(`${API_URL}/devices/updateSim/id=${deviceId}`, {
			newSim: newSim,
		});
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

/**
 *  Deletes Device
 * @param {number} deviceId Id of device to delete
 * @returns {Object} Success Message of Device deleted: { message }
 */
export const deleteDevice = (deviceId) => {
	try {
		const data = axios.delete(`${API_URL}/devices/delete/id=${deviceId}`);
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

// =========== Device Type APIs ==========

export const fetchAllDeviceTypes = () => {
	try {
		const data = axios.get(`${API_URL}/deviceType/getAll`);
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

export const getDeviceTypeById = (deviceTypeId) => {
	try {
		const data = axios.get(`${API_URL}/deviceType/getByID/id=${deviceTypeId}`);
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

export const createDeviceType = (deviceTypeName) => {
	try {
		const data = axios.post(`${API_URL}/deviceType/create`, {
			name: deviceTypeName,
		});
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

export const updateDeviceType = (deviceTypeId, deviceTypeName) => {
	try {
		const data = axios.put(`${API_URL}/deviceType/update/id=${deviceTypeId}`, {
			name: deviceTypeName,
		});
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

export const deleteDeviceType = (deviceTypeId) => {
	try {
		const data = axios.delete(`${API_URL}/deviceType/delete/id=${deviceTypeId}`);
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};

// =========== Device Type APIs ==========

export const getSimHistory = (sim) => {
	try {
		const data = axios.get(`${API_URL}/sim/sim=${sim}`);
		return data;
	} catch (error) {
		console.error("Error: ", error.message);
	}
};
