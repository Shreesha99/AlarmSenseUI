import React from "react";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface Props {
  priority: "P1" | "P2";
}

const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const isCritical = priority === "P1";

  const tooltipText = isCritical ? "Critical priority" : "Moderate priority";

  return (
    <span className="relative inline-flex items-center group">
      {/* Badge */}
      <span
        className={`
          inline-flex items-center gap-1.5
          px-2.5 py-1
          text-[11px] font-semibold
          rounded-md
          border
          transition-all duration-200
          ${
            isCritical
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }
          hover:shadow-sm
        `}
      >
        {isCritical ? (
          <AlertTriangle className="w-3 h-3" />
        ) : (
          <AlertCircle className="w-3 h-3" />
        )}
        {priority}
      </span>

      {/* Tooltip */}
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
