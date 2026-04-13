"use client";

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BarChart as BarChartIcon, 
  Table as TableIcon,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Journal } from '@/types/journal';
import journalDataRaw from '@/data/journals.json';
import { cn } from '@/lib/utils';

const journalData = journalDataRaw as Journal[];

const RATINGS = ['A*', 'A', 'B', 'C'];
const RATING_COLORS: Record<string, string> = {
  'A*': '#1e40af', // Blue-800
  'A': '#2563eb',  // Blue-600
  'B': '#60a5fa',  // Blue-400
  'C': '#93c5fd'   // Blue-300
};

export default function JournalDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [showCharts, setShowCharts] = useState(true);
  const [expandedJournal, setExpandedJournal] = useState<string | null>(null);

  // Filtering logic
  const filteredJournals = useMemo(() => {
    return journalData.filter(j => {
      const matchesSearch = 
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (j.issn && j.issn.includes(searchTerm)) ||
        (j.eissn && j.eissn.includes(searchTerm));
      
      const matchesRating = selectedRating === 'All' || j.abdc_rating === selectedRating;
      
      return matchesSearch && matchesRating;
    });
  }, [searchTerm, selectedRating]);

  // Chart data
  const chartData = useMemo(() => {
    const counts = filteredJournals.reduce((acc, j) => {
      const r = j.abdc_rating;
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return RATINGS.map(r => ({
      name: r,
      count: counts[r] || 0
    }));
  }, [filteredJournals]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Journal Navigator</h1>
            <p className="text-slate-500 mt-1 font-medium">ABDC 2025 + Scopus Oct 2024 Integrated Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowCharts(!showCharts)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all",
                showCharts ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {showCharts ? <TableIcon size={18} /> : <BarChartIcon size={18} />}
              {showCharts ? "Hide Statistics" : "Show Statistics"}
            </button>
          </div>
        </div>

        {/* Stats & Charts */}
        {showCharts && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[300px]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                <BarChartIcon size={16} /> Rating Distribution
              </h3>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={RATING_COLORS[entry.name]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl shadow-xl text-white flex flex-col justify-center">
              <p className="text-blue-100 font-semibold uppercase tracking-widest text-xs mb-2">Total Journals Found</p>
              <div className="text-6xl font-black mb-4 tabular-nums">{filteredJournals.length}</div>
              <div className="space-y-3 mt-4">
                {chartData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor: RATING_COLORS[d.name]}}></span>
                      Rating {d.name}
                    </span>
                    <span className="font-mono font-bold">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by Title, ISSN or Publisher..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="text-slate-400" size={18} />
            <select 
              className="flex-1 md:w-48 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="All">All ABDC Ratings</option>
              {RATINGS.map(r => <option key={r} value={r}>Rating {r}</option>)}
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-1/2">Journal Information</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">ABDC Rating</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Scopus Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJournals.slice(0, 100).map((j, idx) => (
                  <React.Fragment key={j.issn || j.title + idx}>
                    <tr 
                      className={cn(
                        "hover:bg-blue-50/50 transition-colors cursor-pointer group",
                        expandedJournal === j.title ? "bg-blue-50/50" : ""
                      )}
                      onClick={() => setExpandedJournal(expandedJournal === j.title ? null : j.title)}
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{j.title}</div>
                        <div className="text-sm text-slate-500 font-medium mt-0.5">{j.publisher}</div>
                        <div className="flex gap-3 mt-2">
                           {j.issn && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">ISSN: {j.issn}</span>}
                           {j.eissn && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">E-ISSN: {j.eissn}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={cn(
                          "inline-block px-4 py-1.5 rounded-full text-sm font-black",
                          j.abdc_rating === 'A*' ? "bg-blue-100 text-blue-700" :
                          j.abdc_rating === 'A' ? "bg-indigo-100 text-indigo-700" :
                          j.abdc_rating === 'B' ? "bg-emerald-100 text-emerald-700" :
                          "bg-slate-100 text-slate-700"
                        )}>
                          {j.abdc_rating}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {j.scopus_info ? (
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-xs font-bold uppercase",
                            j.scopus_info.Scopus_Status.toLowerCase().includes('active') ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          )}>
                            {j.scopus_info.Scopus_Status}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs font-medium italic">Not Found in Scopus</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {expandedJournal === j.title ? <ChevronUp className="text-blue-500" /> : <ChevronDown className="text-slate-300 group-hover:text-blue-400" />}
                      </td>
                    </tr>
                    
                    {/* Expanded Detail View */}
                    {expandedJournal === j.title && (
                      <tr className="bg-white">
                        <td colSpan={4} className="px-6 py-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                            <div className="space-y-6">
                              <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                                  <Info size={14} /> ABDC Classification
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-slate-50 p-4 rounded-xl">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">FoR Code</div>
                                    <div className="text-lg font-bold text-slate-700">{j.for_code}</div>
                                  </div>
                                  <div className="bg-slate-50 p-4 rounded-xl">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">ABDC Rank</div>
                                    <div className="text-lg font-bold text-slate-700">{j.abdc_rating}</div>
                                  </div>
                                </div>
                              </div>
                              <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                View official ABDC page <ExternalLink size={14} />
                              </button>
                            </div>
                            
                            <div className="space-y-6">
                              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                                <Info size={14} /> Scopus Metadata
                              </h4>
                              {j.scopus_info ? (
                                <div className="space-y-4">
                                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                    <div className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">Mapped Title</div>
                                    <div className="text-sm font-bold text-slate-700">{j.scopus_info.Scopus_Title}</div>
                                  </div>
                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                                      <span className="text-slate-500 font-medium">Economics/Finance Subject</span>
                                      <span className="font-bold">{j.scopus_info.Economics_Finance || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                                      <span className="text-slate-500 font-medium">Business/Mgmt Subject</span>
                                      <span className="font-bold">{j.scopus_info.Business_Management || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-slate-500 font-medium">ASJC Codes</span>
                                      <span className="font-mono text-xs font-bold text-slate-600">{j.scopus_info.ASJC}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-slate-50 p-8 rounded-xl text-center">
                                  <p className="text-sm text-slate-400 font-medium italic">No extended Scopus data available for this journal.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredJournals.length > 100 && (
            <div className="p-6 bg-slate-50 text-center text-sm font-bold text-slate-500 border-t border-slate-200">
              Showing top 100 results. Refine your search to find more.
            </div>
          )}
          
          {filteredJournals.length === 0 && (
            <div className="p-20 text-center">
              <div className="text-slate-300 mb-4 flex justify-center"><Search size={48} /></div>
              <h3 className="text-xl font-bold text-slate-900">No journals found</h3>
              <p className="text-slate-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
