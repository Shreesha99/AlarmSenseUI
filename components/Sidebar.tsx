import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Wind,
  Cpu,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Auto collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sections = [
    // {
    //   title: "Operations",
    //   items: [
    //     {
    //       id: "dashboard",
    //       label: "Fleet Overview",
    //       icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
    //     },
    //     {
    //       id: "alarms",
    //       label: "Active Alarms",
    //       icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    //     },
    //   ],
    // },
    {
      title: "Analytics",
      items: [
        {
          id: "alarmsense",
          label: "AlarmSense AI",
          icon: BrainCircuit,
        },
        // {
        //   id: "turbines",
        //   label: "Performance",
        //   icon: Cpu,
        // },
      ],
    },
  ];

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const effectiveCollapsed = isMobile ? true : collapsed;

  return (
    <aside
      className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        effectiveCollapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {!effectiveCollapsed && (
          <span className="text-sm font-semibold text-gray-700">
            Navigation
          </span>
        )}

        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            {effectiveCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        )}
      </div>

      <div className="flex-1 py-2 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={section.title} className={idx > 0 ? "mt-8" : ""}>
            {!effectiveCollapsed && (
              <h3 className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 select-none">
                {section.title}
              </h3>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = activePage === item.id;
                const Icon = item.icon as any;

                return (
                  <div
                    key={item.id}
                    role="button"
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center ${
                      effectiveCollapsed ? "justify-center px-0" : "px-6"
                    } py-2.5 cursor-pointer transition-all duration-200 border-r-2 rounded-l-lg
                    ${
                      isActive
                        ? "bg-blue-50 border-blue-600 text-blue-800"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        effectiveCollapsed ? "" : "mr-3"
                      } transition-colors duration-200 ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />

                    {!effectiveCollapsed && (
                      <span
                        className={`text-sm transition-all duration-200 ${
                          isActive ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {item.label}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute right-0 top-0 bottom-0 w-[2px] bg-blue-600 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
          <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Support</div>
          <div className="text-xs text-blue-700 font-medium hover:underline cursor-pointer flex items-center justify-between">
            Help Center <span>→</span>
          </div>
        </div>
      </div> */}
    </aside>
  );
};

export default Sidebar;
