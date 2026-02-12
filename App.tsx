
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AlarmSense from './pages/AlarmSense';

const App: React.FC = () => {
  const [activePage] = useState('alarmsense');

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-gray-900">
      <Header />
      
      <div className="flex flex-1 pt-[56px] pb-[28px]">
        <Sidebar activePage={activePage} />
        
        <main className="flex-1 ml-[240px] p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activePage === 'alarmsense' ? (
              <AlarmSense />
            ) : (
              <div className="bg-white p-20 text-center rounded-xl border border-dashed border-gray-300">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <h1 className="text-xl font-bold text-gray-800">Module Initializing</h1>
                <p className="mt-2 text-sm text-gray-500">The requested controller logic is currently being synchronized with the master node.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Industrial Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-7 bg-[#232323] text-white flex items-center px-4 justify-between z-50 text-[10px] border-t border-white/5 font-medium uppercase tracking-widest shadow-[0_-2px_10px_rgba(0,0,0,0.2)]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-green-400">System Healthy</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10"></div>
          <div className="flex items-center space-x-1.5 text-gray-400">
            <span className="text-blue-400">Node:</span> SG-NORTH-01
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex space-x-3 text-gray-400">
            <span>RAM: <span className="text-white">4.2GB / 16GB</span></span>
            <span>CPU: <span className="text-white">12%</span></span>
          </div>
          <div className="w-[1px] h-3 bg-white/10"></div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Security Level:</span>
            <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-sm border border-yellow-500/30 font-black">Medium</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
