import React, { useState, useEffect, useRef } from 'react';
import { AppState, DateOfBirth, NumerologyResponse } from './types';
import DateSelector from './components/DateSelector';
import { analyzeNumerology } from './services/geminiService';
import { YinYangSymbol } from './components/YinYangSymbol';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('INTRO');
  const [dob, setDob] = useState<DateOfBirth>({ day: '', month: '', year: '' });
  const [result, setResult] = useState<NumerologyResponse | null>(null);
  
  // Audio State
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Toggle Music Function
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio play failed:", error);
          });
        }
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; 
    }
  }, []);

  const handleDateChange = (field: keyof DateOfBirth, value: string) => {
    setDob(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    setState('ANALYZING');
    try {
      // Simulate delay for effect
      await new Promise(resolve => setTimeout(resolve, 3000)); // Increased delay slightly for visual effect
      const response = await analyzeNumerology(dob);
      setResult(response);
      setState('RESULT');
    } catch (e) {
      console.error(e);
      // Reset logic could go here
      setState('INTRO');
    }
  };

  const handleReset = () => {
    setResult(null);
    setDob({ day: '', month: '', year: '' });
    setState('INTRO');
  };

  useEffect(() => {
    if (state === 'RESULT' && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state]);

  return (
    <div className="min-h-screen w-full font-roboto bg-[#020617] text-white relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      
      {/* Background Audio */}
      <audio ref={audioRef} loop>
        <source src="https://cdn.pixabay.com/audio/2022/10/18/audio_31c2730e64.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Toggle */}
      <button 
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-purple-300 hover:text-white hover:bg-white/10 transition-all duration-300 group shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer"
        title={isMusicPlaying ? "Tắt nhạc" : "Bật nhạc nền"}
      >
        {isMusicPlaying ? (
          <div className="relative">
             <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
             <span className="absolute -top-1 -right-1 flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
             </span>
          </div>
        ) : (
          <svg className="w-6 h-6 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>
        )}
      </button>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-gradient-to-b from-[#0f0720] via-[#1e1b4b] to-[#020617]"></div>
         <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-blue-600/10 blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 relative z-10 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="flex flex-col items-center justify-center mb-16 mt-12 relative z-20">
           <div className="w-20 h-20 mb-8 relative group">
              <div className="absolute inset-0 bg-purple-600 rounded-full blur-[25px] opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              {/* Reuse YinYang but treat it as a mystic symbol */}
              <div className="relative w-full h-full transition-transform duration-700 group-hover:rotate-180">
                 <YinYangSymbol spinning={state === 'ANALYZING'} />
              </div>
           </div>
           
           <h1 className="text-5xl md:text-7xl font-thin tracking-[0.2em] text-center mb-2 py-4 leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)] select-none">
             DIỆU SỐ
           </h1>
           
           <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-5 opacity-70"></div>
           
           <p className="text-purple-200/70 font-light text-xs md:text-sm tracking-[0.4em] uppercase">
             Thần Số Học • Numerology
           </p>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-start w-full">
          
          {/* INTRO / INPUT */}
          {state === 'INTRO' && (
            <div className="w-full max-w-2xl animate-[fadeIn_0.8s_ease-out]">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-center relative overflow-hidden group">
                {/* Decoration light */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 blur-[60px] group-hover:bg-purple-500/50 transition-all duration-700"></div>

                <h2 className="text-2xl font-light mb-8 text-white">Khám Phá Con Số Của Bạn</h2>
                <p className="mb-8 leading-relaxed text-slate-300 font-light text-base md:text-lg">
                  Nhập ngày tháng năm sinh (Dương lịch) để giải mã những tín hiệu từ vũ trụ về tính cách và định mệnh của bạn.
                </p>
                
                <DateSelector 
                  dob={dob} 
                  onChange={handleDateChange} 
                  onAnalyze={handleAnalyze} 
                />
              </div>
            </div>
          )}

          {/* ANALYZING */}
          {state === 'ANALYZING' && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fadeIn w-full">
              {/* Mystical Gateway Container */}
              <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                
                {/* Ambient Glow */}
                <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-[60px] animate-pulse"></div>

                {/* Ring 1: Outer Orbit - Slow Rotation */}
                <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                
                {/* Ring 2: Arc Orbit - Faster */}
                <div className="absolute inset-2 border-t border-r border-purple-300/50 rounded-full animate-[spin_3s_linear_infinite]"></div>
                
                {/* Ring 3: Reverse Dashed Orbit */}
                <div className="absolute inset-6 border border-dashed border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                
                {/* Ring 4: Particle Orbit */}
                <div className="absolute inset-0 w-full h-full animate-[spin_6s_linear_infinite]">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_10px_purple]"></div>
                </div>

                {/* Core Circle */}
                <div className="w-32 h-32 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center relative shadow-[0_0_30px_rgba(139,92,246,0.3)] z-10 group">
                   {/* Inner spinning ring */}
                   <div className="absolute inset-2 border-2 border-t-transparent border-purple-500/80 rounded-full animate-spin"></div>
                   
                   {/* The Number Placeholder */}
                   <div className="relative flex items-center justify-center">
                      <span className="text-6xl font-thin text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-pulse">
                        {(parseInt(dob.day || '0') + parseInt(dob.month || '0') + parseInt(dob.year || '0')) % 9 || 9}
                      </span>
                   </div>
                </div>
              </div>

              {/* Text */}
              <h2 className="text-lg md:text-xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200 tracking-[0.3em] uppercase animate-pulse text-center px-4">
                Đang Kết Nối Năng Lượng Số
              </h2>
              
              {/* Ellipsis Animation */}
              <div className="flex gap-3 mt-6 opacity-60">
                 <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                 <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          {/* RESULT */}
          {state === 'RESULT' && result && (
            <div ref={scrollRef} className="w-full max-w-4xl animate-[fadeInUp_0.8s_ease-out] pb-12">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Number & Summary */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center shadow-lg relative overflow-hidden min-h-[300px] justify-center">
                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-purple-900 via-purple-500 to-purple-900"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/20 blur-[40px]"></div>
                    
                    <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-4">Số Chủ Đạo</p>
                    <div className="text-8xl font-thin text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                      {result.lifePathNumber}
                    </div>
                    <div className="w-10 h-1 bg-purple-500 rounded-full mb-6"></div>
                    <p className="text-white/90 font-light italic text-sm">
                      "{result.rulingNumberMeaning}"
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 relative z-20">
                    <button 
                      onClick={handleReset}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold tracking-widest text-purple-300 hover:text-white transition-all duration-300 uppercase group cursor-pointer"
                    >
                      <span className="inline-block transition-transform group-hover:rotate-180 mr-2">↻</span>
                      Tra cứu khác
                    </button>
                  </div>
                </div>

                {/* Right Column: Detailed Interpretation */}
                <div className="lg:col-span-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg relative">
                  
                  {/* Strengths / Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     <div className="space-y-2">
                        <h3 className="text-green-400 font-bold uppercase tracking-wide text-xs flex items-center gap-2">
                          <span className="w-1 h-4 bg-green-500 rounded-full"></span> Điểm Mạnh
                        </h3>
                        <p className="text-slate-200 font-light text-sm leading-relaxed text-justify">{result.strengths}</p>
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-red-400 font-bold uppercase tracking-wide text-xs flex items-center gap-2">
                          <span className="w-1 h-4 bg-red-500 rounded-full"></span> Cần Khắc Phục
                        </h3>
                        <p className="text-slate-200 font-light text-sm leading-relaxed text-justify">{result.weaknesses}</p>
                     </div>
                  </div>

                  {/* Career & Love */}
                  <div className="grid grid-cols-1 gap-6 mb-8">
                    {/* Career */}
                    <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/10">
                      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                         <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                         Sự Nghiệp & Tài Chính
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed font-light text-justify">
                        {result.career}
                      </p>
                    </div>

                    {/* Love */}
                    <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/10">
                      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        Tình Duyên & Mối Quan Hệ
                      </h3>
                      <p className="text-slate-300 text-sm leading-relaxed font-light text-justify">
                        {result.love}
                      </p>
                    </div>
                  </div>

                  {/* Year Prediction */}
                   <div className="mb-8 p-6 bg-indigo-900/10 rounded-xl border border-indigo-500/20">
                    <h3 className="text-indigo-300 font-medium mb-2 uppercase tracking-widest text-xs">Dự Báo Năm {dob.year ? new Date().getFullYear() : ''}</h3>
                    <p className="text-slate-200 text-sm leading-relaxed font-light text-justify">
                      {result.currentYearPrediction}
                    </p>
                  </div>

                  {/* Advice */}
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-gradient-to-b from-purple-400 to-transparent"></div>
                    <h3 className="text-lg font-medium text-white mb-2">Lời Khuyên</h3>
                    <p className="text-purple-100 italic font-light text-lg leading-relaxed">
                      {result.advice}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="text-center mt-8 text-slate-500 text-xs font-light tracking-widest uppercase">
          <p>© 2024 Huyền Vi • AI Numerology</p>
        </footer>
      </div>
    </div>
  );
};

export default App;