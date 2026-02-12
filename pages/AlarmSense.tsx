import React, { useState, useEffect, useMemo } from "react";
import { alarmService } from "../services/alarmService";
import { Site, Turbine, AlarmFilter, RootCauseResult } from "../types";

import AlarmSearchForm from "@/components/AlarmSearchForm";
import AlarmTable from "@/components/AlarmTable";

const PAGE_SIZE_OPTIONS = [5, 10, 25];

const AlarmSense: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [turbines, setTurbines] = useState<Turbine[]>([]);

  const [filter, setFilter] = useState<AlarmFilter>({
    siteId: "",
    turbineId: "",
    startDateTime: "",
    endDateTime: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<RootCauseResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Load sites
  useEffect(() => {
    const sub = alarmService.getSites().subscribe(setSites);
    return () => sub.unsubscribe();
  }, []);

  // Load turbines when site changes
  useEffect(() => {
    if (filter.siteId) {
      const sub = alarmService
        .getTurbinesBySite(filter.siteId)
        .subscribe(setTurbines);
      return () => sub.unsubscribe();
    } else {
      setTurbines([]);
    }
  }, [filter.siteId]);

  // Validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!filter.siteId) newErrors.siteId = "Required";
    if (!filter.turbineId) newErrors.turbineId = "Required";
    if (!filter.startDateTime) newErrors.startDateTime = "Required";
    if (!filter.endDateTime) newErrors.endDateTime = "Required";

    if (
      filter.startDateTime &&
      filter.endDateTime &&
      new Date(filter.endDateTime) < new Date(filter.startDateTime)
    ) {
      newErrors.endDateTime = "Invalid range";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSearched(true);

    alarmService.findRootCause(filter).subscribe((data) => {
      setResults(data);
      setCurrentPage(1);
      setLoading(false);
    });
  };

  // Input change
  const handleInputChange = (field: keyof AlarmFilter, value: string) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "siteId" ? { turbineId: "" } : {}),
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // Pagination slice
  const paginatedData = useMemo(() => {
    return results.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [results, currentPage, pageSize]);

  const totalPages = Math.ceil(results.length / pageSize);

  return (
    <div className="space-y-6">
      {/* SEARCH FORM COMPONENT */}
      <AlarmSearchForm
        sites={sites}
        turbines={turbines}
        filter={filter}
        errors={errors}
        loading={loading}
        onSubmit={handleSearch}
        onChange={handleInputChange}
      />

      {/* TABLE COMPONENT */}
      <AlarmTable
        results={results}
        paginatedData={paginatedData}
        loading={loading}
        searched={searched}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default AlarmSense;
