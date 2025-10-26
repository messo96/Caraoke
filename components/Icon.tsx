
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Utilizziamo le icone di Expo Vector Icons per React Native
interface IconProps {
  size?: number;
  color?: string;
}

export const PlayIcon: React.FC<IconProps> = ({ size = 24, color = '#fff' }) => (
  <Ionicons name="play" size={size} color={color} />
);

export const PauseIcon: React.FC<IconProps> = ({ size = 24, color = '#fff' }) => (
  <Ionicons name="pause" size={size} color={color} />
);

export const CarIcon: React.FC<IconProps> = ({ size = 24, color = '#fff' }) => (
  <Ionicons name="car" size={size} color={color} />
);

export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = '#fff' }) => (
  <Ionicons name="search" size={size} color={color} />
);
