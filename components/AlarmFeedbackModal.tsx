import React, { useEffect, useMemo, useState } from "react";
import { RootCauseResult } from "../types";
import { X } from "lucide-react";
import CustomButton from "@/components/CustomButton";
import CustomDropdown from "@/components/CustomDropdown";

interface Props {
  data: RootCauseResult | null;
  allAlarms?: RootCauseResult[];
  onClose: () => void;
  onSubmitted: () => void;
}

const AlarmFeedbackModal: React.FC<Props> = ({
  data,
  allAlarms = [],
  onClose,
  onSubmitted,
}) => {
  const [approved, setApproved] = useState(true);
  const [confidence, setConfidence] = useState(70);
  const [alternateAlarm, setAlternateAlarm] = useState("");
  const [error, setError] = useState("");

  /* ---------------- Reset When Open ---------------- */
  useEffect(() => {
    if (data) {
      setApproved(true);
      setConfidence(70);
      setAlternateAlarm("");
      setError("");
    }
  }, [data]);

  /* ---------------- Unique Alarm List ---------------- */
  const uniqueAlarms = useMemo(() => {
    const map = new Map<string, RootCauseResult>();

    allAlarms.forEach((a) => {
      if (a?.alarmCode && !map.has(a.alarmCode)) {
        map.set(a.alarmCode, a);
      }
    });

    return Array.from(map.values());
  }, [allAlarms]);

  /* ---------------- Submit ---------------- */
  const submit = () => {
    if (!approved && !alternateAlarm) {
      setError("You must select the correct alarm code.");
      return;
    }

    const payload = {
      alarmId: data?.id,
      approved,
      confidence,
      suggestedAlarmCode: data?.alarmCode,
      correctedAlarmCode: approved ? null : alternateAlarm,
    };

    console.log("FEEDBACK PAYLOAD:", payload);

    onSubmitted();
  };

  /* ---------------- Color Logic ---------------- */
  const ringColor =
    confidence >= 75 ? "#16A34A" : confidence >= 40 ? "#D97706" : "#DC2626";

  /* ---------------- Guard After Hooks ---------------- */
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-md shadow-lg border border-gray-200 animate-[fadeIn_0.25s_ease-out]">
        <div className="h-1 w-full bg-[#00646C]" />

        {/* ---------------- Header ---------------- */}
        <div className="px-6 sm:px-10 py-6 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Root Cause Feedback
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Suggested:{" "}
              <span className="font-medium text-gray-800">
                {data.rootCauseName}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Alarm Code: {data.alarmCode}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* ---------------- Body ---------------- */}
        <div className="px-6 sm:px-10 py-8 space-y-12">
          {/* -------- Decision -------- */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-[#00646C] uppercase tracking-wider">
              Decision
            </p>

            <div className="flex gap-4">
              <CustomButton
                fullWidth
                variant={approved ? "primary" : "ghost"}
                onClick={() => {
                  setApproved(true);
                  setConfidence(80);
                  setError("");
                }}
              >
                Approve Suggestion
              </CustomButton>

              <CustomButton
                fullWidth
                variant={!approved ? "danger" : "ghost"}
                onClick={() => {
                  setApproved(false);
                  setConfidence(25);
                }}
              >
                Reject Suggestion
              </CustomButton>
            </div>
          </div>

          {/* -------- Confidence Meter -------- */}
          <div className="space-y-6">
            <p className="text-xs font-semibold text-[#00646C] uppercase tracking-wider">
              Confidence Level
            </p>

            <div className="flex flex-col items-center space-y-6">
              {/* Circular Ring */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="absolute inset-0" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={ringColor}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${confidence * 2.83} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-300"
                  />
                </svg>

                <div className="text-3xl font-semibold text-gray-900">
                  {confidence}%
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex gap-2">
                {[25, 50, 75, 100].map((val) => (
                  <CustomButton
                    key={val}
                    size="sm"
                    variant={confidence === val ? "primary" : "ghost"}
                    onClick={() => setConfidence(val)}
                  >
                    {val}%
                  </CustomButton>
                ))}
              </div>

              <div className="w-full">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="confidence-slider w-full"
                />
              </div>

              <style>
                {`
    .confidence-slider {
      -webkit-appearance: none;
      height: 8px;
      border-radius: 999px;
      background: linear-gradient(
        to right,
        #00646C 0%,
        #00646C ${confidence}%,
        #E5E7EB ${confidence}%,
        #E5E7EB 100%
      );
      outline: none;
      transition: background 0.2s ease;
    }

    .confidence-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ffffff;
      border: 3px solid #00646C;
      cursor: pointer;
      transition: transform 0.15s ease;
    }

    .confidence-slider::-webkit-slider-thumb:hover {
      transform: scale(1.1);
    }

    .confidence-slider::-webkit-slider-thumb:active {
      transform: scale(1.15);
    }

    .confidence-slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ffffff;
      border: 3px solid #00646C;
      cursor: pointer;
    }
  `}
              </style>
            </div>
          </div>

          {/* -------- Alternate Alarm -------- */}
          {!approved && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#00646C] uppercase tracking-wider">
                Correct Alarm Code
              </p>

              <CustomDropdown
                value={alternateAlarm}
                options={uniqueAlarms
                  .filter((a) => a.alarmCode !== data.alarmCode)
                  .map((alarm) => ({
                    value: alarm.alarmCode,
                    label: `${alarm.alarmCode} | ${alarm.rootCauseName}`,
                  }))}
                placeholder="Select Alarm Code"
                error={!!error}
                onChange={(val) => {
                  setAlternateAlarm(val);
                  setError("");
                }}
              />

              {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </div>
          )}
        </div>

        {/* ---------------- Footer ---------------- */}
        <div className="px-6 sm:px-10 py-5 border-t border-gray-100 flex justify-end">
          <CustomButton onClick={submit}>Submit Feedback</CustomButton>
        </div>
      </div>
    </div>
  );
};

export default AlarmFeedbackModal;
