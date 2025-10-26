import { useState, useEffect, useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CurrentTrack {
  title: string;
  artist: string;
  album?: string;
  duration?: number;
}

interface UseMediaDetectionOptions {
  pollInterval?: number; // intervallo di polling in ms
  autoStart?: boolean;
}

/**
 * Hook personalizzato per rilevare automaticamente la musica in riproduzione
 * 
 * IMPORTANTE: A causa delle limitazioni di sicurezza di iOS e Android,
 * non è possibile accedere direttamente alla musica in riproduzione da altre app.
 * Questo hook implementa una soluzione alternativa che:
 * 1. Monitora la libreria musicale locale
 * 2. Cerca di rilevare i cambiamenti nell'ultima riproduzione
 * 3. Mantiene un cache delle ultime tracce riprodotte
 */
export const useMediaDetection = (options: UseMediaDetectionOptions = {}) => {
  const { pollInterval = 5000, autoStart = true } = options;
  
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTrackRef = useRef<string | null>(null);

  // Richiedi permessi
  const requestPermissions = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (err) {
      setError('Errore nel richiedere i permessi');
      return false;
    }
  };

  // Rileva traccia corrente (simulazione - limitazioni reali dei SO)
  const detectCurrentTrack = async (): Promise<CurrentTrack | null> => {
    try {
      if (!hasPermission) return null;

      // In un'implementazione reale, qui cercheremmo:
      // 1. Metadati dal notification listener (Android)
      // 2. Now Playing Info (iOS - solo se l'app è in primo piano)
      // 3. Libreria musicale + euristica di riproduzione recente
      
      // Per ora, implementiamo una simulazione che:
      // - Monitora la libreria musicale
      // - Cerca la traccia più recentemente aggiunta/modificata
      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 20,
        sortBy: ['modificationTime'],
      });
      
      if (assets.totalCount > 0) {
        const asset = assets.assets[0];
        
        // Controlla se è una nuova traccia
        const trackId = `${asset.filename}-${asset.modificationTime}`;
        if (trackId === lastTrackRef.current) {
          return null; // Nessun cambiamento
        }
        
        lastTrackRef.current = trackId;
        
        // Prova a estrarre artista e titolo dal nome del file
        // Formati comuni: "Artist - Title.mp3" o "Title - Artist.mp3"
        let title = asset.filename.replace(/\.[^/.]+$/, ''); // rimuovi estensione
        let artist = 'Artista Sconosciuto';
        
        // Prova a dividere per " - "
        const parts = title.split(' - ');
        if (parts.length >= 2) {
          // Assume formato "Artist - Title"
          artist = parts[0].trim();
          title = parts.slice(1).join(' - ').trim();
        } else {
          // Prova anche "/" come separatore
          const slashParts = title.split('/');
          if (slashParts.length >= 2) {
            artist = slashParts[0].trim();
            title = slashParts.slice(1).join('/').trim();
          }
        }
        
        // Rimuovi numeri di traccia all'inizio (es. "01 - " o "01. ")
        title = title.replace(/^\d+[\s.-]+/, '');
        artist = artist.replace(/^\d+[\s.-]+/, '');
        
        const track: CurrentTrack = {
          title,
          artist,
          album: asset.albumId || undefined,
          duration: asset.duration,
        };
        
        // Salva in cache
        await AsyncStorage.setItem('lastDetectedTrack', JSON.stringify(track));
        
        return track;
      }
      
      return null;
    } catch (err) {
      console.error('Errore nel rilevare la traccia:', err);
      setError('Errore nel rilevare la musica in riproduzione');
      return null;
    }
  };

  // Carica l'ultima traccia dalla cache
  const loadCachedTrack = async () => {
    try {
      const cached = await AsyncStorage.getItem('lastDetectedTrack');
      if (cached) {
        setCurrentTrack(JSON.parse(cached));
      }
    } catch (err) {
      console.error('Errore nel caricare la cache:', err);
    }
  };

  // Avvia il rilevamento
  const startDetection = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return;
    }
    
    setIsDetecting(true);
    setError(null);
    
    // Carica cache iniziale
    await loadCachedTrack();
    
    // Avvia polling
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(async () => {
      const track = await detectCurrentTrack();
      if (track) {
        setCurrentTrack(track);
      }
    }, pollInterval);
  };

  // Ferma il rilevamento
  const stopDetection = () => {
    setIsDetecting(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Refresh manuale
  const refreshTrack = async () => {
    if (!hasPermission) return;
    
    const track = await detectCurrentTrack();
    if (track) {
      setCurrentTrack(track);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-start
  useEffect(() => {
    if (autoStart) {
      requestPermissions();
    }
  }, [autoStart]);

  return {
    currentTrack,
    isDetecting,
    hasPermission,
    error,
    startDetection,
    stopDetection,
    refreshTrack,
    requestPermissions,
  };
};