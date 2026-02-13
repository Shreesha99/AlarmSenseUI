import React from "react";
import { RootCauseResult } from "../types";
import PriorityBadge from "./PriorityBadge";

interface Props {
  data: RootCauseResult | null;
  onClose: () => void;
}

const AlarmDetailsOverlay: React.FC<Props> = ({ data, onClose }) => {
  if (!data) return null;

  const duration =
    Math.round(
      (new Date(data.endTime).getTime() - new Date(data.startTime).getTime()) /
        60000
    ) || 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-6">
      <div
        className="
          relative w-full max-w-3xl
          bg-white/90 backdrop-blur-xl
          rounded-2xl
          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
          border border-gray-200/70
          animate-[fadeIn_0.25s_ease-out]
        "
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
              Alarm Investigation
            </h3>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-mono">
                {data.alarmCode}
              </span>
              <PriorityBadge priority={data.priority} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              w-8 h-8 flex items-center justify-center
              rounded-md
              text-gray-400
              hover:bg-gray-100 hover:text-gray-700
              transition-all duration-200
            "
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-8 text-sm">
          {/* Root Cause Section */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Identified Root Cause
            </p>
            <p className="mt-2 text-base font-semibold text-gray-900">
              {data.rootCauseName}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Alarm ID
              </p>
              <p className="mt-2 font-mono text-gray-800">{data.id}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Class
              </p>
              <p className="mt-2 text-gray-800">{data.class}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Start Time
              </p>
              <p className="mt-2 text-gray-800">
                {new Date(data.startTime).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                End Time
              </p>
              <p className="mt-2 text-gray-800">
                {new Date(data.endTime).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                Duration
              </p>
              <p className="mt-2 text-gray-800">{duration} mins</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmDetailsOverlay;
