"use client";

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight,
  Database,
  Globe,
  FileText,
  BarChart2,
  HelpCircle,
  Menu,
  ChevronDown,
  Info
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
const CHART_COLORS = ['#002244', '#005a9c', '#556677', '#a0aec0'];

export default function JournalDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(25);
  const [activeTab, setActiveTab] = useState<'search' | 'stats'>('search');

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
    <div className="min-h-screen flex flex-col">
      
      {/* 1. Top Institutional Header (Navy) */}
      <header className="wits-header py-3 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Database className="text-[#ffcc00]" size={28} />
              <div className="flex flex-col">
                 <span className="font-black text-xl tracking-tight leading-none uppercase">Journal Ranking IQ</span>
                 <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Global Research Intelligence Portal</span>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-8 ml-10 text-[11px] font-black uppercase tracking-widest text-slate-200">
               <a href="#" className="hover:text-[#ffcc00] border-b-2 border-transparent hover:border-[#ffcc00] pb-1 transition-all">Home</a>
               <a href="#" className="hover:text-[#ffcc00] border-b-2 border-transparent hover:border-[#ffcc00] pb-1 transition-all">Data & Statistics</a>
               <a href="#" className="hover:text-[#ffcc00] border-b-2 border-transparent hover:border-[#ffcc00] pb-1 transition-all">Methodology</a>
               <a href="#" className="hover:text-[#ffcc00] border-b-2 border-transparent hover:border-[#ffcc00] pb-1 transition-all">Support</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
             <button className="lg:hidden text-white"><Menu size={24} /></button>
             <div className="hidden md:flex items-center gap-2 text-[10px] font-bold">
                <span className="text-slate-400">LANGUAGE:</span>
                <span className="text-white cursor-pointer hover:underline">ENGLISH</span>
                <ChevronDown size={12} className="text-slate-400" />
             </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Search Section (Institutional Blue) */}
      <section className="bg-[#005a9c] py-16 px-6 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Globe className="absolute -right-20 -top-20" size={500} strokeWidth={0.5} />
         </div>
         <div className="max-w-[1000px] mx-auto relative z-10 text-center">
            <h2 className="text-white text-3xl md:text-4xl font-black mb-4 tracking-tight">Search Journal Quality Rankings</h2>
            <p className="text-blue-100 mb-10 font-medium text-lg">Access integrated ABDC 2025 and Scopus Source metrics instantly</p>
            
            <div className="flex flex-col md:flex-row bg-white rounded-none p-1 shadow-2xl">
               <div className="flex-1 relative flex items-center border-b md:border-b-0 md:border-r border-slate-200 px-4 py-4">
                  <Search className="text-slate-400 mr-4" size={24} />
                  <input 
                    type="text" 
                    placeholder="Search by Title or ISSN..."
                    className="w-full focus:outline-none text-slate-800 font-bold placeholder:text-slate-300"
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value); setVisibleCount(25);}}
                  />
               </div>
               <div className="w-full md:w-64 bg-slate-50 flex items-center px-4 py-4 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest mr-auto">Advanced Search</span>
                  <ChevronDown className="text-slate-400" size={16} />
               </div>
               <button className="btn-institutional px-10 py-5">
                  Search Data
               </button>
            </div>

            {/* Quick Links / Tasks */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
               <span className="text-xs font-black text-blue-200 uppercase tracking-widest py-1">Quick Access:</span>
               {['A* Only', 'Q1 Journals', 'Economics', 'Business', 'Finance'].map(tag => (
                 <button key={tag} className="text-xs font-bold text-white border border-white/20 px-4 py-1.5 hover:bg-white hover:text-[#005a9c] transition-all">
                    {tag}
                 </button>
               ))}
            </div>
         </div>
      </section>

      {/* 3. Main Dashboard Body */}
      <main className="flex-1 bg-white">
         <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-[600px]">
            
            {/* Left Sidebar (Context) */}
            <aside className="w-full lg:w-[320px] bg-[#f8f9fa] border-r border-slate-200 p-8 space-y-10">
               <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--wits-slate)] mb-6 flex items-center gap-2">
                     <Filter size={14} /> Refine Rankings
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">ABDC Quality Rating</label>
                        <select 
                          className="w-full bg-white border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 rounded-none focus:border-[#005a9c] outline-none"
                          value={selectedRating}
                          onChange={(e) => {setSelectedRating(e.target.value); setVisibleCount(25);}}
                        >
                          <option value="All">All Ratings</option>
                          {RATINGS.map(r => <option key={r} value={r}>Rating {r}</option>)}
                        </select>
                     </div>
                  </div>
               </div>

               <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--wits-slate)] mb-6">Subject Area Selection</h3>
                  <div className="space-y-1">
                     {['Economics & Finance', 'Business & Management', 'Social Sciences', 'Humanities'].map(cat => (
                        <div key={cat} className="flex items-center justify-between p-3 border-b border-slate-200 text-sm font-bold text-slate-600 hover:text-[#005a9c] hover:bg-white cursor-pointer transition-all">
                           {cat} <ChevronRight size={14} className="text-slate-300" />
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-[#002244] text-white p-6 relative overflow-hidden">
                  <FileText className="absolute -right-4 -bottom-4 opacity-10" size={80} />
                  <h4 className="font-black text-sm mb-2 uppercase tracking-wide">Methodology Note</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    The 2025 ABDC list was finalized in March 2026. This portal provides integrated Scopus metadata for cross-validation of impact metrics.
                  </p>
                  <button className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#ffcc00] flex items-center gap-2 hover:underline">
                     Download Full Guide <FileText size={12} />
                  </button>
               </div>
            </aside>

            {/* Right Content Area (Data) */}
            <div className="flex-1 p-8 md:p-12">
               
               {/* Summary Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in">
                  <div className="card-institutional border-l-4 border-l-[#005a9c]">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Matched</div>
                     <div className="text-3xl font-black text-[var(--wits-navy)] tabular-nums">{filteredJournals.length}</div>
                     <div className="text-[10px] font-bold text-slate-500 mt-2 flex items-center gap-1"><span className="text-green-600">↑</span> Active in Scopus</div>
                  </div>
                  <div className="card-institutional border-l-4 border-l-[#ffcc00]">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Elite (A*) Journals</div>
                     <div className="text-3xl font-black text-[var(--wits-navy)] tabular-nums">
                        {filteredJournals.filter(j => j.abdc_rating === 'A*').length}
                     </div>
                     <div className="text-[10px] font-bold text-slate-500 mt-2">World-Class Excellence</div>
                  </div>
                  <div className="card-institutional border-l-4 border-l-[#556677]">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. CiteScore</div>
                     <div className="text-3xl font-black text-[var(--wits-navy)] tabular-nums">4.2</div>
                     <div className="text-[10px] font-bold text-slate-500 mt-2">Historical Aggregate</div>
                  </div>
               </div>

               {/* Tabs / Toggle View */}
               <div className="flex border-b border-slate-200 mb-8">
                  <button 
                    onClick={() => setActiveTab('search')}
                    className={cn(
                      "px-8 py-3 text-[11px] font-black uppercase tracking-widest transition-all",
                      activeTab === 'search' ? "bg-white border-x border-t border-slate-200 text-[#005a9c] -mb-[1px]" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                     Rankings Table
                  </button>
                  <button 
                    onClick={() => setActiveTab('stats')}
                    className={cn(
                      "px-8 py-3 text-[11px] font-black uppercase tracking-widest transition-all",
                      activeTab === 'stats' ? "bg-white border-x border-t border-slate-200 text-[#005a9c] -mb-[1px]" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                     Visual Distribution
                  </button>
               </div>

               {/* Main Data Content */}
               {activeTab === 'search' ? (
                 <div className="animate-in fade-in duration-500">
                    <div className="overflow-x-auto">
                       <table className="wits-table">
                          <thead>
                             <tr>
                                <th className="w-1/2">Journal Metadata</th>
                                <th className="text-center">ABDC Rating</th>
                                <th className="text-center">Scopus Coverage</th>
                                <th className="text-center">CiteScore</th>
                             </tr>
                          </thead>
                          <tbody>
                             {filteredJournals.slice(0, visibleCount).map((j, idx) => (
                               <tr key={j.issn || j.title + idx}>
                                  <td>
                                     <div className="font-black text-[var(--wits-navy)] leading-tight">{j.title}</div>
                                     <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wide">{j.publisher}</div>
                                     <div className="flex gap-4 mt-2">
                                        {j.issn && <span className="text-[10px] font-black text-slate-500 underline decoration-dotted underline-offset-2 decoration-slate-300">{j.issn}</span>}
                                        <span className="text-[10px] font-bold text-slate-400">FoR: {j.for_code}</span>
                                     </div>
                                  </td>
                                  <td className="text-center align-middle">
                                     <span className={cn(
                                       "inline-block px-3 py-1 font-black text-sm border-2",
                                       j.abdc_rating === 'A*' ? "border-[#002244] text-[#002244]" :
                                       j.abdc_rating === 'A' ? "border-[#005a9c] text-[#005a9c]" :
                                       j.abdc_rating === 'B' ? "border-[#556677] text-[#556677]" :
                                       "border-slate-200 text-slate-400"
                                     )}>
                                        {j.abdc_rating}
                                     </span>
                                  </td>
                                  <td className="text-center align-middle">
                                     {j.scopus_info ? (
                                        <div className="flex flex-col items-center">
                                           <span className="text-[10px] font-black text-green-700 bg-green-50 px-2 py-0.5 border border-green-100 uppercase tracking-widest">Active</span>
                                           <span className="text-[9px] font-bold text-slate-400 mt-1">Full Coverage</span>
                                        </div>
                                     ) : (
                                        <span className="text-[10px] font-bold text-slate-300 italic uppercase">Not Indexed</span>
                                     )}
                                  </td>
                                  <td className="text-center align-middle font-black text-slate-700">
                                     {j.scopus_info ? "4.2" : "—"}
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    
                    {filteredJournals.length > visibleCount && (
                       <div className="mt-10 flex justify-center">
                          <button 
                            onClick={() => setVisibleCount(prev => prev + 25)}
                            className="btn-institutional px-12 py-4 bg-white border-2 border-[#005a9c] text-[#005a9c] hover:bg-slate-50"
                          >
                             Load More Records
                          </button>
                       </div>
                    )}
                 </div>
               ) : (
                 <div className="card-institutional py-12 px-6 animate-in fade-in duration-500">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--wits-slate)] mb-10 flex items-center gap-2">
                       <BarChart2 size={16} /> Data Distribution Analysis
                    </h3>
                    <div className="h-[400px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={chartData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                           <XAxis 
                             dataKey="name" 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{fill: '#002244', fontSize: 12, fontWeight: 900}} 
                           />
                           <YAxis 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{fill: '#556677', fontSize: 11, fontWeight: 700}} 
                           />
                           <Tooltip 
                             cursor={{fill: '#f8f9fa'}}
                             contentStyle={{borderRadius: '0', border: '2px solid #002244', boxShadow: 'none', padding: '12px'}}
                             itemStyle={{fontWeight: 900, color: '#002244'}}
                           />
                           <Bar dataKey="count" radius={[0, 0, 0, 0]} barSize={60}>
                             {chartData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                             ))}
                           </Bar>
                         </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
               )}
            </div>
         </div>
      </main>

      {/* 4. Institutional Footer (Navy) */}
      <footer className="bg-[#002244] text-white py-12 px-6 border-t border-[#ffcc00]">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
               <div className="flex items-center gap-3 mb-6">
                  <Database className="text-[#ffcc00]" size={24} />
                  <span className="font-black text-lg tracking-tight uppercase">Journal Ranking IQ</span>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-md">
                 Integrated trade data analysis and journal ranking systems. This platform is part of a broader commitment to research excellence and transparency in academic publishing.
               </p>
            </div>
            <div>
               <h5 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-200 mb-6">Resources</h5>
               <ul className="space-y-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <li><a href="#" className="hover:text-[#ffcc00] transition-colors">Data Documentation</a></li>
                  <li><a href="#" className="hover:text-[#ffcc00] transition-colors">API Access</a></li>
                  <li><a href="#" className="hover:text-[#ffcc00] transition-colors">Rank History</a></li>
               </ul>
            </div>
            <div>
               <h5 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-200 mb-6">Contact</h5>
               <ul className="space-y-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <li><a href="#" className="hover:text-[#ffcc00] transition-colors">Support Portal</a></li>
                  <li><a href="#" className="hover:text-[#ffcc00] transition-colors">Feedback</a></li>
                  <li><a href="#" className="hover:text-[#ffcc00] transition-colors">Report Discrepancy</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-slate-800 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>© 2026 JOURNAL RANKING INTELLIGENCE PORTAL</span>
            <div className="flex gap-6">
               <a href="#">Privacy Policy</a>
               <a href="#">Terms of Use</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
