export type ThemeName = 'sakura' | 'lavender' | 'sky' | 'cream';

export interface ThemePalette {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  bgGradient: string;
  text: string;
  textMuted: string;
  border: string;
  flowerTint: string;
  label: string;
}

export const themes: Record<ThemeName, ThemePalette> = {
  sakura: {
    primary: '#FFB7C5',
    secondary: '#FFE4E1',
    accent: '#FF69B4',
    bg: '#FFF5F7',
    bgGradient: 'linear-gradient(135deg, #FFF5F7 0%, #FFE4E1 100%)',
    text: '#5D4E6D',
    textMuted: '#9B8AA5',
    border: '#FFD1DC',
    flowerTint: '#FFB7C5',
    label: 'Sakura',
  },
  lavender: {
    primary: '#D8BFD8',
    secondary: '#E6E6FA',
    accent: '#9370DB',
    bg: '#F8F4FF',
    bgGradient: 'linear-gradient(135deg, #F8F4FF 0%, #E6E6FA 100%)',
    text: '#4A4A6A',
    textMuted: '#8A8AAA',
    border: '#D8BFD8',
    flowerTint: '#D8BFD8',
    label: 'Lavender',
  },
  sky: {
    primary: '#B0E0E6',
    secondary: '#E0FFFF',
    accent: '#87CEEB',
    bg: '#F0F8FF',
    bgGradient: 'linear-gradient(135deg, #F0F8FF 0%, #E0FFFF 100%)',
    text: '#2F4F4F',
    textMuted: '#5F9F9F',
    border: '#B0E0E6',
    flowerTint: '#B0E0E6',
    label: 'Sky',
  },
  cream: {
    primary: '#F5DEB3',
    secondary: '#FFF8DC',
    accent: '#DEB887',
    bg: '#FFFAF0',
    bgGradient: 'linear-gradient(135deg, #FFFAF0 0%, #FFF8DC 100%)',
    text: '#5C4033',
    textMuted: '#8B7355',
    border: '#F5DEB3',
    flowerTint: '#F5DEB3',
    label: 'Cream',
  },
};

export const THEME_STORAGE_KEY = 'bloomfit-theme';
export const DEFAULT_THEME: ThemeName = 'sakura';
