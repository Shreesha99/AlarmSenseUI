import React from "react";

interface Props {
  resultsLength: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const AlarmPagination: React.FC<Props> = ({
  resultsLength,
  currentPage,
  pageSize,
  totalPages,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}) => {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, resultsLength);

  return (
    <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
      {/* Left Info */}
      <div className="flex flex-col">
        <span className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
          Showing Records
        </span>
        <span className="text-sm font-medium text-gray-700 mt-1">
          {resultsLength > 0 ? (
            <>
              <span className="font-semibold text-gray-900">
                {start} - {end}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {resultsLength}
              </span>
            </>
          ) : (
            "0 results"
          )}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-6">
        {/* Page Size */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            Rows
          </span>

          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d1653]/20 focus:border-[#2d1653]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            {/* Chevron */}
            <svg
              className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center space-x-3">
          {/* Prev */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ←
          </button>

          {/* Page Indicator */}
          <div className="px-4 py-1.5 text-sm font-semibold bg-[#2d1653] text-white rounded-md shadow-sm">
            {currentPage}
          </div>

          <span className="text-sm text-gray-400 font-medium">
            of {totalPages || 1}
          </span>

          {/* Next */}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmPagination;
