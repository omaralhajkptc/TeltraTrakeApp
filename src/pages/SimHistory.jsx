import React from "react";
import SimTransferHistory from "../components/SimTransferHistory";
import { useDeviceContext } from "../context/DeviceContext";

const SimHistory = () => {
  const { simTransfers, isLoading } = useDeviceContext();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-100 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          SIM Transfer History
        </h1>
      </div>
      <SimTransferHistory transfers={simTransfers} />
    </div>
  );
};

export default SimHistory;
