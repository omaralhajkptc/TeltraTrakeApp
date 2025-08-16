// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DeviceProvider } from "./context/DeviceContext";
import { DeviceTypeProvider } from "./context/DeviceTypeContext";
import DevicesDashboard from "./pages/DevicesDashboard";
import SimHistory from "./pages/SimHistory";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer"; // Import the new Footer component

import axios from "axios";

// Set base URL for API
axios.defaults.baseURL = "http://localhost:3001";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // نحدد ما إذا كنا على جهاز محمول لتطبيق سلووكات محددة للجوال
  const isMobile = window.innerWidth < 768;
  const [isInitializing, setIsInitializing] = useState(true); // New state for initialization

  // دالة لإغلاق الشريط الجانبي
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500); // Simulate 1.5 seconds loading time

    // Optional: Add a resize listener for isMobile if needed, but for this context,
    // a simple initial check is sufficient.
    const handleResize = () => {
      return;
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Show a loading screen while the app is initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Device Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <DeviceProvider>
      <DeviceTypeProvider>
        <Router>
          <div className="flex flex-col h-screen bg-gray-50">
            <div className="flex flex-1">
              {/* مكون الشريط الجانبي */}
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isMobile={isMobile}
                // تمرير دالة لإغلاق الشريط الجانبي عند النقر على رابط تنقل
                onNavLinkClick={handleSidebarClose}
              />

              {/* طبقة التراكب (Overlay) للجوال */}
              {/* تظهر فقط إذا كان الشريط الجانبي مفتوحًا وعلى شاشات الجوال (hidden on md and up) */}
              {/* {sidebarOpen && isMobile && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                  onClick={handleSidebarClose} // إغلاق الشريط الجانبي عند النقر على الطبقة
                  aria-hidden="true" // لتحسين إمكانية الوصول
                ></div>
              )} */}

              {/* المحتوى الرئيسي للتطبيق */}
              {/* يتم تطبيق الهامش الأيسر (ml-) فقط على الشاشات المتوسطة وما فوق (md:) */}
              <div
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ${
                  sidebarOpen ? "md:ml-64" : "md:ml-20"
                }`}
              >
                <Routes>
                  <Route
                    path="/"
                    element={
                      <DevicesDashboard
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                      />
                    }
                  />
                  <Route path="/sim-history" element={<SimHistory />} />
                  {/* هنا يمكنك إضافة مسارات لصفحاتك الأخرى */}
                  {/* مثال: <Route path="/settings" element={<SettingsPage />} /> */}
                  {/* مثال: <Route path="/notifications" element={<NotificationsPage />} /> */}
                  {/* مثال: <Route path="/account" element={<AccountPage />} /> */}
                </Routes>
              </div>
            </div>
            <Footer />
          </div>
        </Router>
      </DeviceTypeProvider>
    </DeviceProvider>
  );
}

export default App;
