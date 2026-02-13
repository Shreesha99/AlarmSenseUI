import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AlarmSense from "@/pages/AlarmSense";
// import IndustrialStatusBar from "@/components/IndustrialStatusBar";

const App: React.FC = () => {
  const [activePage] = useState("alarmsense");

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased bg-gray-50 text-gray-900 overflow-hidden">
      <Header />

      <div className="flex flex-1 pt-[56px]">
        <Sidebar activePage={activePage} />

        <main className="flex-1 overflow-y-auto transition-all duration-300">
          <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-10 py-8">
            {activePage === "alarmsense" ? (
              <AlarmSense />
            ) : (
              <div className="bg-white p-12 sm:p-16 text-center rounded-md border border-gray-200 shadow-sm">
                <div className="w-16 h-16 bg-[#00646C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-[#00646C]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>

                <h1 className="text-lg font-semibold text-gray-800">
                  Module Initializing
                </h1>

                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  The requested controller logic is currently being synchronized
                  with the master node.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* <IndustrialStatusBar /> */}
    </div>
  );
};

export default App;
