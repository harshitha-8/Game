import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useAppStore } from '@/src/store/useAppStore';
import { colors } from '@/constants/Theme';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const DroneFarmTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { loadProgress } = useAppStore();

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider value={DroneFarmTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="mission/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="simulator/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="results/[id]" options={{ animation: 'fade' }} />
      </Stack>
    </ThemeProvider>
  );
}
