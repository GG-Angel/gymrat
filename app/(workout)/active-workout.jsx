import { View, Text, TouchableOpacity } from "react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const WorkoutContext = createContext();

function workoutReducer(state, action) {
  switch (action.type) {
    case "PREVIOUS_SET":
      const isFirstExercise = state.exerciseIndex === 0;
      const isFirstSet = state.setIndex === 0;

      if (isFirstSet) {
        if (isFirstExercise) {
          // start of workout, return same state
          return state;
        } else {
          // go to previous exercise
          const prevExerciseIndex = state.exerciseIndex - 1;
          const prevExerciseId = state.routine.workout.exerciseIds[prevExerciseIndex];
          const prevExercise = state.routine.exercises[prevExerciseId];
          const prevSetIndex = prevExercise.setIds.length - 1;

          return {
            ...state,
            exerciseIndex: prevExerciseIndex,
            setIndex: prevSetIndex
          }
        }
      } else {
        // go to previous set
        return {
          ...state,
          setIndex: state.setIndex - 1
        }
      }
      
    case "NEXT_SET":
      const currentExerciseId = state.routine.workout.exerciseIds[state.exerciseIndex];
      const currentExercise = state.routine.exercises[currentExerciseId];
      
      const isLastExercise = state.exerciseIndex === state.routine.workout.exerciseIds.length - 1;
      const isLastSet = state.setIndex === currentExercise.setIds.length - 1;

      if (isLastSet) {
        if (isLastExercise) {
          // workout finished, repeat
          return { 
            ...state,
            exerciseIndex: 0,
            setIndex: 0
          }
        } else {
          // go to next exercise
          return {
            ...state,
            exerciseIndex: state.exerciseIndex + 1,
            setIndex: 0
          }
        }
      } else {
        // go to next set
        return {
          ...state,
          setIndex: state.setIndex + 1
        }
      }
    default:
      return state;
  }
}

const WorkoutProvider = ({ children }) => {
  const params = useLocalSearchParams();
  const routine = JSON.parse(params.jsonWorkout);

  const [state, dispatch] = useReducer(workoutReducer, {
    routine: routine,
    exerciseIndex: 0, // corresponds to workout.exerciseIds index
    setIndex: 0,      // corresponds to exercise.setIds index
  });

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  // useEffect(() => {
  //   console.log(JSON.stringify(state, null, 2))
  // }, [state]);

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
        <Text className="text-gray font-gregular text-csub"></Text>
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => dispatch({ type: "PREVIOUS_SET" })}>
            <Text>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch({ type: "NEXT_SET" })}>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const ActiveWorkout = () => {
  return (
    <WorkoutProvider>
      <SafeAreaView className="bg-white-100 h-full px-8">
        <InProgressWorkoutPage />
      </SafeAreaView>
    </WorkoutProvider>
  );
};

export default ActiveWorkout;
