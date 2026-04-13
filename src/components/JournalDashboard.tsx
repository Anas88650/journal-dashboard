"use client";

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  BarChart as BarChartIcon, 
  Activity,
  Layers,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Info,
  Globe,
  ExternalLink
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
const RATING_THEMES: Record<string, { bg: string, text: string, border: string, dot: string }> = {
  'A*': { bg: 'bg-indigo-50/50', text: 'text-indigo-700', border: 'border-indigo-200/50', dot: 'bg-indigo-500' },
  'A': { bg: 'bg-blue-50/50', text: 'text-blue-700', border: 'border-blue-200/50', dot: 'bg-blue-500' },
  'B': { bg: 'bg-emerald-50/50', text: 'text-emerald-700', border: 'border-emerald-200/50', dot: 'bg-emerald-500' },
  'C': { bg: 'bg-slate-50/50', text: 'text-slate-700', border: 'border-slate-200/50', dot: 'bg-slate-400' }
};

const CHART_COLORS = ['#4338ca', '#2563eb', '#10b981', '#94a3b8'];

export default function JournalDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(24);

  // Filtering logic
  const filteredJournals = useMemo(() => {
    return journalData.filter(j => {
      const matchesSearch = 
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (j.issn && j.issn.includes(searchTerm)) ||
        (j.eissn && j.eissn.includes(searchTerm)) ||
        j.publisher.toLowerCase().includes(searchTerm.toLowerCase());
      
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
    <div className="min-h-screen pb-20">
      
      {/* Top Header & Search Area */}
      <header className="sticky top-0 z-30 pt-6 px-4 md:px-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[2rem] p-3 shadow-2xl shadow-blue-900/10 flex flex-col md:flex-row items-center gap-3">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-[1.5rem] text-white shrink-0">
               <div className="bg-blue-500 p-1.5 rounded-lg shadow-lg shadow-blue-500/40">
                 <Layers size={18} />
               </div>
               <span className="font-black tracking-tighter text-lg uppercase pr-2 border-r border-slate-700">Journal IQ</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:inline">v2.1 Beta</span>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search 2,600+ Journals by Title, ISSN, or Publisher..."
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200/50 rounded-[1.5rem] focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => {
                   setSearchTerm(e.target.value);
                   setVisibleCount(24);
                }}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
               <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-4">
                  <Filter size={14} /> Filter
               </div>
               <div className="flex gap-2 flex-1 md:flex-none">
                  <select 
                    className="flex-1 md:w-44 bg-slate-100/50 border border-slate-200/50 rounded-[1.5rem] px-5 py-3 font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer appearance-none text-sm transition-all hover:bg-slate-200/50"
                    value={selectedRating}
                    onChange={(e) => {
                       setSelectedRating(e.target.value);
                       setVisibleCount(24);
                    }}
                  >
                    <option value="All">All Ratings</option>
                    {RATINGS.map(r => <option key={r} value={r}>ABDC Rank: {r}</option>)}
                  </select>
               </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 mt-6">
        
        {/* Statistics Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-6 duration-700">
          
          {/* Main Chart Card */}
          <div className="lg:col-span-3 glass rounded-[2.5rem] p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <BarChartIcon size={200} strokeWidth={1} />
             </div>
             <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <Activity className="text-blue-600" /> Metrics Visualization
                   </h2>
                   <p className="text-slate-500 font-medium text-sm mt-1">Real-time rank distribution based on active filters</p>
                </div>
                <div className="flex gap-4">
                   <div className="bg-white/80 border border-slate-200/50 px-5 py-2.5 rounded-2xl shadow-sm">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Matched</div>
                      <div className="text-xl font-black text-slate-900 tabular-nums">{filteredJournals.length}</div>
                   </div>
                </div>
             </div>
             
             <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} 
                    />
                    <Tooltip 
                      cursor={{fill: '#f1f5f9', radius: 12}}
                      contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px'}}
                      itemStyle={{fontWeight: 800, color: '#1e293b'}}
                      labelStyle={{fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '10px', color: '#64748b'}}
                    />
                    <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
             <div className="glass-dark rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] group-hover:bg-blue-400/30 transition-all duration-700"></div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
                   <Globe size={14} /> Global Rank
                </h3>
                <div className="space-y-5">
                   {chartData.map((d, idx) => (
                      <div key={d.name} className="flex items-center justify-between group/item">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs group-hover/item:bg-white/20 transition-colors">
                               {d.name}
                            </div>
                            <span className="text-sm font-bold text-slate-300">Rating {d.name}</span>
                         </div>
                         <div className="text-lg font-black tabular-nums">{d.count}</div>
                      </div>
                   ))}
                </div>
                <button className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]">
                   Export Dataset
                </button>
             </div>
          </div>
        </section>

        {/* Journal Cards Grid */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                 <BookOpen size={14} /> Latest Publications ({filteredJournals.length})
              </h3>
              <div className="text-[10px] font-bold text-slate-400">Sort by: <span className="text-blue-600 cursor-pointer">Relevance</span></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJournals.slice(0, visibleCount).map((j, idx) => {
                const theme = RATING_THEMES[j.abdc_rating] || RATING_THEMES['C'];
                return (
                  <div 
                    key={j.issn || j.title + idx}
                    className="group glass rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 relative border-transparent hover:border-blue-500/20 flex flex-col"
                  >
                    {/* Card Header: Rating Badge */}
                    <div className="flex justify-between items-start mb-5">
                       <div className={cn("px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2", theme.bg, theme.text, "border", theme.border)}>
                          <span className={cn("w-2 h-2 rounded-full", theme.dot)}></span>
                          ABDC {j.abdc_rating}
                       </div>
                       {j.scopus_info && (
                          <div className={cn(
                            "px-3 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider",
                            j.scopus_info.Scopus_Status.toLowerCase().includes('active') ? "bg-green-50 text-green-700 border border-green-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                          )}>
                             {j.scopus_info.Scopus_Status}
                          </div>
                       )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                       <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2" title={j.title}>
                          {j.title}
                       </h4>
                       <p className="text-sm font-bold text-slate-400 line-clamp-1">{j.publisher}</p>
                       
                       <div className="flex flex-wrap gap-2 pt-2">
                          {j.issn && (
                            <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500">ISSN: {j.issn}</div>
                          )}
                          {j.eissn && (
                            <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500">E-ISSN: {j.eissn}</div>
                          )}
                       </div>
                    </div>

                    {/* Footer / Meta */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">FoR Code</span>
                          <span className="text-xs font-bold text-slate-600">{j.for_code}</span>
                       </div>
                       <button className="p-3 bg-slate-900 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 shadow-xl shadow-slate-900/10">
                          <ArrowRight size={16} />
                       </button>
                    </div>
                  </div>
                );
              })}
           </div>

           {/* Load More */}
           {filteredJournals.length > visibleCount && (
              <div className="flex justify-center pt-12 pb-8">
                 <button 
                   onClick={() => setVisibleCount(prev => prev + 24)}
                   className="flex items-center gap-3 px-10 py-5 bg-white shadow-xl shadow-slate-200/50 border border-slate-200/50 rounded-[2rem] font-black text-slate-900 hover:bg-slate-50 hover:shadow-2xl transition-all active:scale-[0.98] group"
                 >
                    Load More Journals
                    <ChevronDown size={20} className="text-blue-500 group-hover:translate-y-1 transition-transform" />
                 </button>
              </div>
           )}

           {filteredJournals.length === 0 && (
              <div className="glass rounded-[3rem] p-32 text-center">
                 <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Search size={40} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Zero matches for your query</h3>
                 <p className="text-slate-500 font-medium mt-2">Try adjusting your filters or refining your search term.</p>
                 <button 
                   onClick={() => {setSearchTerm(''); setSelectedRating('All');}}
                   className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/30 hover:bg-blue-500 transition-all"
                 >
                   Reset Filters
                 </button>
              </div>
           )}
        </section>
      </main>

      {/* Info Badge */}
      <footer className="fixed bottom-6 right-6 z-50">
         <div className="glass p-2 rounded-full flex items-center gap-2 shadow-2xl border-white/50">
            <div className="bg-slate-900 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors group">
               <Info size={16} />
               <div className="absolute bottom-full right-0 mb-4 w-64 glass p-6 rounded-[2rem] shadow-2xl invisible group-hover:visible animate-in fade-in slide-in-from-bottom-2">
                  <h5 className="font-black text-slate-900 mb-2">About Journal IQ</h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    This dashboard synthesizes the 2025 ABDC Journal Quality List and the Oct 2024 Scopus Source List. Data is processed locally and optimized for discovery.
                  </p>
               </div>
            </div>
         </div>
      </footer>

    </div>
  );
}
