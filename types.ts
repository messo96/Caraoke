
// types.ts

/**
 * @interface Song
 * Rappresenta le informazioni di base di una canzone.
 */
export interface Song {
  title: string;
  artist: string;
  albumArt: string;
  duration: number; // Durata in secondi
}

/**
 * @interface LyricLine
 * Rappresenta una singola riga di testo sincronizzata.
 */
export interface LyricLine {
  time: number; // Tempo di inizio in secondi
  text: string;
}

/**
 * @interface Lyrics
 * Contiene sia i testi sincronizzati che il testo grezzo (non sincronizzato).
 */
export interface Lyrics {
  synced: LyricLine[];
  raw: string;
}
