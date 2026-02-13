import React, { useEffect, useMemo, useRef, useState } from "react";
import { RootCauseResult } from "@/types";
import { Filter, X } from "lucide-react";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import CustomDropdown from "@/components/CustomDropdown";
import CustomButton from "@/components/CustomButton";

interface Props {
  data: RootCauseResult[];
  onFiltered: (filtered: RootCauseResult[]) => void;
}

const AlarmFilterPopover: React.FC<Props> = ({ data, onFiltered }) => {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("ALL");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const isFilterActive =
    search.trim() !== "" ||
    priority !== "ALL" ||
    fromDate !== "" ||
    toDate !== "" ||
    minDuration !== "" ||
    maxDuration !== "";

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Priority
    if (priority !== "ALL") {
      result = result.filter((r) => r.priority === priority);
    }

    if (search.trim()) {
      const query = search.toLowerCase().replace(/\s+/g, "");

      result = result.filter((r) => {
        const normalizedAlarmCode = r.alarmCode
          .toLowerCase()
          .replace(/\s+/g, "");

        // Exact alarm code match after normalization
        if (normalizedAlarmCode === query) {
          return true;
        }

        // Otherwise normal contains search (excluding alarmCode)
        const start = new Date(r.startTime);
        const end = new Date(r.endTime);

        const searchable = [
          r.id,
          r.rootCauseName,
          r.class,
          r.priority,
          start.toLocaleDateString(),
          start.toLocaleTimeString(),
          end.toLocaleDateString(),
          end.toLocaleTimeString(),
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(search.toLowerCase());
      });
    }

    // Time window filter (only startTime)
    if (fromDate) {
      result = result.filter(
        (r) => new Date(r.startTime) >= new Date(fromDate)
      );
    }

    if (toDate) {
      result = result.filter((r) => new Date(r.startTime) <= new Date(toDate));
    }

    // Duration filter
    if (minDuration) {
      result = result.filter((r) => {
        const duration =
          (new Date(r.endTime).getTime() - new Date(r.startTime).getTime()) /
          60000;
        return duration >= Number(minDuration);
      });
    }

    if (maxDuration) {
      result = result.filter((r) => {
        const duration =
          (new Date(r.endTime).getTime() - new Date(r.startTime).getTime()) /
          60000;
        return duration <= Number(maxDuration);
      });
    }

    return result;
  }, [data, search, priority, fromDate, toDate, minDuration, maxDuration]);

  useEffect(() => {
    onFiltered(filteredData);
  }, [filteredData, onFiltered]);

  const clear = () => {
    setSearch("");
    setPriority("ALL");
    setFromDate("");
    setToDate("");
    setMinDuration("");
    setMaxDuration("");
  };

  return (
    <div className="relative z-[97] flex items-center gap-2" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`w-9 h-9 rounded-md border transition flex items-center justify-center ${
          isFilterActive
            ? "border-[#00646C] bg-[#00646C]/10"
            : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        <Filter
          className={`w-4 h-4 ${
            isFilterActive ? "text-[#00646C]" : "text-gray-600"
          }`}
        />
      </button>

      {isFilterActive && (
        <button
          onClick={clear}
          className={`w-9 h-9 rounded-md border transition flex items-center justify-center ${
            isFilterActive
              ? "border-[#00646C]/30 hover:bg-[#00646C]/5"
              : "border-gray-200 hover:bg-gray-50"
          }`}
          title="Clear filters"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {open && (
        <div className="absolute right-0 mt-2 w-[340px] bg-white border border-gray-200 rounded-md shadow-lg p-5 space-y-5">
          {/* Smart Search */}
          <div>
            <label className="text-xs text-gray-500 uppercase">
              Smart Search
            </label>
            <input
              type="text"
              placeholder="Search ID, Code, Root Cause..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00646C]
              focus:outline-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs text-gray-500 uppercase">Priority</label>
            <CustomDropdown
              value={priority}
              onChange={setPriority}
              options={[
                { label: "All", value: "ALL" },
                { label: "P1", value: "P1" },
                { label: "P2", value: "P2" },
              ]}
            />
          </div>

          {/* Time Window */}
          <div>
            <label className="text-xs text-gray-500 uppercase">
              Time Window
            </label>
            <div className="mt-2 flex gap-2">
              <CustomDateTimePicker
                value={fromDate}
                onChange={setFromDate}
                placeholder="From"
              />
              <CustomDateTimePicker
                value={toDate}
                onChange={setToDate}
                placeholder="To"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs text-gray-500 uppercase">
              Duration (minutes)
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minDuration}
                onChange={(e) => setMinDuration(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxDuration}
                onChange={(e) => setMaxDuration(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <CustomButton variant="ghost" size="sm" onClick={clear}>
              Clear
            </CustomButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlarmFilterPopover;
