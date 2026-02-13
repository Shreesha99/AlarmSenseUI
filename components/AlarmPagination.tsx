import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

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
    <div className="px-4 sm:px-6 py-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      {/* Left Info */}
      <div className="flex flex-col text-center sm:text-left">
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

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Page Size */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            Rows
          </span>

          <div className="w-24">
            <CustomDropdown
              value={String(pageSize)}
              options={pageSizeOptions.map((opt) => ({
                label: String(opt),
                value: String(opt),
              }))}
              onChange={(val) => onPageSizeChange(Number(val))}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="px-4 py-1.5 text-sm font-semibold bg-[#2d1653] text-white rounded-md shadow-sm">
            {currentPage}
          </div>

          <span className="text-sm text-gray-400 font-medium">
            of {totalPages || 1}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmPagination;
