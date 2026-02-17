import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface Props {
  priority: "P1" | "P2";
}

const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const isCritical = priority === "P1";
  const tooltipText = isCritical ? "Critical priority" : "Moderate priority";

  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const badgeRef = useRef<HTMLSpanElement>(null);

  // Calculate tooltip position
  const updatePosition = () => {
    if (!badgeRef.current) return;

    const rect = badgeRef.current.getBoundingClientRect();

    setCoords({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  };

  useEffect(() => {
    if (!visible) return;

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [visible]);

  return (
    <>
      {/* Badge */}
      <span
        ref={badgeRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className={`
          inline-flex items-center gap-1.5
          px-2.5 py-1
          text-[11px] font-semibold
          rounded-md
          border
          transition-all duration-200
          cursor-default
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

      {/* Tooltip via Portal */}
      {visible &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: "translateX(-50%)",
              zIndex: 9999,
            }}
            className="
              pointer-events-none
              text-[11px]
              text-gray-600
              bg-white
              border border-gray-200
              rounded-md
              px-2.5 py-1
              shadow-md
              animate-fadeIn
            "
          >
            {tooltipText}
          </div>,
          document.body
        )}
    </>
  );
};

export default PriorityBadge;
