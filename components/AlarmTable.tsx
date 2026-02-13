import React, { useState, useEffect } from "react";
import { RootCauseResult } from "@/types";
import PriorityBadge from "@/components/PriorityBadge";
import AlarmPagination from "@/components/AlarmPagination";
import AlarmDetailsOverlay from "@/components/AlarmDetailsOverlay";
import AlarmFilterPopover from "./AlarmFilterPopover";
import { Download, FileSearch, SearchX } from "lucide-react";

interface Props {
  results: RootCauseResult[];
  paginatedData: RootCauseResult[];
  loading: boolean;
  searched: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const AlarmTable: React.FC<Props> = ({
  results,
  paginatedData,
  loading,
  searched,
  currentPage,
  pageSize,
  totalPages,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}) => {
  const [selected, setSelected] = useState<RootCauseResult | null>(null);
  const [filteredResults, setFilteredResults] =
    useState<RootCauseResult[]>(results);

  useEffect(() => {
    setFilteredResults(results);
  }, [results]);

  useEffect(() => {
    onPageChange(1);
  }, [filteredResults.length]);

  const exportToCSV = () => {
    if (!results.length) return;

    const headers = [
      "ID",
      "Start Time",
      "End Time",
      "Root Cause",
      "Alarm Code",
      "Class",
      "Priority",
    ];

    const rows = results.map((r) => [
      r.id,
      r.startTime,
      r.endTime,
      r.rootCauseName,
      r.alarmCode,
      r.class,
      r.priority,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.map((v) => `"${v}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "alarm_results.csv";
    link.click();
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-[520px]">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-800">
              Root Cause Candidates
            </span>

            <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full border border-blue-100">
              {filteredResults.length} ENTRIES
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <AlarmFilterPopover
              data={results}
              onFiltered={setFilteredResults}
            />

            {results.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold bg-[#2d1653] text-white rounded-md hover:opacity-90 transition w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div
            className={
              filteredResults.length > 0 ? "max-h-[420px] overflow-y-auto" : ""
            }
          >
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-[11px] font-semibold uppercase tracking-wider border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left">Time Window</th>
                  <th className="px-4 sm:px-6 py-4 text-left">Root Cause</th>
                  <th className="px-4 sm:px-6 py-4 text-left">Alarm Code</th>
                  <th className="px-4 sm:px-6 py-4 text-left">Priority</th>
                  <th className="px-4 sm:px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-5">
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : searched && filteredResults.length > 0 ? (
                  filteredResults
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((row) => (
                      <tr
                        key={row.id}
                        className="group hover:bg-blue-50/30 transition"
                      >
                        <td className="px-4 sm:px-6 py-5">
                          <div className="flex flex-col space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase">
                              {new Date(row.startTime).toLocaleDateString()}
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                              {new Date(row.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              to{" "}
                              {new Date(row.endTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 sm:px-6 py-5 font-semibold text-gray-900">
                          {row.rootCauseName}
                        </td>

                        <td className="px-4 sm:px-6 py-5 text-gray-600 font-mono text-xs break-all">
                          {row.alarmCode}
                        </td>

                        <td className="px-4 sm:px-6 py-5">
                          <PriorityBadge priority={row.priority} />
                        </td>

                        <td className="px-4 sm:px-6 py-5 text-center">
                          <button
                            onClick={() => setSelected(row)}
                            className="px-3 py-1.5 text-xs font-semibold rounded-md border border-blue-200 text-blue-600 hover:bg-blue-100 transition w-full sm:w-auto"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 sm:py-32 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        {/* Icon */}
                        {searched ? (
                          <SearchX className="w-14 h-14 sm:w-16 sm:h-16 mb-4 text-gray-300" />
                        ) : (
                          <FileSearch className="w-14 h-14 sm:w-16 sm:h-16 mb-4 text-gray-300" />
                        )}

                        {/* Title */}
                        <span className="text-base sm:text-lg font-medium">
                          {searched
                            ? "Query returned 0 results"
                            : "Ready for Analysis"}
                        </span>

                        {/* Description */}
                        <span className="text-xs sm:text-sm max-w-[240px] sm:max-w-sm mt-2">
                          Adjust filters and execute the search to populate the
                          investigation grid.
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {results.length > 0 && !loading && (
          <div className="px-4 sm:px-6 pb-4">
            <AlarmPagination
              resultsLength={filteredResults.length}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={Math.ceil(filteredResults.length / pageSize)}
              pageSizeOptions={pageSizeOptions}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )}
      </div>

      <AlarmDetailsOverlay data={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default AlarmTable;
