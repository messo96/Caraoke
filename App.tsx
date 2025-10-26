
import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StatusBar, 
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SongInputForm } from './components/SongInputForm';
import { AutoDetectForm } from './components/AutoDetectForm';
import { LyricsDisplay } from './components/LyricsDisplay';
import { PlayerControls } from './components/PlayerControls';
import { CarIntegration } from './components/CarIntegration';
import { useLyricSync } from './hooks/useLyricSync';
import { fetchLyrics } from './services/geminiService';
import { useAndroidAuto } from './services/androidAutoService';
import { CarIcon } from './components/Icon';
import type { Song, Lyrics } from './types';

/*
 * KARAOKE CAR - MOBILE APP
 * 
 * App di Karaoke per dispositivi mobili Android e iOS.
 * Utilizza React Native con Expo per un'esperienza cross-platform.
 * 
 * SETUP:
 * 1. Installa Expo CLI: npm install -g expo-cli
 * 2. Installa le dipendenze: npm install
 * 3. Configura la tua chiave API di Google Gemini in Constants.expoConfig.extra.apiKey
 * 4. Avvia l'app: expo start
 *
 * FUNZIONAMENTO:
 * 1. L'app mostra un form per inserire artista e titolo.
 * 2. Dopo l'invio, chiama l'API di Gemini per generare i testi in formato LRC.
 * 3. Se i testi sono sincronizzati, vengono visualizzati e sincronizzati con un timer interno.
 * 4. Se non sono sincronizzati, viene mostrato il testo statico.
 * 5. È disponibile una "Modalità Auto" con un'interfaccia ottimizzata per l'uso in auto.
 */

const { width, height } = Dimensions.get('window');

const App: React.FC = () => {
  const [song, setSong] = useState<Song | null>(null);
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCarMode, setIsCarMode] = useState(false);
  const [useAutoDetect, setUseAutoDetect] = useState(true);

  // Hook per Android Auto
  const androidAuto = useAndroidAuto();

  const { currentTime, currentLineIndex, seek, reset } = useLyricSync(
    isPlaying,
    song?.duration ?? 300,
    lyrics?.synced ?? []
  );

  // Aggiorna Android Auto quando cambia la canzone o lo stato di riproduzione
  useEffect(() => {
    if (song && isPlaying) {
      const currentLyric = lyrics?.synced && currentLineIndex >= 0 
        ? lyrics.synced[currentLineIndex]?.text 
        : undefined;
      
      androidAuto.updateNowPlaying(song, isPlaying, currentLyric);
    } else if (!isPlaying && song) {
      androidAuto.updateNowPlaying(song, false);
    } else {
      androidAuto.clearNowPlaying();
    }
  }, [song, isPlaying, currentLineIndex, lyrics]);

  // Aggiorna il testo corrente su Android Auto
  useEffect(() => {
    if (song && isPlaying && lyrics?.synced && currentLineIndex >= 0) {
      const currentLyric = lyrics.synced[currentLineIndex]?.text;
      if (currentLyric) {
        androidAuto.updateCurrentLyric(currentLyric);
      }
    }
  }, [currentLineIndex, lyrics, song, isPlaying]);

  const handleSearch = useCallback(async (artist: string, title: string) => {
    setIsLoading(true);
    setError(null);
    setSong(null);
    setLyrics(null);
    setIsPlaying(false);
    reset();

    try {
      const fetchedLyrics = await fetchLyrics(title, artist);
      
      const newSong: Song = {
        title,
        artist,
        albumArt: `https://picsum.photos/seed/${title}${artist}/400`,
        duration: fetchedLyrics.synced.length > 0 ? Math.ceil(fetchedLyrics.synced[fetchedLyrics.synced.length - 1].time) + 5 : 300,
      };

      setSong(newSong);
      setLyrics(fetchedLyrics);
      
      // Avvia automaticamente la riproduzione quando i testi sono caricati
      // Se ci sono testi sincronizzati, avvia subito
      // Se ci sono solo testi non sincronizzati, avvia comunque per mostrare il testo
      setIsPlaying(true);

    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Si è verificato un errore sconosciuto.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [reset]);
  
  const handlePlayPause = () => {
      if (!song) return;
      setIsPlaying(prev => !prev);
  }

  const handleReset = () => {
    setSong(null);
    setLyrics(null);
    setIsPlaying(false);
    setError(null);
    reset();
  }

  const renderContent = () => {
    if (!song) {
      return (
        <View style={styles.centeredContainer}>
          <View style={styles.inputToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, useAutoDetect && styles.toggleButtonActive]}
              onPress={() => setUseAutoDetect(true)}
            >
              <Text style={styles.toggleButtonText}>Auto-Rilevamento</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !useAutoDetect && styles.toggleButtonActive]}
              onPress={() => setUseAutoDetect(false)}
            >
              <Text style={styles.toggleButtonText}>Input Manuale</Text>
            </TouchableOpacity>
          </View>
          
          {useAutoDetect ? (
            <AutoDetectForm onTrackDetected={handleSearch} isLoading={isLoading} />
          ) : (
            <SongInputForm onSearch={handleSearch} isLoading={isLoading} />
          )}
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Oops! Qualcosa è andato storto.</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleReset}>
            <Text style={styles.errorButtonText}>Riprova</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (song && lyrics) {
      if (isCarMode) {
        const currentLyric = lyrics?.synced && currentLineIndex >= 0 
          ? lyrics.synced[currentLineIndex]?.text 
          : undefined;
          
        return (
          <View style={styles.carModeContainer}>
            <CarIntegration
              currentSong={{ title: song.title, artist: song.artist }}
              currentLyric={currentLyric}
              isPlaying={isPlaying}
            />
            
            <View style={styles.carModeHeader}>
              <Text style={styles.carModeTitle}>{song.title}</Text>
              <Text style={styles.carModeArtist}>{song.artist}</Text>
            </View>
            <View style={styles.carModeLyrics}>
              <LyricsDisplay 
                lyrics={lyrics.synced} 
                rawLyrics={lyrics.raw} 
                currentLineIndex={currentLineIndex} 
                isCarMode={true} 
              />
            </View>
            <PlayerControls 
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              currentTime={currentTime}
              duration={song.duration}
              onSeek={seek}
              isCarMode={true}
            />
          </View>
        );
      } else {
        return (
          <View style={styles.normalModeContainer}>
            <View style={styles.songInfoContainer}>
              <ImageBackground 
                source={{ uri: song.albumArt }} 
                style={styles.albumArt}
                imageStyle={{ borderRadius: 12 }}
              >
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                  style={styles.albumArtOverlay}
                />
              </ImageBackground>
              <Text style={styles.songTitle}>{song.title}</Text>
              <Text style={styles.songArtist}>{song.artist}</Text>
              <View style={styles.controlsContainer}>
                <PlayerControls 
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  currentTime={currentTime}
                  duration={song.duration}
                  onSeek={seek}
                  isCarMode={false}
                />
              </View>
              
              <CarIntegration
                currentSong={{ title: song.title, artist: song.artist }}
                isPlaying={isPlaying}
              />
            </View>
            
            <View style={styles.lyricsContainer}>
              <LyricsDisplay 
                lyrics={lyrics.synced} 
                rawLyrics={lyrics.raw} 
                currentLineIndex={currentLineIndex} 
                isCarMode={false} 
              />
            </View>
          </View>
        );
      }
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ImageBackground
        source={song ? { uri: song.albumArt } : undefined}
        style={styles.backgroundImage}
        blurRadius={song ? 20 : 0}
      >
        <LinearGradient
          colors={['rgba(17, 24, 39, 0.9)', 'rgba(17, 24, 39, 0.95)']}
          style={styles.overlay}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={[styles.headerButton, { opacity: song ? 1 : 0 }]} 
              onPress={handleReset}
              disabled={!song}
            >
              <Text style={styles.backButtonText}>← Nuova Ricerca</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.carModeButton}
              onPress={() => setIsCarMode(!isCarMode)}
            >
              <CarIcon size={24} color="#fff" />
              <Text style={styles.carModeButtonText}>
                {isCarMode ? 'Disattiva' : 'Attiva'} Modalità Auto
              </Text>
            </TouchableOpacity>
          </View>

          {renderContent()}
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    flex: 1,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  carModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(75, 85, 99, 0.5)',
    borderRadius: 8,
  },
  carModeButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'rgba(153, 27, 27, 0.5)',
    margin: 16,
    borderRadius: 12,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FCA5A5',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FECACA',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  carModeContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
  },
  carModeHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  carModeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  carModeArtist: {
    fontSize: 24,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  },
  carModeLyrics: {
    flex: 1,
    marginVertical: 16,
  },
  normalModeContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  songInfoContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    marginBottom: 16,
  },
  albumArt: {
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 250,
    maxHeight: 250,
    marginBottom: 16,
  },
  albumArtOverlay: {
    flex: 1,
    borderRadius: 12,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  songArtist: {
    fontSize: 18,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  controlsContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  lyricsContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  inputToggle: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#059669',
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default App;
