import React, { useState } from "react";
import { RootCauseResult } from "@/types";
import PriorityBadge from "@/components/PriorityBadge";
import AlarmPagination from "@/components/AlarmPagination";
import AlarmDetailsOverlay from "@/components/AlarmDetailsOverlay";

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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-[520px] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-800">
              Root Cause Candidates
            </span>

            <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full border border-blue-100">
              {results.length} ENTRIES
            </div>
          </div>

          {results.length > 0 && (
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold bg-[#2d1653] text-white rounded-md hover:opacity-90 transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v12m0 0l-3-3m3 3l3-3m-9 5h12"
                />
              </svg>
              <span>Export CSV</span>
            </button>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-[11px] font-semibold uppercase tracking-wider border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left">Time Window</th>
                <th className="px-6 py-4 text-left">Identified Root Cause</th>
                <th className="px-6 py-4 text-left">Alarm Code</th>
                <th className="px-6 py-4 text-left">Priority</th>
                <th className="px-6 py-4 text-center">Action</th>
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
              ) : searched && results.length > 0 ? (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-blue-50/30 transition-all duration-150"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col space-y-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {new Date(row.startTime).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>

                        <div className="flex items-center space-x-2 text-sm font-medium text-gray-800">
                          <span>
                            {new Date(row.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          <span className="text-gray-400 text-xs">→</span>

                          <span>
                            {new Date(row.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="text-[11px] text-gray-400">
                          Duration:{" "}
                          {Math.round(
                            (new Date(row.endTime).getTime() -
                              new Date(row.startTime).getTime()) /
                              60000
                          )}{" "}
                          mins
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 font-semibold text-gray-900">
                      {row.rootCauseName}
                    </td>

                    <td className="px-6 py-5 text-gray-600 font-mono text-xs">
                      {row.alarmCode}
                    </td>

                    <td className="px-6 py-5">
                      <PriorityBadge priority={row.priority} />
                    </td>

                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => setSelected(row)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-md border border-blue-200 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <svg
                        className="w-16 h-16 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>

                      <span className="text-lg font-medium">
                        {searched
                          ? "Query returned 0 results"
                          : "Ready for Analysis"}
                      </span>

                      <span className="text-xs max-w-[200px]">
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

        {results.length > 0 && !loading && (
          <AlarmPagination
            resultsLength={results.length}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            pageSizeOptions={pageSizeOptions}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>

      <AlarmDetailsOverlay data={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default AlarmTable;
