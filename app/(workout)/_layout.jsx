import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const WorkoutLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="view-workout" options={{ headerShown: false }} />
        <Stack.Screen name="active-workout" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
};

// add gesture enabled false to "in progress" later

export default WorkoutLayout;
