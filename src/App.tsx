import React, { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Cpu, Zap, Radio } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-glitch-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* CRT Overlay Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header / Status Bar */}
      <header className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-40 bg-black/50 backdrop-blur-sm border-b border-neon-cyan/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 neon-border flex items-center justify-center">
            <Cpu size={16} className="text-neon-cyan animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <h1 className="font-retro text-[10px] text-neon-cyan glitch-text" data-text="NEON_OS v2.0.4">
              NEON_OS v2.0.4
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              <span className="font-mono text-[8px] text-gray-400 uppercase tracking-tighter">UPLINK_STABLE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-[10px] text-neon-magenta">
          <div className="flex items-center gap-2">
            <Radio size={12} />
            <span>FREQ: 104.9 MHz</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={12} />
            <span>PWR: 98%</span>
          </div>
          <div className="text-white bg-neon-magenta/20 px-2 py-0.5 border border-neon-magenta/50">
            {time.toLocaleTimeString([], { hour12: false })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-16">
        {/* Left Sidebar - System Info */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-4 neon-border bg-black/40 space-y-4"
          >
            <div className="flex items-center gap-2 text-neon-cyan mb-2">
              <Terminal size={14} />
              <span className="font-retro text-[8px]">SYS_LOG</span>
            </div>
            <div className="font-mono text-[9px] text-gray-500 space-y-1">
              <p>{'>'} INITIALIZING KERNEL...</p>
              <p>{'>'} LOADING NEURAL_NET...</p>
              <p className="text-neon-cyan">{'>'} SNAKE_PROC: ACTIVE</p>
              <p className="text-neon-magenta">{'>'} AUDIO_DRV: READY</p>
              <p className="animate-pulse">{'>'} _</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 neon-border-magenta bg-black/40"
          >
            <div className="font-retro text-[8px] text-neon-magenta mb-4">HARDWARE_MONITOR</div>
            <div className="space-y-3">
              {[
                { label: 'CPU', val: 42 },
                { label: 'GPU', val: 68 },
                { label: 'MEM', val: 15 }
              ].map(item => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between font-mono text-[8px]">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="h-1 bg-gray-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      className="h-full bg-neon-magenta" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Center - Game */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Sidebar - Music Player */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-8">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <MusicPlayer />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full p-4 neon-border bg-black/40 font-mono text-[10px] text-gray-400"
          >
            <div className="text-neon-cyan mb-2 uppercase tracking-widest">Instructions</div>
            <ul className="space-y-2">
              <li>• EAT PIXELS TO GROW</li>
              <li>• AVOID SELF-COLLISION</li>
              <li>• VIBE TO THE GLITCH</li>
              <li className="text-neon-magenta animate-pulse">!! DON'T BREAK THE SYSTEM !!</li>
            </ul>
          </motion.div>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="fixed bottom-0 left-0 w-full p-2 flex justify-center pointer-events-none">
        <div className="font-mono text-[8px] text-gray-700 tracking-[1em] uppercase">
          RETRO_FUTURISM // GLITCH_ART // 2026
        </div>
      </footer>
    </div>
  );
}
