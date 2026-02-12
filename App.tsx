import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AlarmSense from "@/pages/AlarmSense";
import IndustrialStatusBar from "@/components/IndustrialStatusBar";

const App: React.FC = () => {
  const [activePage] = useState("alarmsense");

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-gray-900">
      <Header />

      <div className="flex flex-1 pt-[56px] pb-[28px]">
        <Sidebar activePage={activePage} />

        <main className="flex-1 ml-[240px] p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activePage === "alarmsense" ? (
              <AlarmSense />
            ) : (
              <div className="bg-white p-20 text-center rounded-xl border border-dashed border-gray-300">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-800">
                  Module Initializing
                </h1>
                <p className="mt-2 text-sm text-gray-500">
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
