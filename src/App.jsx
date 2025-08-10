// src/App.jsx
import React from "react";
import { DeviceProvider } from "./context/DeviceContext";
import DevicesDashboard from "./pages/DevicesDashboard";

const App = () => {
  return (
    <DeviceProvider>
      <DevicesDashboard />
    </DeviceProvider>
  );
};

export default App;
