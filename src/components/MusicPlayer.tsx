import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "CYBERPUNK PULSE",
    artist: "NEON_GEN_AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-cyan)"
  },
  {
    id: 2,
    title: "NEON DREAMS",
    artist: "SYNTH_WAVE_01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-magenta)"
  },
  {
    id: 3,
    title: "GLITCH HORIZON",
    artist: "ERROR_404",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#ffffff"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full max-w-md p-6 neon-border-magenta bg-black/40 backdrop-blur-md relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-magenta/10 blur-3xl rounded-full -mr-16 -mt-16" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex items-center gap-6 mb-8">
        <motion.div
          key={currentTrack.id}
          initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          className="w-24 h-24 neon-border flex items-center justify-center bg-black relative group"
        >
          <Music className="w-10 h-10 text-neon-cyan group-hover:glitch-effect" />
          {isPlaying && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 border border-neon-cyan/30"
            />
          )}
        </motion.div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="space-y-1"
            >
              <h3 className="font-retro text-xs text-neon-cyan truncate glitch-text" data-text={currentTrack.title}>
                {currentTrack.title}
              </h3>
              <p className="font-mono text-xs text-gray-400 tracking-widest">
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1 bg-gray-800 mb-6 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-neon-magenta"
          style={{ width: `${progress}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.2 }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="p-2 text-gray-400 hover:text-neon-cyan transition-colors cursor-pointer"
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full neon-border-magenta flex items-center justify-center text-neon-magenta hover:bg-neon-magenta hover:text-black transition-all cursor-pointer"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>

          <button
            onClick={handleNext}
            className="p-2 text-gray-400 hover:text-neon-cyan transition-colors cursor-pointer"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <Volume2 size={16} />
          <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-neon-cyan/50" />
          </div>
        </div>
      </div>

      {/* Visualizer bars */}
      <div className="flex items-end justify-center gap-1 h-8 mt-6 opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: isPlaying ? [4, Math.random() * 24 + 4, 4] : 4
            }}
            transition={{
              repeat: Infinity,
              duration: 0.5 + Math.random() * 0.5
            }}
            className="w-1 bg-neon-cyan"
          />
        ))}
      </div>
    </div>
  );
}
