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
    <footer className="fixed bottom-0 left-0 right-0 h-9 bg-white border-t border-gray-200 flex items-center px-6 justify-between z-40 text-[11px] font-medium shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        {/* Health Indicator */}
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-[#00646C]/40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00646C]"></span>
          </span>
          <span className="text-[#00646C] font-semibold">System Healthy</span>
        </div>

        <div className="w-[1px] h-4 bg-gray-200"></div>

        {/* Node */}
        <div className="flex items-center space-x-1 text-gray-600">
          <span className="text-gray-400 uppercase tracking-wide text-[10px]">
            Node
          </span>
          <span className="font-semibold text-gray-800">{node}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-8">
        {/* RAM */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 uppercase tracking-wide text-[10px]">
            RAM
          </span>
          <span className="font-semibold text-gray-800">
            {ramUsed}GB / {TOTAL_RAM}GB
          </span>
        </div>

        {/* CPU */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 uppercase tracking-wide text-[10px]">
            CPU
          </span>
          <span className="font-semibold text-gray-800">{cpu}%</span>
        </div>

        <div className="w-[1px] h-4 bg-gray-200"></div>

        {/* Security */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 uppercase tracking-wide text-[10px]">
            Security
          </span>
          <span className="px-2 py-0.5 bg-[#00646C]/10 text-[#00646C] rounded border border-[#00646C]/20 font-semibold">
            Medium
          </span>
        </div>
      </div>
    </footer>
  );
};

export default IndustrialStatusBar;
