import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const EditorLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="edit-workout" options={{ headerShown: false }} />
        <Stack.Screen name="new-workout" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
};

export default EditorLayout;
