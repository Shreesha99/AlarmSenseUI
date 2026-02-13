import React, { useEffect, useMemo, useState } from "react";
import { RootCauseResult } from "@/types";

interface Props {
  data: RootCauseResult[];
  onFiltered: (filtered: RootCauseResult[]) => void;
}

const AlarmFilterBar: React.FC<Props> = ({ data, onFiltered }) => {
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<"ALL" | "P1" | "P2">("ALL");

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((r) =>
        `${r.id} ${r.alarmCode} ${r.rootCauseName} ${r.class}`
          .toLowerCase()
          .includes(term)
      );
    }

    if (priority !== "ALL") {
      result = result.filter((r) => r.priority === priority);
    }

    return result;
  }, [data, search, priority]);

  useEffect(() => {
    onFiltered(filteredData);
  }, [filteredData, onFiltered]);

  const clearFilters = () => {
    setSearch("");
    setPriority("ALL");
  };

  return (
    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-4 py-3 mb-4 shadow-sm">
      {/* Smart Search */}
      <input
        type="text"
        placeholder="Search alarms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          flex-1
          px-3 py-2
          text-sm
          border border-gray-300
          rounded-md
          focus:outline-none
          focus:ring-2 focus:ring-blue-500
        "
      />

      {/* Priority Filter */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as "ALL" | "P1" | "P2")}
        className="
          px-3 py-2
          text-sm
          border border-gray-300
          rounded-md
        "
      >
        <option value="ALL">All</option>
        <option value="P1">P1</option>
        <option value="P2">P2</option>
      </select>

      {/* Clear */}
      <button
        onClick={clearFilters}
        className="
          text-xs font-semibold
          px-3 py-2
          rounded-md
          border border-gray-200
          hover:bg-gray-50
          transition
        "
      >
        Clear
      </button>
    </div>
  );
};

export default AlarmFilterBar;
