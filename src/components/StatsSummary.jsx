import React from "react";
import ActivityIcon from "./icons/Activity";
import WifiOffIcon from "./icons/WifiOff";
import AlertTriangleIcon from "./icons/AlertTriangle";
import DatabaseIcon from "./icons/Database";

const StatsSummary = ({
  activeDevices,
  inactiveDevices,
  warningDevices,
  totalDevices,
  onStatClick,
}) => {
  const stats = [
    {
      title: "Active Devices",
      value: activeDevices,
      icon: <ActivityIcon className="text-green-600" size={24} />,
      color: "green",
      percent: totalDevices > 0 ? (activeDevices / totalDevices) * 100 : 0,
      filterType: "active",
    },
    {
      title: "Inactive Devices",
      value: inactiveDevices,
      icon: <WifiOffIcon className="text-red-600" size={24} />,
      color: "red",
      percent: totalDevices > 0 ? (inactiveDevices / totalDevices) * 100 : 0,
      filterType: "inactive",
    },
    {
      title: "Warning Devices",
      value: warningDevices,
      icon: <AlertTriangleIcon className="text-yellow-600" size={24} />,
      color: "yellow",
      percent: totalDevices > 0 ? (warningDevices / totalDevices) * 100 : 0,
      filterType: "warning",
    },
    {
      title: "Total Devices",
      value: totalDevices,
      icon: <DatabaseIcon className="text-blue-600" size={24} />,
      color: "blue",
      percent: 100,
      filterType: "all",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          onClick={() => onStatClick(stat.filterType)}
          className={`bg-white hover:bg-${stat.color}-50 hover:-translate-y-0.5 duration-150 rounded-xl shadow-sm p-5 transition-all hover:shadow-md cursor-pointer group border border-gray-100 hover:border-blue-200`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-sm text-${stat.color}-500 mb-1`}>
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div
              className={`bg-${stat.color}-100 p-3 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              {stat.icon}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>0%</span>
              <span>{Math.round(stat.percent)}%</span>
              <span>100%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-${stat.color}-500 rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${stat.percent}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-3 text-right">
            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
              Click to view
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSummary;
