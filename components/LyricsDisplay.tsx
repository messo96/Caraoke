
import React, { useEffect, useRef } from 'react';
import type { LyricLine } from '../types';

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  rawLyrics: string;
  currentLineIndex: number;
  isCarMode: boolean;
}

export const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ lyrics, rawLyrics, currentLineIndex, isCarMode }) => {
  const activeLineRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gestisce lo scroll automatico per mantenere la riga attiva al centro.
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeLine = activeLineRef.current;
      const containerHeight = container.clientHeight;
      const activeLineTop = activeLine.offsetTop;
      const activeLineHeight = activeLine.clientHeight;
      
      const scrollTop = activeLineTop - containerHeight / 2 + activeLineHeight / 2;
      
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });
    }
  }, [currentLineIndex]);
  
  const baseTextStyle = "transition-all duration-300";
  const carModeTextSize = "text-4xl md:text-6xl font-bold p-4";
  const normalModeTextSize = "text-xl md:text-2xl p-2";

  if (lyrics.length > 0) {
    return (
      <div 
        ref={containerRef} 
        className={`w-full h-full overflow-y-auto text-center font-semibold scroll-smooth ${isCarMode ? 'p-4' : 'p-6'}`}
      >
        {lyrics.map((line, index) => {
          const isActive = index === currentLineIndex;
          const isPast = index < currentLineIndex;
          
          let lineStyle = "";
          if (isCarMode) {
            lineStyle = isActive 
                ? "text-yellow-300 scale-105" 
                : "text-gray-200 opacity-60 scale-95";
          } else {
            lineStyle = isActive 
                ? "text-green-300 scale-100" 
                : isPast ? "text-gray-500" : "text-gray-300";
          }

          return (
            <p
              key={`${line.time}-${index}`}
              ref={isActive ? activeLineRef : null}
              className={`${baseTextStyle} ${isCarMode ? carModeTextSize : normalModeTextSize} ${lineStyle}`}
            >
              {line.text}
            </p>
          );
        })}
      </div>
    );
  }

  // Fallback per testi non sincronizzati
  return (
    <div className="w-full h-full overflow-y-auto p-6 text-center">
        <h3 className={`font-bold mb-4 ${isCarMode ? 'text-3xl' : 'text-xl'}`}>Testo non sincronizzato</h3>
        <p className={`whitespace-pre-wrap text-gray-400 ${isCarMode ? 'text-2xl' : 'text-lg'}`}>
            {rawLyrics}
        </p>
    </div>
  );
};
