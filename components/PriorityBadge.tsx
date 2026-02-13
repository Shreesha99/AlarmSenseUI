import React from "react";
import { PriorityColor } from "@/types";

interface Props {
  priority: "P1" | "P2";
}

const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const tooltipText =
    priority === "P1" ? "Critical priority" : "Moderate priority";

  return (
    <span className="relative inline-flex items-center group">
      {/* Badge */}
      <span
        className={`
          ${PriorityColor[priority]}
          transition-transform duration-150
          hover:scale-[1.04]
        `}
      >
        {priority}
      </span>

      {/* Subtle Tooltip */}
      <span
        className="
          pointer-events-none
          absolute left-1/2 -translate-x-1/2
          top-full mt-2
          whitespace-nowrap
          text-[11px]
          text-gray-600
          bg-white
          border border-gray-200
          rounded-md
          px-2.5 py-1
          opacity-0
          group-hover:opacity-100
          transition-opacity duration-150
          shadow-sm
          z-50
        "
      >
        {tooltipText}
      </span>
    </span>
  );
};

export default PriorityBadge;
