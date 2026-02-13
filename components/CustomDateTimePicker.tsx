import React, { useState, useRef, useEffect } from "react";
import CustomButton from "@/components/CustomButton";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

const CustomDateTimePicker: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Select date & time",
  error = false,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const initialDate = value ? new Date(value) : null;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [viewDate, setViewDate] = useState<Date>(initialDate || new Date());

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate calendar grid
  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);

  const endOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0
  );

  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const days: (Date | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
  }

  const handleSelectDate = (date: Date) => {
    const updated = new Date(date);
    if (selectedDate) {
      updated.setHours(selectedDate.getHours());
      updated.setMinutes(selectedDate.getMinutes());
    }
    setSelectedDate(updated);
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    if (!selectedDate) return;

    const updated = new Date(selectedDate);
    updated.setHours(hours);
    updated.setMinutes(minutes);
    setSelectedDate(updated);
  };

  const confirmSelection = () => {
    if (selectedDate) {
      onChange(selectedDate.toISOString());
    }
    setIsOpen(false);
  };

  const formatDisplay = () => {
    if (!selectedDate) return placeholder;
    return selectedDate.toLocaleString();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`px-3 py-2 border rounded text-sm cursor-pointer transition-all
        ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:border-[#00646C] hover:ring-1 hover:ring-[#00646C]/20"
        }
        ${error ? "border-red-400 ring-1 ring-red-100" : "border-gray-300"}
        `}
      >
        {formatDisplay()}
      </div>

      {/* Panel */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-[300px]">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-3">
            <button
              type="button"
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
                )
              }
              className="px-2 py-1 text-sm hover:bg-[#00646C]/10 rounded transition"
            >
              ‹
            </button>

            <span className="text-sm font-semibold">
              {viewDate.toLocaleString("default", {
                month: "long",
              })}{" "}
              {viewDate.getFullYear()}
            </span>

            <button
              type="button"
              onClick={() =>
                setViewDate(
                  new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
                )
              }
              className="px-2 py-1 text-sm hover:bg-[#00646C]/10 rounded transition"
            >
              ›
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {days.map((date, index) => (
              <div key={index} className="text-center">
                {date ? (
                  <button
                    type="button"
                    onClick={() => handleSelectDate(date)}
                    className={`w-8 h-8 text-sm rounded-full transition-all
                    ${
                      selectedDate &&
                      date.toDateString() === selectedDate.toDateString()
                        ? "bg-[#00646C] text-white"
                        : "hover:bg-gray-100"
                    }
                    `}
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            ))}
          </div>

          {/* Time Selector */}
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              min={0}
              max={23}
              value={selectedDate?.getHours() ?? ""}
              onChange={(e) =>
                handleTimeChange(
                  Number(e.target.value),
                  selectedDate?.getMinutes() ?? 0
                )
              }
              className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#00646C] focus:border-[#00646C]"
              placeholder="HH"
            />
            <input
              type="number"
              min={0}
              max={59}
              value={selectedDate?.getMinutes() ?? ""}
              onChange={(e) =>
                handleTimeChange(
                  selectedDate?.getHours() ?? 0,
                  Number(e.target.value)
                )
              }
              className="w-1/2 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#00646C] focus:border-[#00646C]"
              placeholder="MM"
            />
          </div>

          <CustomButton
            type="button"
            variant="primary"
            size="md"
            fullWidth
            onClick={confirmSelection}
          >
            Apply
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default CustomDateTimePicker;
