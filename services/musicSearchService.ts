/**
 * Servizio per la ricerca e l'autocompletamento delle canzoni
 * Utilizza l'API pubblica di MusicBrainz per cercare canzoni
 */

export interface SongSuggestion {
  id: string;
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  coverArt?: string;
  duration?: number;
}

const MUSICBRAINZ_API = 'https://musicbrainz.org/ws/2';
const COVERART_API = 'https://coverartarchive.org';
const SEARCH_DELAY = 1000; // Rate limiting

let searchTimeout: NodeJS.Timeout | null = null;

/**
 * Cerca canzoni in base a una query
 * @param query - Testo di ricerca (può includere artista e titolo)
 * @returns Array di suggerimenti
 */
export const searchSongs = async (query: string): Promise<SongSuggestion[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    
    // Cerca nelle registrazioni di MusicBrainz
    const response = await fetch(
      `${MUSICBRAINZ_API}/recording?query=${encodedQuery}&fmt=json&limit=10`,
      {
        headers: {
          'User-Agent': 'KaraokeCar/1.0.0 (karaoke app)',
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error('Errore nella ricerca');
    }

    const data = await response.json();
    
    if (!data.recordings || data.recordings.length === 0) {
      return [];
    }

    // Mappa i risultati al nostro formato
    const suggestions: SongSuggestion[] = await Promise.all(
      data.recordings.slice(0, 8).map(async (recording: any) => {
        const artistName = recording['artist-credit']?.[0]?.name || 'Artista Sconosciuto';
        const title = recording.title || 'Titolo Sconosciuto';
        const releaseId = recording.releases?.[0]?.id;
        
        // Prova a ottenere la cover art
        let coverArt: string | undefined;
        if (releaseId) {
          try {
            const coverResponse = await fetch(
              `${COVERART_API}/release/${releaseId}`,
              {
                headers: {
                  'Accept': 'application/json',
                }
              }
            );
            
            if (coverResponse.ok) {
              const coverData = await coverResponse.json();
              coverArt = coverData.images?.[0]?.thumbnails?.small || 
                        coverData.images?.[0]?.image;
            }
          } catch (err) {
            // Ignora errori nella cover art
          }
        }
        
        // Fallback per cover art
        if (!coverArt) {
          coverArt = `https://picsum.photos/seed/${title}${artistName}/200`;
        }

        return {
          id: recording.id,
          title,
          artist: artistName,
          album: recording.releases?.[0]?.title,
          releaseDate: recording.releases?.[0]?.date,
          coverArt,
          duration: recording.length ? Math.floor(recording.length / 1000) : undefined,
        };
      })
    );

    return suggestions;
  } catch (error) {
    console.error('Errore nella ricerca musicale:', error);
    return [];
  }
};

/**
 * Cerca canzoni con debounce per evitare troppe richieste
 * @param query - Testo di ricerca
 * @param callback - Funzione chiamata con i risultati
 */
export const searchSongsDebounced = (
  query: string, 
  callback: (results: SongSuggestion[]) => void
): void => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(async () => {
    const results = await searchSongs(query);
    callback(results);
  }, SEARCH_DELAY);
};

/**
 * Cerca artisti in base a una query
 * @param query - Nome dell'artista
 * @returns Array di nomi di artisti
 */
export const searchArtists = async (query: string): Promise<string[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    
    const response = await fetch(
      `${MUSICBRAINZ_API}/artist?query=${encodedQuery}&fmt=json&limit=10`,
      {
        headers: {
          'User-Agent': 'KaraokeCar/1.0.0 (karaoke app)',
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error('Errore nella ricerca');
    }

    const data = await response.json();
    
    if (!data.artists || data.artists.length === 0) {
      return [];
    }

    return data.artists
      .slice(0, 8)
      .map((artist: any) => artist.name)
      .filter((name: string) => name && name.trim().length > 0);
  } catch (error) {
    console.error('Errore nella ricerca artisti:', error);
    return [];
  }
};
