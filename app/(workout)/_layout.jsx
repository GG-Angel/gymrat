import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const WorkoutLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="view-workout" options={{ headerShown: false }} />
        <Stack.Screen name="do-workout" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
};

export default WorkoutLayout;
