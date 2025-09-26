
import { useState, useEffect, useRef, useCallback } from 'react';
import type { LyricLine } from '../types';

/**
 * Hook personalizzato per gestire la sincronizzazione dei testi.
 * @param {boolean} isPlaying - Indica se la riproduzione è attiva.
 * @param {number} duration - La durata totale della traccia in secondi.
 * @param {LyricLine[]} lyrics - L'array di testi sincronizzati.
 * @returns Un oggetto con lo stato e le funzioni per controllare la sincronizzazione.
 */
export const useLyricSync = (isPlaying: boolean, duration: number, lyrics: LyricLine[]) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  // Fix: Use ReturnType<typeof setInterval> for browser compatibility instead of NodeJS.Timeout
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pulisce l'intervallo quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Gestisce l'avanzamento del tempo di riproduzione
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= duration) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return duration;
          }
          return prevTime + 0.1;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isPlaying, duration]);

  // Determina quale riga di testo dovrebbe essere evidenziata
  useEffect(() => {
    if (!lyrics || lyrics.length === 0) {
        setCurrentLineIndex(-1);
        return;
    }
    
    let activeIndex = -1;
    for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
            activeIndex = i;
            break;
        }
    }
    setCurrentLineIndex(activeIndex);

  }, [currentTime, lyrics]);

  /**
   * Imposta manualmente la posizione di riproduzione.
   * @param {number} time - Il nuovo tempo in secondi.
   */
  const seek = useCallback((time: number) => {
    if (time >= 0 && time <= duration) {
      setCurrentTime(time);
    }
  }, [duration]);

  /**
   * Resetta lo stato del timer.
   */
  const reset = useCallback(() => {
    setCurrentTime(0);
    setCurrentLineIndex(-1);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return { currentTime, currentLineIndex, seek, reset };
};
