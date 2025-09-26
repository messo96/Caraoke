
import { GoogleGenAI } from "@google/genai";
import type { Lyrics, LyricLine } from '../types';

// Inizializza il client dell'API Gemini.
// La chiave API deve essere fornita tramite la variabile d'ambiente process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analizza una stringa in formato LRC e la converte in un array di oggetti LyricLine.
 * @param {string} lrcString - La stringa di testo in formato LRC.
 * @returns {LyricLine[]} Un array di oggetti LyricLine.
 */
const parseLRC = (lrcString: string): LyricLine[] => {
  const lines = lrcString.split('\n');
  const lyricLines: LyricLine[] = [];

  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  for (const line of lines) {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3].padEnd(3, '0'), 10); // Pad to 3 digits for consistency
      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeRegex, '').trim();

      if (text) {
        lyricLines.push({ time, text });
      }
    }
  }

  // Ordina i testi per tempo, poiché l'ordine non è garantito.
  return lyricLines.sort((a, b) => a.time - b.time);
};

/**
 * Richiede i testi di una canzone all'API Gemini.
 * @param {string} title - Il titolo della canzone.
 * @param {string} artist - L'artista della canzone.
 * @returns {Promise<Lyrics>} Una promessa che si risolve con i testi sincronizzati e grezzi.
 */
export const fetchLyrics = async (title: string, artist: string): Promise<Lyrics> => {
  const prompt = `
    Generate synchronized lyrics in LRC format for the song "${title}" by "${artist}".
    The format for each line must be exactly [mm:ss.xx] followed by the lyric text.
    For example: [00:23.45] This is a sample lyric line.
    
    If you cannot find synchronized lyrics, provide the full plain text lyrics without any timestamps.
    Start the plain text with a marker like "PLAIN_TEXT:".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text;

    if (text.includes('[') && text.includes(']')) {
      const synced = parseLRC(text);
      if (synced.length > 0) {
        return {
          synced,
          raw: text,
        };
      }
    }

    // Fallback a testo non sincronizzato
    const rawText = text.replace(/^PLAIN_TEXT:/, '').trim();
    return {
      synced: [],
      raw: rawText || "Testo non disponibile.",
    };

  } catch (error) {
    console.error("Errore durante la chiamata all'API Gemini:", error);
    throw new Error("Impossibile recuperare i testi. Controlla la tua chiave API e riprova.");
  }
};
