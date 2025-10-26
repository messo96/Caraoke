
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import type { LyricLine } from '../types';

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  rawLyrics: string;
  currentLineIndex: number;
  isCarMode: boolean;
}

const { width, height } = Dimensions.get('window');

export const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ 
  lyrics, 
  rawLyrics, 
  currentLineIndex, 
  isCarMode 
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const lineRefs = useRef<{ [key: number]: View | null }>({});
  
  // Gestisce lo scroll automatico per mantenere la riga attiva al centro.
  useEffect(() => {
    if (scrollViewRef.current && lineRefs.current[currentLineIndex]) {
      const activeLineRef = lineRefs.current[currentLineIndex];
      if (activeLineRef) {
        activeLineRef.measureLayout(
          scrollViewRef.current.getInnerViewNode(),
          (x, y, width, height) => {
            const scrollY = y - (height / 2) + (height / 4);
            scrollViewRef.current?.scrollTo({ y: scrollY, animated: true });
          },
          () => {}
        );
      }
    }
  }, [currentLineIndex]);

  if (lyrics.length > 0) {
    return (
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          isCarMode && styles.carModeContent
        ]}
        showsVerticalScrollIndicator={false}
      >
        {lyrics.map((line, index) => {
          const isActive = index === currentLineIndex;
          const isPast = index < currentLineIndex;
          
          let textStyle = [styles.lyricLine];
          
          if (isCarMode) {
            textStyle.push(styles.carModeText);
            if (isActive) {
              textStyle.push(styles.carModeActive);
            } else {
              textStyle.push(styles.carModeInactive);
            }
          } else {
            textStyle.push(styles.normalModeText);
            if (isActive) {
              textStyle.push(styles.normalModeActive);
            } else if (isPast) {
              textStyle.push(styles.normalModePast);
            } else {
              textStyle.push(styles.normalModeInactive);
            }
          }

          return (
            <View
              key={`${line.time}-${index}`}
              ref={(ref) => {
                lineRefs.current[index] = ref;
              }}
              style={styles.lineContainer}
            >
              <Text style={textStyle}>
                {line.text}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    );
  }

  // Fallback per testi non sincronizzati
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.rawLyricsContainer}
    >
      <Text style={[
        styles.rawLyricsTitle,
        isCarMode && styles.carModeRawTitle
      ]}>
        Testo non sincronizzato
      </Text>
      <Text style={[
        styles.rawLyricsText,
        isCarMode && styles.carModeRawText
      ]}>
        {rawLyrics}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  carModeContent: {
    paddingVertical: 16,
  },
  lineContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  lyricLine: {
    textAlign: 'center',
    fontWeight: '600',
  },
  normalModeText: {
    fontSize: 20,
    lineHeight: 32,
  },
  normalModeActive: {
    color: '#34D399',
    transform: [{ scale: 1.05 }],
  },
  normalModePast: {
    color: '#6B7280',
  },
  normalModeInactive: {
    color: '#D1D5DB',
  },
  carModeText: {
    fontSize: 32,
    lineHeight: 48,
    fontWeight: 'bold',
  },
  carModeActive: {
    color: '#FDE047',
    transform: [{ scale: 1.1 }],
  },
  carModeInactive: {
    color: '#E5E7EB',
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
  rawLyricsContainer: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  rawLyricsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  carModeRawTitle: {
    fontSize: 24,
  },
  rawLyricsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  carModeRawText: {
    fontSize: 20,
    lineHeight: 32,
  },
});
