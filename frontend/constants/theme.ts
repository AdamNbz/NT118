/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#F73658';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#A8A8A9',
    tabIconDefault: '#A8A8A9',
    tabIconSelected: tintColorLight,
    primary: '#F73658',
    secondary: '#4392F9',
    neutral: '#A8A8A9',
    surface: '#FFFFFF',
    error: '#FF6768',
    success: '#4CAF50',
    border: '#E0E0E0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#F73658',
    secondary: '#4392F9',
  },
};

export const Fonts = {
  montserrat: {
    regular: 'Montserrat_400Regular',
    medium: 'Montserrat_500Medium',
    semibold: 'Montserrat_600SemiBold',
    bold: 'Montserrat_700Bold',
    extrabold: 'Montserrat_800ExtraBold',
  },
  poppins: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    bold: 'Poppins_700Bold',
  },
  libreCaslon: {
    bold: 'LibreCaslonText_700Bold',
  },
};
