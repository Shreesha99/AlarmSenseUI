import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  value: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  disabledTooltip?: string;
  onChange: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  options,
  placeholder = "Select",
  disabled = false,
  error = false,
  disabledTooltip,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

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

  // Keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen && (e.key === "Enter" || e.key === "ArrowDown")) {
      setIsOpen(true);
      return;
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    }

    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter" && highlightIndex >= 0) {
      onChange(options[highlightIndex].value);
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      className={`relative w-full ${disabled ? "cursor-not-allowed" : ""}`}
    >
      {/* Trigger */}
      <div
        onMouseEnter={() => disabled && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`flex items-center justify-between px-3 py-2 text-sm border rounded transition-all
        ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:border-[#00646C] focus:border-[#00646C] cursor-pointer"
        }
        ${error ? "border-red-400 ring-1 ring-red-100" : "border-gray-300"}
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform text-gray-500 ${
            isOpen ? "rotate-180 text-[#00646C]" : ""
          }`}
        />
      </div>

      {/* Disabled Tooltip */}
      {disabled && showTooltip && disabledTooltip && (
        <div className="absolute z-[60] mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-md whitespace-nowrap">
          {disabledTooltip}
        </div>
      )}

      {/* Dropdown List */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">No options</div>
          ) : (
            options.map((opt, index) => (
              <div
                key={opt.value}
                onMouseEnter={() => setHighlightIndex(index)}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors
                ${
                  index === highlightIndex
                    ? "bg-[#00646C]/10 text-[#00646C]"
                    : "hover:bg-gray-50"
                }
                ${
                  opt.value === value
                    ? "font-semibold text-gray-900"
                    : "text-gray-700"
                }
                `}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
