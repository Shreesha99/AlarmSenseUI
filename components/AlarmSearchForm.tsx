import React from "react";
import { Site, Turbine, AlarmFilter } from "../types";
import CustomDropdown from "@/components/CustomDropdown";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import CustomButton from "@/components/CustomButton";

interface Props {
  sites: Site[];
  turbines: Turbine[];
  filter: AlarmFilter;
  errors: { [key: string]: string };
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof AlarmFilter, value: string) => void;
}

const AlarmSearchForm: React.FC<Props> = ({
  sites,
  turbines,
  filter,
  errors,
  loading,
  onSubmit,
  onChange,
}) => {
  // Convert to dropdown options
  const siteOptions = sites.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const turbineOptions = turbines.map((t) => ({
    label: t.name,
    value: t.id,
  }));

  return (
    <div className="bg-white rounded-md border border-gray-200">
      <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center">
        <div className="w-1 h-4 bg-[#00646C] rounded-full mr-2"></div>
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">
          Root Cause Investigation
        </h2>
      </div>

      <form
        onSubmit={onSubmit}
        className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6"
      >
        <div className="sm:col-span-1 lg:col-span-2 flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
            Site Location
          </label>
          <CustomDropdown
            value={filter.siteId}
            options={siteOptions}
            placeholder="Select Site"
            error={!!errors.siteId}
            onChange={(val) => onChange("siteId", val)}
          />
        </div>

        <div className="sm:col-span-1 lg:col-span-2 flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
            Asset / Turbine
          </label>
          <CustomDropdown
            value={filter.turbineId}
            options={turbineOptions}
            placeholder="Select Asset"
            disabled={!filter.siteId}
            disabledTooltip="Please select a site first"
            error={!!errors.turbineId}
            onChange={(val) => onChange("turbineId", val)}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
            Analysis Window Start
          </label>
          <CustomDateTimePicker
            value={filter.startDateTime}
            onChange={(val) => onChange("startDateTime", val)}
            error={!!errors.startDateTime}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-3 flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
            Analysis Window End
          </label>
          <CustomDateTimePicker
            value={filter.endDateTime}
            onChange={(val) => onChange("endDateTime", val)}
            error={!!errors.endDateTime}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-2 flex items-end">
          <CustomButton
            type="submit"
            loading={loading}
            fullWidth
            size="md"
            variant="primary"
          >
            Run Analysis
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default AlarmSearchForm;
