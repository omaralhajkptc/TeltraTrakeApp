import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} DeviceHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
