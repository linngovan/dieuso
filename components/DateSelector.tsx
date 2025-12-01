import React from 'react';
import { DateOfBirth } from '../types';

interface DateSelectorProps {
  dob: DateOfBirth;
  onChange: (field: keyof DateOfBirth, value: string) => void;
  onAnalyze: () => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ dob, onChange, onAnalyze }) => {
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  const isValid = dob.day && dob.month && dob.year;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Day */}
        <div className="flex flex-col gap-2">
          <label className="text-purple-300 text-xs font-bold uppercase tracking-widest text-center">Ngày</label>
          <div className="relative group">
            <select
              value={dob.day}
              onChange={(e) => onChange('day', e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-xl appearance-none outline-none focus:border-purple-500 transition-all text-center text-xl font-light cursor-pointer hover:bg-white/10"
            >
              <option value="" className="bg-slate-900 text-slate-500">--</option>
              {days.map(d => (
                <option key={d} value={d} className="bg-slate-900">{d}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Month */}
        <div className="flex flex-col gap-2">
          <label className="text-purple-300 text-xs font-bold uppercase tracking-widest text-center">Tháng</label>
          <div className="relative group">
            <select
              value={dob.month}
              onChange={(e) => onChange('month', e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-xl appearance-none outline-none focus:border-purple-500 transition-all text-center text-xl font-light cursor-pointer hover:bg-white/10"
            >
              <option value="" className="bg-slate-900 text-slate-500">--</option>
              {months.map(m => (
                <option key={m} value={m} className="bg-slate-900">{m}</option>
              ))}
            </select>
             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-2">
          <label className="text-purple-300 text-xs font-bold uppercase tracking-widest text-center">Năm</label>
          <div className="relative group">
            <select
              value={dob.year}
              onChange={(e) => onChange('year', e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-xl appearance-none outline-none focus:border-purple-500 transition-all text-center text-xl font-light cursor-pointer hover:bg-white/10"
            >
              <option value="" className="bg-slate-900 text-slate-500">----</option>
              {years.map(y => (
                <option key={y} value={y} className="bg-slate-900">{y}</option>
              ))}
            </select>
             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={!isValid}
        className={`w-full py-4 rounded-full text-white font-bold tracking-[0.2em] uppercase transition-all duration-500 relative overflow-hidden group shadow-[0_0_20px_rgba(168,85,247,0.3)] ${isValid ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] cursor-pointer' : 'bg-white/10 cursor-not-allowed opacity-50'}`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
           Khám Phá
           <svg className={`w-5 h-5 transition-transform duration-300 ${isValid ? 'group-hover:translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
        </span>
        {isValid && (
           <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform duration-500 ease-out"></div>
        )}
      </button>
    </div>
  );
};

export default DateSelector;