import React, { useEffect, useState } from "react";
import { alarmService } from "../services/alarmService";
import { Site } from "../types";

const TOTAL_RAM = 16; // GB

const IndustrialStatusBar: React.FC = () => {
  const [cpu, setCpu] = useState<number>(12);
  const [ramUsed, setRamUsed] = useState<number>(4.2);
  const [node, setNode] = useState<string>("Loading...");

  // Fetch first site as node name
  useEffect(() => {
    const sub = alarmService.getSites().subscribe((sites: Site[]) => {
      if (sites.length > 0) {
        setNode(sites[0].name);
      } else {
        setNode("No Site");
      }
    });

    return () => sub.unsubscribe();
  }, []);

  // Simulated realtime CPU & RAM
  useEffect(() => {
    const interval = setInterval(() => {
      setCpu((prev) => {
        const next = prev + (Math.random() * 4 - 2);
        return Math.max(2, Math.min(95, parseFloat(next.toFixed(1))));
      });

      setRamUsed((prev) => {
        const next = prev + (Math.random() * 0.3 - 0.15);
        return Math.max(
          2,
          Math.min(TOTAL_RAM - 1, parseFloat(next.toFixed(2)))
        );
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
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
          <span className="text-blue-400">Node:</span> {node}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex space-x-3 text-gray-400">
          <span>
            RAM:{" "}
            <span className="text-white">
              {ramUsed}GB / {TOTAL_RAM}GB
            </span>
          </span>

          <span>
            CPU: <span className="text-white">{cpu}%</span>
          </span>
        </div>

        <div className="w-[1px] h-3 bg-white/10"></div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Security Level:</span>
          <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-sm border border-yellow-500/30 font-black">
            Medium
          </span>
        </div>
      </div>
    </footer>
  );
};

export default IndustrialStatusBar;
