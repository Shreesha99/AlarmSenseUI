import React from "react";
import { RootCauseResult } from "../types";
import PriorityBadge from "./PriorityBadge";
import { X, Clock, Calendar, Hash, Layers } from "lucide-react";
import { createPortal } from "react-dom";

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
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center flex items-center justify-center p-4 sm:p-6">
      <div
        className="
          relative w-full max-w-4xl
          bg-white
          rounded-3xl
          shadow-[0_30px_80px_rgba(0,0,0,0.12)]
          border border-gray-200
          overflow-hidden
          animate-[fadeIn_0.25s_ease-out]
        "
      >
        {/* Header */}
        <div className="px-6 sm:px-10 py-6 border-b border-gray-100 flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {data.alarmCode}
              </span>
              <PriorityBadge priority={data.priority} />
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Alarm Investigation Summary
            </h3>
          </div>

          <button
            onClick={onClose}
            className="
              w-9 h-9 flex items-center justify-center
              rounded-lg border border-gray-200
              hover:bg-gray-50 transition
            "
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-10 py-8 space-y-10">
          {/* Root Cause Section */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Identified Root Cause
            </p>
            <p className="mt-3 text-lg font-semibold text-gray-900">
              {data.rootCauseName}
            </p>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Alarm ID */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Hash className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">
                  Alarm ID
                </span>
              </div>
              <p className="font-mono text-sm text-gray-900">{data.id}</p>
            </div>

            {/* Class */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Layers className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Class</span>
              </div>
              <p className="text-sm text-gray-900">{data.class}</p>
            </div>

            {/* Start Time */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">
                  Start Time
                </span>
              </div>
              <p className="text-sm text-gray-900">
                {new Date(data.startTime).toLocaleString()}
              </p>
            </div>

            {/* End Time */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">
                  End Time
                </span>
              </div>
              <p className="text-sm text-gray-900">
                {new Date(data.endTime).toLocaleString()}
              </p>
            </div>

            {/* Duration */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-2 sm:col-span-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">
                  Duration
                </span>
              </div>
              <p className="text-sm text-gray-900">{duration} minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmDetailsOverlay;
