
import React, { useState } from 'react';
import { SearchIcon } from './Icon';

interface SongInputFormProps {
  onSearch: (artist: string, title: string) => void;
  isLoading: boolean;
}

export const SongInputForm: React.FC<SongInputFormProps> = ({ onSearch, isLoading }) => {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (artist && title) {
      onSearch(artist, title);
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto p-8 backdrop-blur-sm bg-black/30 rounded-2xl shadow-2xl border border-gray-700">
      <h2 className="text-3xl font-bold text-center mb-6 text-green-300">Karaoke Car</h2>
      <p className="text-center text-gray-400 mb-8">
        Inserisci artista e titolo per trovare i testi sincronizzati.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="artist" className="block text-sm font-medium text-gray-300 mb-2">Artista</label>
          <input
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="es. Queen"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            required
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Titolo della canzone</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="es. Bohemian Rhapsody"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>Ricerca...</span>
            </>
          ) : (
            <>
              <SearchIcon className="w-5 h-5" />
              <span>Cerca Testi</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
