
import React, { useCallback } from 'react';
import { PlayIcon, PauseIcon } from './Icon';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isCarMode: boolean;
}

// Formatta il tempo da secondi a stringa mm:ss
const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  onSeek,
  isCarMode,
}) => {
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value));
  }, [onSeek]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (isCarMode) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-black/50 rounded-lg">
        <button
          onClick={onPlayPause}
          className="bg-gray-100 text-black rounded-full p-8 transition-transform transform hover:scale-110 active:scale-95 shadow-lg"
          aria-label={isPlaying ? 'Pausa' : 'Riproduci'}
        >
          {isPlaying ? <PauseIcon className="w-16 h-16" /> : <PlayIcon className="w-16 h-16" />}
        </button>
        <div className="text-4xl font-mono mt-8">{formatTime(currentTime)} / {formatTime(duration)}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg">
      <button
        onClick={onPlayPause}
        className="text-white hover:text-green-400 transition-colors"
        aria-label={isPlaying ? 'Pausa' : 'Riproduci'}
      >
        {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
      </button>

      <span className="text-xs font-mono w-12 text-center">{formatTime(currentTime)}</span>

      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        style={{ backgroundSize: `${progress}% 100%` }}
      />
      
      <span className="text-xs font-mono w-12 text-center">{formatTime(duration)}</span>
    </div>
  );
};
