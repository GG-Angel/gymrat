import { View, Text, TouchableOpacity } from "react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
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
          const prevExerciseId =
            state.workout.exerciseIds[prevExerciseIndex];
          const prevExercise = state.exercises[prevExerciseId];
          const prevSetIndex = prevExercise.setIds.length - 1;

          return {
            ...state,
            exerciseIndex: prevExerciseIndex,
            setIndex: prevSetIndex,
          };
        }
      } else {
        // go to previous set
        return {
          ...state,
          setIndex: state.setIndex - 1,
        };
      }

    case "NEXT_SET":
      const currentExerciseId =
        state.workout.exerciseIds[state.exerciseIndex];
      const currentExercise = state.exercises[currentExerciseId];

      const isLastExercise =
        state.exerciseIndex === state.workout.exerciseIds.length - 1;
      const isLastSet = state.setIndex === currentExercise.setIds.length - 1;

      if (isLastSet) {
        if (isLastExercise) {
          // workout finished, repeat
          return {
            ...state,
            exerciseIndex: 0,
            setIndex: 0,
          };
        } else {
          // go to next exercise
          return {
            ...state,
            exerciseIndex: state.exerciseIndex + 1,
            setIndex: 0,
          };
        }
      } else {
        // go to next set
        return {
          ...state,
          setIndex: state.setIndex + 1,
        };
      }
    default:
      return state;
  }
}

const WorkoutProvider = ({ children }) => {
  const params = useLocalSearchParams();
  const fullWorkout = JSON.parse(params.jsonWorkout);

  const [state, dispatch] = useReducer(workoutReducer, {
    ...fullWorkout,
    exerciseIndex: 0, // corresponds to workout.exerciseIds index
    setIndex: 0,      // corresponds to exercise.setIds index
  });

  function getCurrentExercise() {
    return state.exercises[
      state.workout.exerciseIds[state.exerciseIndex]
    ];
  }

  function getCurrentSet() {
    return state.sets[getCurrentExercise().setIds[state.setIndex]];
  }

  const contextValue = useMemo(
    () => ({ state, dispatch, getCurrentExercise, getCurrentSet }),
    [state, dispatch, getCurrentExercise, getCurrentSet]
  );

  // useEffect(() => {
  //   console.log(JSON.stringify(state, null, 2))
  // }, [state]);

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

const SetTypeIndicator = ({ type }) => {
  const colors = useRef({
    Standard: "secondary",
    "Warm-up": "yellow",
    Drop: "purple",
    Failure: "red",
  });

  return (
    <View className={`bg-${colors.current[type]} px-2.5 py-1 rounded-xl`}>
      <Text className="text-white font-gsemibold text-cbody">{type} Set</Text>
    </View>
  );
};

const InProgressWorkoutPage = () => {
  const { state, dispatch, getCurrentExercise, getCurrentSet } =
    useContext(WorkoutContext);
  const [currentExercise, setCurrentExercise] = useState(getCurrentExercise());
  const [currentSet, setCurrentSet] = useState(getCurrentSet());

  useEffect(() => {
    const exercise = getCurrentExercise();
    setCurrentExercise(exercise);
  }, [state.exercises[currentExercise._id], state.exerciseIndex]);

  useEffect(() => {
    const set = getCurrentSet();
    setCurrentSet(set);
  }, [state.sets[currentSet._id], state.setIndex]);

  return (
    <>
      <View className="mt-2">
        <Text className="text-gray font-gregular text-csub">
          {state.workout.name}
        </Text>
        <Text className="text-secondary font-gbold text-ch1">
          {currentExercise.name}
        </Text>
      </View>
      <View className="flex flex-row items-center mt-2">
        <View className="bg-primary px-2.5 py-1 rounded-xl mr-1">
          <Text className="text-white font-gsemibold text-cbody">
            Set {state.setIndex + 1}/{currentExercise.setIds.length}
          </Text>
        </View>
        <SetTypeIndicator type={currentSet.type} />
      </View>

      {/* <View className="flex-row justify-between mt-8">
        <TouchableOpacity onPress={() => dispatch({ type: "PREVIOUS_SET" })}>
          <Text>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch({ type: "NEXT_SET" })}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View> */}
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

{
  /* <TouchableOpacity onPress={() => dispatch({ type: "PREVIOUS_SET" })}>
  <Text>Previous</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => dispatch({ type: "NEXT_SET" })}>
  <Text>Next</Text>
</TouchableOpacity> */
}
