
import React, { useState, useEffect, useMemo } from 'react';
import { alarmService } from '../services/alarmService';
import { Site, Turbine, AlarmFilter, RootCauseResult } from '../types';

const PAGE_SIZE_OPTIONS = [5, 10, 25];

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const styles = {
    High: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    Medium: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    Low: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  }[priority] || { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' };

  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.bg} ${styles.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${styles.dot}`}></span>
      {priority}
    </div>
  );
};

const AlarmSense: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [turbines, setTurbines] = useState<Turbine[]>([]);
  const [filter, setFilter] = useState<AlarmFilter>({
    siteId: '',
    turbineId: '',
    startDateTime: '',
    endDateTime: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<RootCauseResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const sub = alarmService.getSites().subscribe(setSites);
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    if (filter.siteId) {
      const sub = alarmService.getTurbinesBySite(filter.siteId).subscribe(setTurbines);
      return () => sub.unsubscribe();
    } else {
      setTurbines([]);
    }
  }, [filter.siteId]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!filter.siteId) newErrors.siteId = 'Required';
    if (!filter.turbineId) newErrors.turbineId = 'Required';
    if (!filter.startDateTime) newErrors.startDateTime = 'Required';
    if (!filter.endDateTime) newErrors.endDateTime = 'Required';
    if (filter.startDateTime && filter.endDateTime && new Date(filter.endDateTime) < new Date(filter.startDateTime)) {
      newErrors.endDateTime = 'Invalid range';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleInputChange = (field: keyof AlarmFilter, value: string) => {
    setFilter(prev => ({ ...prev, [field]: value, ...(field === 'siteId' ? { turbineId: '' } : {}) }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const paginatedData = useMemo(() => results.slice((currentPage - 1) * pageSize, currentPage * pageSize), [results, currentPage, pageSize]);
  const totalPages = Math.ceil(results.length / pageSize);

  return (
    <div className="space-y-6">
      {/* Search Bar - Siemens Style */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Root Cause Investigation</h2>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">VERSION 2.4.0</span>
        </div>
        
        <form onSubmit={handleSearch} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-2 flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Site Location</label>
            <select 
              className={`border rounded px-3 py-2 text-sm bg-gray-50/50 outline-none transition-all ${errors.siteId ? 'border-red-400 ring-1 ring-red-100' : 'border-gray-300'}`}
              value={filter.siteId}
              onChange={(e) => handleInputChange('siteId', e.target.value)}
            >
              <option value="">Select Site...</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="lg:col-span-2 flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Asset / Turbine</label>
            <select 
              className={`border rounded px-3 py-2 text-sm bg-gray-50/50 outline-none transition-all ${errors.turbineId ? 'border-red-400 ring-1 ring-red-100' : 'border-gray-300'}`}
              value={filter.turbineId}
              onChange={(e) => handleInputChange('turbineId', e.target.value)}
              disabled={!filter.siteId}
            >
              <option value="">Select Asset...</option>
              {turbines.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="lg:col-span-3 flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Analysis Window Start</label>
            <input 
              type="datetime-local" 
              className={`border rounded px-3 py-2 text-sm bg-gray-50/50 outline-none transition-all ${errors.startDateTime ? 'border-red-400 ring-1 ring-red-100' : 'border-gray-300'}`}
              value={filter.startDateTime}
              onChange={(e) => handleInputChange('startDateTime', e.target.value)}
            />
          </div>

          <div className="lg:col-span-3 flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Analysis Window End</label>
            <input 
              type="datetime-local" 
              className={`border rounded px-3 py-2 text-sm bg-gray-50/50 outline-none transition-all ${errors.endDateTime ? 'border-red-400 ring-1 ring-red-100' : 'border-gray-300'}`}
              value={filter.endDateTime}
              onChange={(e) => handleInputChange('endDateTime', e.target.value)}
            />
          </div>

          <div className="lg:col-span-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#00646c] hover:bg-[#004d53] text-white font-bold py-2 px-4 rounded shadow-md transition-all active:transform active:scale-[0.98] disabled:bg-gray-300 flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>RUN ANALYSIS</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Grid Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col min-h-[500px] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-700">Root Cause Candidates</span>
            <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-sm">{results.length} ENTRIES</div>
          </div>
          <div className="flex space-x-2">
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Export CSV">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8f9fa] text-gray-500 text-[10px] font-bold uppercase tracking-widest border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-bold">Time Window</th>
                <th className="px-6 py-4 font-bold">Identified Root Cause</th>
                <th className="px-6 py-4 font-bold">Alarm Code</th>
                <th className="px-6 py-4 font-bold">Domain Class</th>
                <th className="px-6 py-4 font-bold">Priority</th>
                <th className="px-6 py-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4 bg-gray-50/30">
                       <div className="h-4 bg-gray-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : searched && results.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="mono text-xs text-gray-900 font-medium">{row.startTime}</span>
                        <span className="mono text-[10px] text-gray-400">{row.endTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{row.rootCauseName}</td>
                    <td className="px-6 py-4">
                      <span className="mono px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{row.alarmCode}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs italic">{row.class}</td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={row.priority} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 font-bold text-[10px] uppercase hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={6} className="px-6 py-32 text-center">
                     <div className="flex flex-col items-center opacity-30">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span className="text-lg font-medium">{searched ? 'Query returned 0 results' : 'Ready for Analysis'}</span>
                        <span className="text-xs max-w-[200px]">Adjust filters and execute the search to populate the investigation grid.</span>
                     </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {results.length > 0 && !loading && (
          <div className="px-6 py-4 bg-[#f8f9fa] border-t border-gray-200 flex items-center justify-between">
            <div className="text-[11px] text-gray-500 font-medium">
              SHOWING <span className="font-bold text-gray-800">{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, results.length)}</span> OF <span className="font-bold text-gray-800">{results.length}</span> INVESTIGATIONS
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-[11px] font-bold text-gray-400 uppercase">
                <span>Display:</span>
                <select 
                  className="bg-transparent border-none focus:ring-0 text-gray-800 cursor-pointer"
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                >
                  {PAGE_SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path></svg>
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold hover:bg-gray-50 disabled:opacity-30"
                >
                  PREV
                </button>
                <div className="px-4 py-1.5 bg-[#00646c] text-white text-xs font-bold rounded shadow-sm">
                  PAGE {currentPage}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold hover:bg-gray-50 disabled:opacity-30"
                >
                  NEXT
                </button>
                <button 
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0zm6 0a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlarmSense;
