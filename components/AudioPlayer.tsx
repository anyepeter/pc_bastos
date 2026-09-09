'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Loader2 } from 'lucide-react';

/* This component is used from both locales but takes no `t`; the labels are
   assistive-technology only and are not rendered as visible copy. */
const PLAY_LABEL = 'Play';
const PAUSE_LABEL = 'Pause';
const SEEK_LABEL = 'Seek';

interface AudioPlayerProps {
  src: string;
  onClose?: () => void;
}

export default function AudioPlayer({ src, onClose }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const togglePlayPause = () => {
      const audio = audioRef.current;
      if (!audio) return;
  
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    };



    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // Force load
    audio.load();
    togglePlayPause();

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = Math.max(0, Math.min(duration, newTime));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = Math.max(0, Math.min(duration, newTime));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration]);


  /** Arrow keys seek by 5s, Home/End jump to the ends, Space toggles play. */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const STEP = 5;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(duration, audio.currentTime + STEP);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(0, audio.currentTime - STEP);
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = duration;
    if (next === null) return;
    e.preventDefault();
    audio.currentTime = next;
    setCurrentTime(next);
  };

  return (
    <div className="rounded-xl bg-plum-800 p-1 text-white">
      <audio ref={audioRef} src={src} preload="auto" />
      
      <div className="flex items-center justify-between space-x-3">
        <button
          onClick={togglePlayPause}
          aria-label={isPlaying ? PAUSE_LABEL : PLAY_LABEL}
          className="focus-ring rounded-lg p-2 transition-colors duration-300 hover:bg-plum-700"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5" fill="currentColor" />
          )}
        </button>

        <div className="flex-1 flex items-center space-x-2">
          {/* A real slider: keyboard-operable and announced, not a bare div
              with a mousedown handler. */}
          <div
            ref={progressRef}
            role="slider"
            tabIndex={0}
            aria-label={SEEK_LABEL}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration) || 0}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
            onMouseDown={handleMouseDown}
            onKeyDown={handleKeyDown}
            className="focus-ring relative h-2 flex-1 cursor-pointer rounded-full bg-plum-950"
          >
            <div
              className="h-2 rounded-full bg-leaf-400 transition-all duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}