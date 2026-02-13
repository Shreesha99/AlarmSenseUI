import React, { useEffect, useMemo, useRef, useState } from "react";
import { RootCauseResult } from "@/types";
import { Filter } from "lucide-react";
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

  const fuzzyMatch = (text: string, pattern: string) => {
    let pi = 0;
    let ti = 0;

    while (pi < pattern.length && ti < text.length) {
      if (pattern[pi] === text[ti]) pi++;
      ti++;
    }

    return pi === pattern.length;
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    // Priority
    if (priority !== "ALL") {
      result = result.filter((r) => r.priority === priority);
    }

    // Smart search
    if (search.trim()) {
      const tokens = search.toLowerCase().split(" ").filter(Boolean);

      result = result.filter((r) => {
        const start = new Date(r.startTime);
        const end = new Date(r.endTime);

        const searchable = [
          r.id,
          r.alarmCode,
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

        return tokens.every(
          (token) => searchable.includes(token) || fuzzyMatch(searchable, token)
        );
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
    <div className="relative z-[99]" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 rounded-md border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center"
      >
        <Filter className="w-4 h-4 text-gray-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[340px] bg-white border border-gray-200 rounded-xl shadow-xl p-5 space-y-5">
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
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2d1653] focus:outline-none"
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
