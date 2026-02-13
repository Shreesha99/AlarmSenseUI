import React, { useMemo, useEffect, useState } from "react";
import { alarmService } from "../services/alarmService";
import { Site } from "../types";

interface User {
  name: string;
  role: string;
}

interface HeaderProps {
  user?: User;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [utcTime, setUtcTime] = useState<string>("");
  const [serverSite, setServerSite] = useState<string>("");

  // Default user fallback
  const currentUser: User = user ?? {
    name: "Default User",
    role: "System User",
  };

  // Generate initials
  const initials = useMemo(() => {
    return currentUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [currentUser.name]);

  // Fetch first site as Server ID
  useEffect(() => {
    const sub = alarmService.getSites().subscribe((sites: Site[]) => {
      if (sites && sites.length > 0) {
        setServerSite(sites[0].name);
      } else {
        setServerSite("No Site");
      }
    });

    return () => sub.unsubscribe();
  }, []);

  // Live UTC clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now
        .toUTCString()
        .split(",")[1]
        .trim()
        .replace("GMT", "UTC");

      setUtcTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] bg-[#00646C] text-white flex items-center justify-between px-6 border-b border-[#004F55] shadow-md z-40">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Siemens Energy"
            className="h-8 object-contain"
          />
        </div>

        <div className="h-6 w-[1px] bg-white/20"></div>

        <div className="text-xs font-semibold tracking-wider text-white/90">
          ALARM SENSE
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <div className="hidden lg:flex flex-col items-end text-[10px] text-white/80 leading-tight">
          <span className="font-mono">
            SERVER ID: {serverSite || "Loading..."}
          </span>
          <span>{utcTime}</span>
        </div>

        <div className="h-8 w-[1px] bg-white/20"></div>

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-xs font-semibold group-hover:text-white transition-colors">
              {currentUser.name}
            </span>
            <span className="text-[9px] text-white/70 uppercase">
              {currentUser.role}
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center font-semibold text-sm backdrop-blur-sm">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
