import React from "react";
import { RootCauseResult } from "../types";
import PriorityBadge from "./PriorityBadge";

interface Props {
  data: RootCauseResult | null;
  onClose: () => void;
}

const AlarmDetailsOverlay: React.FC<Props> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Alarm Details
            </h3>
            <p className="text-xs text-gray-400 mt-1">Investigation Metadata</p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-sm">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-xs uppercase">Alarm ID</p>
              <p className="font-mono mt-1">{data.id}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase">Alarm Code</p>
              <p className="font-mono mt-1">{data.alarmCode}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase">Root Cause</p>
              <p className="mt-1 font-semibold">{data.rootCauseName}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase">Class</p>
              <p className="mt-1">{data.class}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase">Start Time</p>
              <p className="mt-1">
                {new Date(data.startTime).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase">End Time</p>
              <p className="mt-1">{new Date(data.endTime).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs uppercase mb-2">Priority</p>
            <PriorityBadge priority={data.priority} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmDetailsOverlay;
