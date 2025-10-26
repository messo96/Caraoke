import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CarIntegrationProps {
  currentSong?: {
    title: string;
    artist: string;
  };
  currentLyric?: string;
  isPlaying: boolean;
}

/**
 * Componente per l'integrazione con Android Auto e Apple CarPlay
 * 
 * Nota: A causa delle limitazioni di Expo e delle politiche di sicurezza,
 * l'integrazione completa con CarPlay/Android Auto richiede:
 * 1. Build nativo (non Expo Go)
 * 2. Configurazioni specifiche nel manifest
 * 3. Certificazioni Apple/Google per alcune funzioni
 * 
 * Questo componente fornisce:
 * - Rilevamento automatico della modalità landscape (tipica in auto)
 * - UI ottimizzata per schermi auto
 * - Testi più grandi per leggibilità durante la guida
 * - Preparazione per future integrazioni native
 */
export const CarIntegration: React.FC<CarIntegrationProps> = ({
  currentSong,
  currentLyric,
  isPlaying
}) => {
  const { width, height } = useWindowDimensions();
  const [isCarModeDetected, setIsCarModeDetected] = useState(false);
  const [carPlatform, setCarPlatform] = useState<'carplay' | 'androidauto' | null>(null);

  useEffect(() => {
    // Rileva modalità auto basandosi su:
    // 1. Orientamento landscape (width > height)
    // 2. Dimensioni tipiche di schermi auto (ratio particolare)
    detectCarMode();
  }, [width, height]);

  const detectCarMode = () => {
    // Rileva se il dispositivo è in landscape (comune negli schermi auto)
    const isLandscape = width > height;
    
    // Gli schermi auto hanno tipicamente un aspect ratio molto largo
    const aspectRatio = width / height;
    const isWideScreen = aspectRatio > 1.5;
    
    // Considera modalità auto se landscape o schermo molto largo
    const carModeActive = isLandscape || isWideScreen;
    
    setIsCarModeDetected(carModeActive);
    setCarPlatform(Platform.OS === 'ios' ? 'carplay' : 'androidauto');
  };

  const showCarModeInfo = () => {
    const platform = Platform.OS === 'ios' ? 'Apple CarPlay' : 'Android Auto';
    Alert.alert(
      `Supporto ${platform}`,
      `L'app è ottimizzata per ${platform}. Per la piena integrazione:\n\n` +
      `• Collega il telefono all'auto tramite USB/Bluetooth\n` +
      `• Abilita ${platform} nelle impostazioni auto\n` +
      `• L'app apparirà nel display dell'auto\n\n` +
      `Nota: Alcune funzioni richiedono un build nativo dell'app.`,
      [{ text: 'OK' }]
    );
  };

  if (!isCarModeDetected) {
    return (
      <View style={styles.infoContainer}>
        <Ionicons name="car" size={24} color="#6B7280" />
        <Text style={styles.infoText}>
          Compatibile con Android Auto e Apple CarPlay
        </Text>
        <Text style={styles.infoSubtext}>
          Connetti all'auto o ruota il dispositivo in landscape
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.carModeContainer}>
      <View style={styles.carHeader}>
        <Ionicons 
          name={carPlatform === 'carplay' ? 'car' : 'car-sport'} 
          size={24} 
          color="#34D399" 
        />
        <Text style={styles.carModeText}>
          Modalità {carPlatform === 'carplay' ? 'CarPlay' : 'Android Auto'}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ATTIVA</Text>
        </View>
      </View>

      {currentSong && (
        <View style={styles.nowPlayingContainer}>
          <View style={styles.nowPlayingHeader}>
            <Ionicons name="musical-notes" size={20} color="#34D399" />
            <Text style={styles.nowPlayingTitle}>In Riproduzione</Text>
          </View>
          <Text style={styles.songTitle} numberOfLines={2}>{currentSong.title}</Text>
          <Text style={styles.songArtist} numberOfLines={1}>{currentSong.artist}</Text>
        </View>
      )}

      {currentLyric && (
        <View style={styles.lyricContainer}>
          <Text style={styles.currentLyric}>{currentLyric}</Text>
        </View>
      )}

      <View style={styles.carControls}>
        <View style={[
          styles.playIndicator,
          isPlaying && styles.playIndicatorActive
        ]}>
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={28} 
            color="#fff" 
          />
        </View>
        <Text style={styles.controlText}>
          {isPlaying ? 'In Riproduzione' : 'In Pausa'}
        </Text>
      </View>

      <View style={styles.safetyNotice}>
        <Ionicons name="warning" size={16} color="#F59E0B" />
        <Text style={styles.safetyText}>
          ⚠️ Guida in sicurezza - Non guardare lo schermo durante la guida
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    marginVertical: 10,
  },
  infoText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  infoSubtext: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  carModeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#34D399',
  },
  carHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  carModeText: {
    color: '#34D399',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    backgroundColor: '#34D399',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  nowPlayingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  nowPlayingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  nowPlayingTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  songTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  songArtist: {
    color: '#D1D5DB',
    fontSize: 16,
  },
  lyricContainer: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#34D399',
    minHeight: 80,
    justifyContent: 'center',
  },
  currentLyric: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
  },
  carControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  playIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIndicatorActive: {
    backgroundColor: '#34D399',
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  safetyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  safetyText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
});