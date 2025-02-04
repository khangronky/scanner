import React from "react";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f2fafc]">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl text-center font-bold text-gray-900">
            NEO Culture Technology ID Scanner
          </h1>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2">
          <Outlet />
        </div>
      </main>

      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-600">
            © 2025 NEO Culture Technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
