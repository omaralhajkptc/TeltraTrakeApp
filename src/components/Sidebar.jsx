// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "./icons/Dashboard";
import SettingsIcon from "./icons/Settings";
import BellIcon from "./icons/Bell";
import UserIcon from "./icons/User";
import CloseIcon from "./icons/Close";
import ChartIcon from "./icons/Chart";
import ChevronLeftIcon from "./icons/ChevronLeft";
import ClockIcon from "./icons/Clock";
import MenuIcon from "./icons/Menu";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Mobile toggle button when sidebar is closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 md:hidden"
          aria-label="Open sidebar"
        >
          <MenuIcon size={20} />
        </button>
      )}

      <div
        className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-lg z-20 transition-all duration-500 fixed h-full ${
          sidebarOpen ? "w-64 left-0" : "-left-full md:left-0 md:w-20"
        }`}
      >
        <div className="p-5 border-b border-gray-700 flex items-center justify-between">
          <h1
            className={`text-xl font-bold flex items-center transition-opacity ${
              sidebarOpen ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            <ChartIcon className="mr-2 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
              Device Manager
            </span>
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white md:hidden"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-5 px-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg p-3 mb-2 flex items-center ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500"
                  : "hover:bg-gray-700"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <div className="bg-white p-2 rounded-lg">
              <DashboardIcon size={18} className="text-blue-500" />
            </div>
            <span
              className={`font-medium ml-3 transition-opacity ${
                sidebarOpen ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              Dashboard
            </span>
          </NavLink>

          <NavLink
            to="/sim-history"
            className={({ isActive }) =>
              `rounded-lg p-3 mb-2 flex items-center transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <div className="p-2 rounded-lg">
              <ClockIcon size={18} />
            </div>
            <span
              className={`ml-3 transition-opacity ${
                sidebarOpen ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              SIM History
            </span>
          </NavLink>
        </nav>

        <div
          className={`p-4 border-t border-gray-700 flex items-center ${
            sidebarOpen ? "" : "justify-center"
          }`}
        >
          <div className="bg-gradient-to-br from-blue-500 to-cyan-400 w-10 h-10 rounded-full flex items-center justify-center border border-white border-opacity-30">
            <UserIcon size={18} className="text-white" />
          </div>
          <div
            className={`ml-3 transition-opacity ${
              sidebarOpen ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-gray-300">admin@devicemanager.com</p>
          </div>
        </div>

        {/* Floating Sidebar Toggle (Desktop only) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`hidden md:block fixed top-5 z-30 p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 ${
            sidebarOpen ? "left-[15.5rem]" : "left-5"
          }`}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeftIcon
            className={`text-white transition-transform ${
              !sidebarOpen && "rotate-180"
            }`}
            size={20}
          />
        </button>
      </div>
    </>
  );
};

export default Sidebar;
