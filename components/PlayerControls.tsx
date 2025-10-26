
import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { PlayIcon, PauseIcon } from './Icon';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isCarMode: boolean;
}

// Formatta il tempo da secondi a stringa mm:ss
const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const { width } = Dimensions.get('window');

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  onSeek,
  isCarMode,
}) => {
  const handleSeek = useCallback((value: number) => {
    onSeek(value);
  }, [onSeek]);

  if (isCarMode) {
    return (
      <View style={styles.carModeContainer}>
        <TouchableOpacity
          style={styles.carModeButton}
          onPress={onPlayPause}
        >
          {isPlaying ? (
            <PauseIcon size={64} color="#000" />
          ) : (
            <PlayIcon size={64} color="#000" />
          )}
        </TouchableOpacity>
        <Text style={styles.carModeTime}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.playButton}
        onPress={onPlayPause}
      >
        {isPlaying ? (
          <PauseIcon size={32} color="#fff" />
        ) : (
          <PlayIcon size={32} color="#fff" />
        )}
      </TouchableOpacity>

      <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={currentTime}
        onValueChange={handleSeek}
        minimumTrackTintColor="#34D399"
        maximumTrackTintColor="#4B5563"
        thumbStyle={styles.sliderThumb}
      />
      
      <Text style={styles.timeText}>{formatTime(duration)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(75, 85, 99, 0.5)',
    borderRadius: 8,
    gap: 16,
  },
  playButton: {
    padding: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
    minWidth: 48,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    height: 20,
  },
  sliderThumb: {
    backgroundColor: '#34D399',
    width: 20,
    height: 20,
  },
  carModeContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    gap: 32,
  },
  carModeButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 80,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  carModeTime: {
    fontSize: 32,
    fontFamily: 'monospace',
    color: '#fff',
    fontWeight: 'bold',
  },
});
