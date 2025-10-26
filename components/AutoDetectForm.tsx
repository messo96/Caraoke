import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMediaDetection } from '../hooks/useMediaDetection';

interface AutoDetectFormProps {
  onTrackDetected: (artist: string, title: string) => void;
  isLoading: boolean;
}

export const AutoDetectForm: React.FC<AutoDetectFormProps> = ({
  onTrackDetected,
  isLoading
}) => {
  const {
    currentTrack,
    isDetecting,
    hasPermission,
    error,
    startDetection,
    stopDetection,
    refreshTrack,
    requestPermissions,
  } = useMediaDetection({
    pollInterval: 10000, // Controlla ogni 10 secondi
    autoStart: false,
  });

  const [autoRefresh, setAutoRefresh] = useState(false);

  // Quando rileva una nuova traccia, chiama la callback
  useEffect(() => {
    if (currentTrack && currentTrack.title !== 'Artista Sconosciuto') {
      onTrackDetected(currentTrack.artist, currentTrack.title);
    }
  }, [currentTrack, onTrackDetected]);

  const handleRequestPermissions = async () => {
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert(
        'Permessi Richiesti',
        'Per rilevare automaticamente la musica in riproduzione, concedi i permessi per accedere alla libreria multimediale.',
        [
          { text: 'Annulla', style: 'cancel' },
          { text: 'Impostazioni', onPress: () => {
            // Qui potresti aprire le impostazioni dell'app
          }},
        ]
      );
    }
  };

  const handleToggleDetection = () => {
    if (!hasPermission) {
      handleRequestPermissions();
      return;
    }

    if (isDetecting) {
      stopDetection();
      setAutoRefresh(false);
    } else {
      startDetection();
      setAutoRefresh(true);
    }
  };

  const handleManualRefresh = () => {
    if (!hasPermission) {
      handleRequestPermissions();
      return;
    }
    refreshTrack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rilevamento Automatico</Text>
        <Text style={styles.subtitle}>
          Rileva automaticamente la musica in riproduzione sul dispositivo
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!hasPermission && (
        <View style={styles.permissionContainer}>
          <Ionicons name="warning" size={24} color="#F59E0B" />
          <Text style={styles.permissionText}>
            Permessi richiesti per rilevare la musica
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={handleRequestPermissions}
          >
            <Text style={styles.permissionButtonText}>Concedi Permessi</Text>
          </TouchableOpacity>
        </View>
      )}

      {hasPermission && (
        <>
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isDetecting && styles.toggleButtonActive
              ]}
              onPress={handleToggleDetection}
              disabled={isLoading}
            >
              <Ionicons
                name={isDetecting ? "pause" : "play"}
                size={20}
                color="#fff"
              />
              <Text style={styles.toggleButtonText}>
                {isDetecting ? 'Ferma Rilevamento' : 'Avvia Rilevamento'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleManualRefresh}
              disabled={isLoading || isDetecting}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="refresh" size={20} color="#fff" />
              )}
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          {currentTrack && (
            <View style={styles.trackContainer}>
              <View style={styles.trackInfo}>
                <Ionicons name="musical-notes" size={20} color="#34D399" />
                <View style={styles.trackDetails}>
                  <Text style={styles.trackTitle}>{currentTrack.title}</Text>
                  <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
                  {currentTrack.album && (
                    <Text style={styles.trackAlbum}>{currentTrack.album}</Text>
                  )}
                </View>
              </View>
              
              {autoRefresh && (
                <View style={styles.statusIndicator}>
                  <Ionicons name="radio" size={16} color="#34D399" />
                  <Text style={styles.statusText}>Auto-rilevamento attivo</Text>
                </View>
              )}
            </View>
          )}

          <Text style={styles.infoText}>
            💡 Nota: Il rilevamento automatico potrebbe essere limitato dalle impostazioni di sicurezza del sistema operativo.
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.5)',
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34D399',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#F87171',
    fontSize: 14,
    textAlign: 'center',
  },
  permissionContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    gap: 12,
  },
  permissionText: {
    color: '#F59E0B',
    fontSize: 16,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#DC2626',
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  trackContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  trackDetails: {
    flex: 1,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackArtist: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  trackAlbum: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '500',
  },
  infoText: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});