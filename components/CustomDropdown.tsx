import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
} from "react";
import { ChevronDown, Search, X } from "lucide-react";

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
  const [openUpwards, setOpenUpwards] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  /* ---------------- Outside click ---------------- */
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

  /* ---------------- Auto flip ---------------- */
  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const estimatedHeight = 280;

    setOpenUpwards(spaceBelow < estimatedHeight);
  }, [isOpen]);

  /* ---------------- Debounce search ---------------- */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  /* ---------------- Filtered options ---------------- */
  const filteredOptions = useMemo(() => {
    if (!debouncedSearch.trim()) return options;

    const query = debouncedSearch.toLowerCase();

    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, debouncedSearch]);

  /* ---------------- Reset highlight on search ---------------- */
  useEffect(() => {
    setHighlightIndex(filteredOptions.length > 0 ? 0 : -1);
  }, [debouncedSearch, filteredOptions.length]);

  /* ---------------- Focus search on open ---------------- */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 0);
    } else {
      setSearchTerm("");
      setDebouncedSearch("");
    }
  }, [isOpen]);

  /* ---------------- Keyboard support ---------------- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === "ArrowUp") {
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }

      if (e.key === "Enter" && highlightIndex >= 0) {
        onChange(filteredOptions[highlightIndex].value);
        setIsOpen(false);
      }
    },
    [disabled, isOpen, filteredOptions, highlightIndex, onChange]
  );

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
            : "bg-white hover:border-[#00646C] cursor-pointer"
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

      {/* Tooltip */}
      {disabled && showTooltip && disabledTooltip && (
        <div className="absolute z-[60] mt-2 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-md whitespace-nowrap">
          {disabledTooltip}
        </div>
      )}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          className={`absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-72 overflow-hidden
            ${openUpwards ? "bottom-full mb-1" : "top-full mt-1"}
          `}
        >
          {/* Search */}
          <div className="px-3 py-2 border-b bg-white">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:border-[#00646C] focus-within:ring-2 focus-within:ring-[#00646C]/15 transition-all duration-150">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />

              <input
                ref={searchRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full text-sm bg-transparent border-0 outline-none appearance-none focus:outline-none focus:ring-0 !shadow-none"
                style={{ boxShadow: "none !important" as any }}
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-3 text-sm text-gray-400 text-center">
                No matching results
              </div>
            ) : (
              filteredOptions.map((opt, index) => (
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
        </div>
      )}
      <style>
        {`
  .dropdown-search-input:focus {
    box-shadow: none !important;
  }
`}
      </style>
    </div>
  );
};

export default CustomDropdown;
