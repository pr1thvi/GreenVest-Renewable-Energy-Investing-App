import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
import { InvestmentsProvider } from '@/context/InvestmentsContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <InvestmentsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="project/[id]" 
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
              headerShown: false
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </InvestmentsProvider>
    </ThemeProvider>
  );
}