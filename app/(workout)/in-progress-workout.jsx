import { View, Text } from "react-native";
import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const WorkoutContext = createContext();

function workoutReducer(state, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const WorkoutProvider = ({ children }) => {
  const fullWorkout = useLocalSearchParams();
  const [state, dispatch] = useReducer(workoutReducer, {
    fullWorkout: fullWorkout,
    currentExercise: 0, // corresponds to workout.exerciseIds index
    currentSet: 0, // corresponds to exercise.setIds index
  });

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

const InProgressWorkoutPage = () => {
  const { state, dispatch } = useContext(WorkoutContext);
  
  return (
    <>
      <View className="mt-2">
        
      </View>
    </>
  );
};

const InProgressWorkout = () => {
  return (
    <WorkoutProvider>
      <SafeAreaView className="bg-white-100 h-full px-8">
        <InProgressWorkoutPage />
      </SafeAreaView>
    </WorkoutProvider>
  );
};

export default InProgressWorkout;
