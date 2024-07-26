import { SQLiteProvider } from "expo-sqlite";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { setupDatabase } from "../database/database";

// displays a splash screen until fonts are loaded
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Geist-Ultralight": require("../assets/fonts/Geist-UltraLight.ttf"),
    "Geist-Thin": require("../assets/fonts/Geist-Thin.ttf"),
    "Geist-Light": require("../assets/fonts/Geist-Light.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
    "Geist-Bold": require("../assets/fonts/Geist-Bold.ttf"),
    "Geist-Black": require("../assets/fonts/Geist-Black.ttf"),
    "Geist-UltraBlack": require("../assets/fonts/Geist-UltraBlack.ttf"),
  });

  // handles font loading
  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // if the fonts do not load without error for some reason
  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="gymrat-data.db" onInit={setupDatabase}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(editor)" options={{ headerShown: false }} />
        <Stack.Screen name="(workout)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </SQLiteProvider>
  );
};

export default RootLayout;
