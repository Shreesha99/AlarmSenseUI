import React from "react";
import { SiSiemens } from "react-icons/si";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] bg-[#2d1653] text-white flex items-center justify-between px-6 z-50 border-b border-white/10 shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-[#2d1653] rotate-45"></div>
          </div>
          <SiSiemens size={62} color="#00A0DC" />
          <span className="font-bold text-lg tracking-tight">
            SIEMENS <span className="font-light opacity-80">Energy</span>
          </span>
        </div>
        <div className="h-6 w-[1px] bg-white/20"></div>
        <div className="text-xs font-medium tracking-widest text-white/70 flex items-center">
          MYSITE 360 <span className="mx-2 text-[10px] opacity-50">/</span>{" "}
          <span className="text-white">ALARM SENSE</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden lg:flex flex-col items-end text-[10px] text-white/60 leading-tight">
          <span className="font-mono">SERVER ID: SG-LN-0822</span>
          <span>12 FEB 2026 | 14:22:10 UTC</span>
        </div>

        <div className="h-8 w-[1px] bg-white/10"></div>

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold group-hover:text-cyan-400 transition-colors">
              Admin User
            </span>
            <span className="text-[9px] opacity-50 uppercase">
              Site Supervisor
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-sm shadow-inner">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
