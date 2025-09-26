
import React, { useState, useCallback, useEffect } from 'react';
import { SongInputForm } from './components/SongInputForm';
import { LyricsDisplay } from './components/LyricsDisplay';
import { PlayerControls } from './components/PlayerControls';
import { useLyricSync } from './hooks/useLyricSync';
import { fetchLyrics } from './services/geminiService';
import { CarIcon } from './components/Icon';
import type { Song, Lyrics } from './types';

/*
 * README / ISTRUZIONI
 * 
 * Questa è un'applicazione React che simula un'app di "Karaoke per auto".
 * A causa delle limitazioni del browser, non può rilevare automaticamente la musica in riproduzione
 * da altre app (come Spotify). Invece, l'utente deve inserire manualmente l'artista e il titolo.
 * 
 * SETUP:
 * 1. Assicurati di avere Node.js installato.
 * 2. Crea un file `.env` nella root del progetto.
 * 3. Aggiungi la tua chiave API di Google Gemini al file `.env`:
 *    API_KEY=LA_TUA_CHIAVE_API
 * 4. Avvia il server di sviluppo (es. con Vite o Create React App).
 *
 * FUNZIONAMENTO:
 * 1. L'app mostra un form per inserire artista e titolo.
 * 2. Dopo l'invio, chiama l'API di Gemini per generare i testi in formato LRC.
 * 3. Se i testi sono sincronizzati, vengono visualizzati e sincronizzati con un timer interno.
 * 4. Se non sono sincronizzati, viene mostrato il testo statico.
 * 5. È disponibile una "Modalità Auto" con un'interfaccia semplificata, a contrasto elevato e con caratteri grandi.
 *
 * TEST MANUALE:
 * 1. Avvia l'app.
 * 2. Inserisci un artista e un titolo noti (es. "Queen", "Bohemian Rhapsody").
 * 3. Clicca su "Cerca Testi".
 * 4. Se la ricerca ha successo, dovresti vedere la schermata dei testi.
 * 5. Usa i controlli del player per avviare/mettere in pausa la sincronizzazione dei testi.
 * 6. Attiva/disattiva la "Modalità Auto" per vedere le differenze nell'interfaccia.
 */

const App: React.FC = () => {
  const [song, setSong] = useState<Song | null>(null);
  const [lyrics, setLyrics] = useState<Lyrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCarMode, setIsCarMode] = useState(false);

  const { currentTime, currentLineIndex, seek, reset } = useLyricSync(
    isPlaying,
    song?.duration ?? 300,
    lyrics?.synced ?? []
  );

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

  useEffect(() => {
    document.body.className = isCarMode 
      ? 'bg-black text-white' 
      : 'bg-gray-900 text-white';
  }, [isCarMode]);

  const backgroundStyle = {
    backgroundImage: song ? `linear-gradient(rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.95)), url(${song.albumArt})` : '',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const containerClasses = isCarMode
    ? 'bg-black text-white h-full flex flex-col p-4'
    : 'max-w-4xl mx-auto h-full flex flex-col p-4';

  return (
    <main style={backgroundStyle} className="min-h-screen w-full transition-all duration-500">
      <div className={containerClasses}>
        
        <header className="flex justify-between items-center mb-4 flex-shrink-0">
          <button onClick={handleReset} className={`text-2xl font-bold transition-opacity ${song ? 'opacity-100' : 'opacity-0'}`}>
            &larr; Nuova Ricerca
          </button>
          
          <button
            onClick={() => setIsCarMode(!isCarMode)}
            className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 transition-colors"
          >
            <CarIcon className="w-6 h-6" />
            <span className="hidden sm:inline">{isCarMode ? 'Disattiva' : 'Attiva'} Modalità Auto</span>
          </button>
        </header>

        {!song && (
          <div className="flex-grow flex items-center justify-center">
            <SongInputForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        )}

        {error && (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-red-900/50 rounded-lg">
                <h2 className="text-2xl font-bold text-red-300 mb-4">Oops! Qualcosa è andato storto.</h2>
                <p className="text-red-200">{error}</p>
                <button onClick={handleReset} className="mt-6 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700">Riprova</button>
            </div>
        )}
        
        {song && lyrics && (
          isCarMode ? (
            <div className="flex-grow flex flex-col justify-around items-center gap-8 text-center">
              <div>
                <h1 className="text-5xl font-bold">{song.title}</h1>
                <h2 className="text-3xl text-gray-400 mt-2">{song.artist}</h2>
              </div>
              <div className="w-full flex-grow relative">
                 <div className="absolute inset-0">
                    <LyricsDisplay lyrics={lyrics.synced} rawLyrics={lyrics.raw} currentLineIndex={currentLineIndex} isCarMode={true} />
                 </div>
              </div>
              <PlayerControls 
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                currentTime={currentTime}
                duration={song.duration}
                onSeek={seek}
                isCarMode={true}
              />
            </div>
          ) : (
            <div className="flex-grow flex flex-col md:flex-row gap-8 items-center md:items-stretch overflow-hidden">
              {/* Colonna Info Canzone */}
              <div className="flex-shrink-0 flex flex-col items-center text-center p-6 bg-black/30 rounded-lg w-full md:w-1/3">
                <img src={song.albumArt} alt={`Copertina di ${song.title}`} className="w-48 h-48 md:w-64 md:h-64 rounded-lg shadow-lg mb-6" />
                <h1 className="text-2xl font-bold">{song.title}</h1>
                <h2 className="text-lg text-gray-400">{song.artist}</h2>
                <div className="mt-auto w-full pt-6">
                  <PlayerControls 
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    currentTime={currentTime}
                    duration={song.duration}
                    onSeek={seek}
                    isCarMode={false}
                  />
                </div>
              </div>
              
              {/* Colonna Testi */}
              <div className="flex-grow w-full md:w-2/3 bg-black/30 rounded-lg overflow-hidden flex flex-col">
                <LyricsDisplay lyrics={lyrics.synced} rawLyrics={lyrics.raw} currentLineIndex={currentLineIndex} isCarMode={false} />
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
};

export default App;
