// src/components/StatsSummary.jsx
import React from "react";
import ActivityIcon from "./icons/Activity";
import WifiOffIcon from "./icons/WifiOff";
import RefreshIcon from "./icons/Refresh";
import DatabaseIcon from "./icons/Database";

const StatsSummary = ({
  activeDevices,
  inactiveDevices,
  devicesWithHistory,
  totalDevices,
  onStatClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {[
        {
          title: "Active Devices",
          value: activeDevices,
          icon: <ActivityIcon className="text-green-600" size={24} />,
          color: "green",
          percent: (activeDevices / totalDevices) * 100,
          filterType: "active",
        },
        {
          title: "Inactive Devices",
          value: inactiveDevices,
          icon: <WifiOffIcon className="text-red-600" size={24} />,
          color: "red",
          percent: (inactiveDevices / totalDevices) * 100,
          filterType: "inactive",
        },
        {
          title: "SIM Changes",
          value: devicesWithHistory,
          icon: <RefreshIcon className="text-blue-600" size={24} />,
          color: "blue",
          percent: (devicesWithHistory / totalDevices) * 100,
          filterType: "hasHistory",
        },
        {
          title: "Total Devices",
          value: totalDevices,
          icon: <DatabaseIcon className="text-purple-600" size={24} />,
          color: "purple",
          percent: 100,
          filterType: "all",
        },
      ].map((stat, index) => (
        <div
          key={index}
          onClick={() => onStatClick(stat.filterType)}
          className="bg-white rounded-xl shadow-sm p-5 transition-transform hover:scale-[1.02] cursor-pointer hover:shadow-md"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stat.value}
              </p>
            </div>
            <div
              className={`bg-${stat.color}-100 p-3 rounded-full flex items-center justify-center`}
            >
              {stat.icon}
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-${stat.color}-500 rounded-full`}
                style={{ width: `${stat.percent}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSummary;
