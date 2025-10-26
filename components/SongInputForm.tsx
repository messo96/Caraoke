
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchSongsDebounced, type SongSuggestion } from '../services/musicSearchService';

interface SongInputFormProps {
  onSearch: (artist: string, title: string) => void;
  isLoading: boolean;
}

const { width } = Dimensions.get('window');

export const SongInputForm: React.FC<SongInputFormProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Cerca canzoni quando l'utente digita
  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsSearching(true);
      setShowSuggestions(true);
      
      searchSongsDebounced(query, (results) => {
        setSuggestions(results);
        setIsSearching(false);
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }
  }, [query]);

  const handleSelectSong = (song: SongSuggestion) => {
    setQuery('');
    setShowSuggestions(false);
    setSuggestions([]);
    onSearch(song.artist, song.title);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Karaoke Car</Text>
      <Text style={styles.subtitle}>
        Cerca una canzone per trovare i testi sincronizzati
      </Text>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder="es. Queen - Bohemian Rhapsody"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              autoCorrect={false}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            {isSearching && (
              <ActivityIndicator size="small" color="#34D399" style={styles.loadingIcon} />
            )}
          </View>
        </View>
        
        {showSuggestions && suggestions.length > 0 && (
          <ScrollView 
            style={styles.suggestionsContainer}
            keyboardShouldPersistTaps="handled"
          >
            {suggestions.map((song) => (
              <TouchableOpacity
                key={song.id}
                style={styles.suggestionItem}
                onPress={() => handleSelectSong(song)}
                disabled={isLoading}
              >
                <Image
                  source={{ uri: song.coverArt }}
                  style={styles.coverArt}
                  defaultSource={require('../assets/icon.png')}
                />
                <View style={styles.suggestionInfo}>
                  <Text style={styles.suggestionTitle} numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text style={styles.suggestionArtist} numberOfLines={1}>
                    {song.artist}
                  </Text>
                  {song.album && (
                    <Text style={styles.suggestionAlbum} numberOfLines={1}>
                      {song.album}
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {showSuggestions && !isSearching && query.length >= 2 && suggestions.length === 0 && (
          <View style={styles.noResults}>
            <Ionicons name="musical-notes-outline" size={32} color="#6B7280" />
            <Text style={styles.noResultsText}>
              Nessuna canzone trovata
            </Text>
            <Text style={styles.noResultsHint}>
              Prova con un altro termine di ricerca
            </Text>
          </View>
        )}

        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
          <Text style={styles.hintText}>
            Digita almeno 2 caratteri per iniziare la ricerca
          </Text>
        </View>
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#34D399',
  },
  subtitle: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginBottom: 32,
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  loadingIcon: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    maxHeight: 300,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  coverArt: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#374151',
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  suggestionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  suggestionArtist: {
    color: '#D1D5DB',
    fontSize: 14,
    marginBottom: 2,
  },
  suggestionAlbum: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  noResults: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  noResultsText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  noResultsHint: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  hintText: {
    color: '#6B7280',
    fontSize: 12,
  },
});
