/**
 * Servizio per l'integrazione con Android Auto
 * Gestisce i metadata media e i controlli per Android Auto
 */

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { Song, LyricLine } from '../types';

interface MediaMetadata {
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  duration?: number;
}

/**
 * Configura Android Auto per mostrare le informazioni della canzone corrente
 */
export class AndroidAutoService {
  private static instance: AndroidAutoService;
  private currentSong: Song | null = null;
  private isPlaying: boolean = false;
  private currentLyric: string = '';

  private constructor() {
    this.setupNotifications();
  }

  public static getInstance(): AndroidAutoService {
    if (!AndroidAutoService.instance) {
      AndroidAutoService.instance = new AndroidAutoService();
    }
    return AndroidAutoService.instance;
  }

  /**
   * Configura le notifiche media per Android Auto
   */
  private async setupNotifications() {
    if (Platform.OS !== 'android') return;

    await Notifications.setNotificationChannelAsync('media', {
      name: 'Media Playback',
      importance: Notifications.AndroidImportance.LOW,
      sound: null,
      vibrationPattern: null,
      enableVibrate: false,
      showBadge: false,
      enableLights: false,
    });
  }

  /**
   * Aggiorna i metadata della canzone corrente
   */
  public async updateNowPlaying(song: Song, isPlaying: boolean, currentLyric?: string) {
    if (Platform.OS !== 'android') return;

    this.currentSong = song;
    this.isPlaying = isPlaying;
    this.currentLyric = currentLyric || '';

    try {
      // Crea una notifica media-style per Android Auto
      await Notifications.scheduleNotificationAsync({
        content: {
          title: song.title,
          body: `${song.artist}${currentLyric ? ` • ${currentLyric}` : ''}`,
          data: {
            type: 'media',
            song: song,
            isPlaying: isPlaying,
            lyric: currentLyric,
          },
          categoryIdentifier: 'media',
          sound: false,
        },
        trigger: null, // Mostra immediatamente
      });
    } catch (error) {
      console.error('Errore aggiornamento Now Playing:', error);
    }
  }

  /**
   * Aggiorna solo il testo corrente senza cambiare la canzone
   */
  public async updateCurrentLyric(lyric: string) {
    if (Platform.OS !== 'android' || !this.currentSong) return;

    this.currentLyric = lyric;
    await this.updateNowPlaying(this.currentSong, this.isPlaying, lyric);
  }

  /**
   * Pulisce i metadata quando la riproduzione si ferma
   */
  public async clearNowPlaying() {
    if (Platform.OS !== 'android') return;

    this.currentSong = null;
    this.isPlaying = false;
    this.currentLyric = '';

    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Errore pulizia Now Playing:', error);
    }
  }

  /**
   * Controlla se Android Auto è connesso
   * Nota: Questa è una simulazione - la detection reale richiede codice nativo
   */
  public isAndroidAutoConnected(): boolean {
    if (Platform.OS !== 'android') return false;
    
    // In una implementazione reale, questo controllerebbe:
    // - UiModeManager.getCurrentModeType() == Configuration.UI_MODE_TYPE_CAR
    // - CarConnection API
    // Per ora ritorniamo false come default
    return false;
  }

  /**
   * Ottiene i controlli media per Android Auto
   */
  public getMediaControls() {
    return {
      play: () => {
        this.isPlaying = true;
        if (this.currentSong) {
          this.updateNowPlaying(this.currentSong, true, this.currentLyric);
        }
      },
      pause: () => {
        this.isPlaying = false;
        if (this.currentSong) {
          this.updateNowPlaying(this.currentSong, false, this.currentLyric);
        }
      },
      stop: () => {
        this.clearNowPlaying();
      },
    };
  }
}

/**
 * Hook helper per utilizzare AndroidAutoService nei componenti React
 */
export const useAndroidAuto = () => {
  const service = AndroidAutoService.getInstance();

  return {
    updateNowPlaying: (song: Song, isPlaying: boolean, currentLyric?: string) =>
      service.updateNowPlaying(song, isPlaying, currentLyric),
    updateCurrentLyric: (lyric: string) => service.updateCurrentLyric(lyric),
    clearNowPlaying: () => service.clearNowPlaying(),
    isConnected: service.isAndroidAutoConnected(),
    controls: service.getMediaControls(),
  };
};

export default AndroidAutoService;
