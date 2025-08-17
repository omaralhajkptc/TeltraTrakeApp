// src/pages/SimTransferHistory.jsx
import React, { useState, useEffect, useRef } from "react";
import ClockIcon from "./icons/Clock";
import DeviceIcon from "./icons/Cpu";
import ArrowRightIcon from "./icons/ArrowRight";
import SearchIcon from "./icons/Search";
import CloseIcon from "./icons/Close";
import PlusIcon from "./icons/Plus";
import MinusIcon from "./icons/Minus";
import TransferIcon from "./icons/Transfer";

const SimTransferHistory = ({ transfers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      clearSearch();
      return;
    }

    setIsSearching(true);
    const results = transfers.filter(
      (transfer) => transfer.sim.toLowerCase() === term
    );
    const sorted = [...results].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    setSearchResults(sorted);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
    searchInputRef.current?.focus();
  };

  const getEventDetails = (transfer) => {
    if (!transfer.fromDevice && transfer.toDevice) {
      return {
        color: "green",
        badge: "ASSIGNED",
        icon: PlusIcon,
        fromText: "New Assignment",
        toText: transfer.toDevice?.name,
      };
    }
    if (!transfer.toDevice) {
      return {
        color: "red",
        badge: "REMOVED",
        icon: MinusIcon,
        fromText: transfer.fromDevice?.name,
        toText: "SIM Removed",
      };
    }
    return {
      color: "purple",
      badge: "TRANSFERRED",
      icon: TransferIcon,
      fromText: transfer.fromDevice?.name,
      toText: transfer.toDevice?.name,
    };
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 transition-colors duration-200">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            SIM Card History Explorer
          </h3>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Enter SIM card number..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (value.trim() === "") {
                  clearSearch();
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-4 pr-12 py-3 text-sm rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            />
            {searchTerm ? (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <CloseIcon size={18} />
              </button>
            ) : (
              <button
                onClick={handleSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
              >
                <SearchIcon size={18} />
              </button>
            )}
          </div>
        </div>

        {isSearching && searchResults.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CloseIcon className="text-red-500" size={32} />
            </div>
            <p className="text-lg font-semibold text-gray-800">
              No transfer history found
            </p>
            <p className="text-sm text-gray-500 mt-2">
              History for SIM: <span className="font-mono">{searchTerm}</span>{" "}
              could not be found.
            </p>
            <button
              onClick={clearSearch}
              className="mt-4 text-blue-600 hover:underline text-sm font-medium transition-colors"
            >
              Clear Search & Try Again
            </button>
          </div>
        )}

        {isSearching && searchResults.length > 0 && (
          <div className="mt-8">
            <h4 className="font-semibold text-gray-700 text-sm flex items-center mb-6">
              History for:
              <span className="font-mono bg-blue-100 text-blue-800 px-3 py-1 rounded-full ml-2 text-xs">
                {searchTerm}
              </span>
              <span className="text-gray-500 font-normal ml-3 text-xs">
                ({searchResults.length} events)
              </span>
            </h4>

            <div className="relative border-l-2 border-gray-200 ml-4 space-y-8">
              {searchResults.map((transfer, idx) => {
                if (idx == 0) return;
                const {
                  color,
                  badge,
                  icon: EventIcon,
                  fromText,
                  toText,
                } = getEventDetails(transfer);
                const colorClasses = {
                  green: {
                    dot: "bg-green-500",
                    badge: "bg-green-100 text-green-800",
                    text: "text-green-600",
                  },
                  red: {
                    dot: "bg-red-500",
                    badge: "bg-red-100 text-red-800",
                    text: "text-red-600",
                  },
                  purple: {
                    dot: "bg-purple-500",
                    badge: "bg-purple-100 text-purple-800",
                    text: "text-purple-600",
                  },
                }[color];

                return (
                  <div
                    key={idx}
                    className="relative pl-8 transition-all duration-300 ease-in-out"
                  >
                    <div
                      className={`absolute left-[-7px] top-0 w-3.5 h-3.5 rounded-full border-2 border-white ${colorClasses.dot}`}
                    ></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <EventIcon
                          size={20}
                          className={`${colorClasses.text}`}
                        />
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${colorClasses.badge}`}
                        >
                          {badge}
                        </span>
                        <p className="text-sm font-medium text-gray-900">
                          {fromText}
                        </p>
                        {transfer.fromDevice && transfer.toDevice && (
                          <ArrowRightIcon size={16} className="text-gray-400" />
                        )}
                        <p className="text-sm font-medium text-gray-900">
                          {toText}
                        </p>
                      </div>

                      <p className="text-xs text-gray-500 flex items-center gap-1 sm:ml-auto mt-1 sm:mt-0">
                        <ClockIcon size={14} />
                        {new Date(transfer.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 mt-2">
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <p className="font-medium">Device Names</p>
                        <div className="flex gap-2 font-mono items-center">
                          <span className="bg-gray-200 px-2 py-1 rounded text-gray-700">
                            {transfer.fromDevice?.name || "New SIM"}
                          </span>
                          <ArrowRightIcon size={12} className="text-gray-400" />
                          <span className="bg-gray-200 px-2 py-1 rounded text-gray-700">
                            {transfer.toDevice?.name || "SIM Removed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-8 border-t border-gray-200 mt-8 text-center">
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 justify-center text-sm transition-colors"
              >
                <CloseIcon size={14} />
                <span>Clear Search</span>
              </button>
            </div>
          </div>
        )}

        {!isSearching && (
          <div className="text-center py-16 text-gray-500">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <SearchIcon className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Search SIM Card History
            </h3>
            <p className="text-gray-500 mx-auto text-sm max-w-sm">
              Enter a SIM card number to view a detailed timeline of its
              transfers across devices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimTransferHistory;
