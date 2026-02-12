import React from "react";

interface SidebarProps {
  activePage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
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
          icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z",
        },
        // {
        //   id: "turbines",
        //   label: "Performance",
        //   icon: "M13 10V3L4 14h7v7l9-11h-7z",
        // },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-[56px] bottom-0 w-[240px] bg-white border-r border-gray-200 flex flex-col z-40">
      <div className="flex-1 py-6 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={section.title} className={idx > 0 ? "mt-8" : ""}>
            <h3 className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <div
                key={item.id}
                className={`group flex items-center px-6 py-2.5 cursor-pointer transition-all duration-150 border-r-2 ${
                  activePage === item.id
                    ? "bg-blue-50 border-blue-600 text-blue-800"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <svg
                  className={`w-5 h-5 mr-3 ${
                    activePage === item.id
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  dangerouslySetInnerHTML={{ __html: item.icon }}
                ></svg>
                <span
                  className={`text-sm ${
                    activePage === item.id ? "font-semibold" : "font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
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
