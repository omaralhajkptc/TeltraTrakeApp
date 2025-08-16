// src/components/DeviceHistoryModal.jsx
import React from "react";
import { FiX, FiRefreshCw, FiArrowRight, FiInfo } from "react-icons/fi";

const DeviceHistoryModal = ({ device, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scaleIn">
        <div className="flex justify-between items-center border-b p-4 sm:p-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiRefreshCw className="text-blue-600" />
            <span className="hidden sm:inline">SIM Card History - </span>
            <span className="text-blue-600 truncate max-w-[120px] ">
              {device.name}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-3 sm:p-5">
          {device.history.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {device.history.map((entry, index) => (
                <div
                  key={index}
                  className="relative pl-6 pb-6 sm:pl-8 sm:pb-8 border-l-2 border-blue-200 last:border-transparent"
                >
                  <div className="absolute left-[-7px] sm:left-[-9px] top-0 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full border-2 sm:border-4 border-white"></div>

                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                          <FiRefreshCw className="text-blue-600" size={14} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                            SIM Card Update
                          </h3>
                          <p className="text-xs text-gray-500">
                            {new Date(entry.changedAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                      <div className="w-full sm:flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">
                          Previous SIM
                        </p>
                        <div className="bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-mono text-gray-900 truncate text-xs sm:text-sm">
                          {entry.oldSim}
                        </div>
                      </div>

                      <div className="text-gray-400 flex items-center justify-center w-6 sm:w-8 py-1">
                        <FiArrowRight
                          className="transform rotate-90 sm:rotate-0"
                          size={16}
                        />
                      </div>

                      <div className="w-full sm:flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">New SIM</p>
                        <div className="bg-green-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-mono text-green-800 truncate text-xs sm:text-sm">
                          {entry.newSim}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FiRefreshCw className="h-5 w-5 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
                No SIM change history
              </h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                This device has never had its SIM card updated. All changes will
                appear here.
              </p>
            </div>
          )}
        </div>

        <div className="border-t p-4 sm:p-5 flex justify-end bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 text-sm sm:text-base"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceHistoryModal;
