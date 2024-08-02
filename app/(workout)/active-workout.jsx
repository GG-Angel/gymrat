import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Icons from "@/constants/icons";
import CustomButton from "@/components/CustomButton";
import CardContainer from "@/components/CardContainer";
import { parseDecimal, parseWhole } from "@/utils/format";

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
          const prevExerciseId = state.workout.exerciseIds[prevExerciseIndex];
          const prevExercise = state.exercises[prevExerciseId];
          const prevSetIndex = prevExercise.setIds.length - 1;

          return {
            ...state,
            exerciseIndex: prevExerciseIndex,
            setIndex: prevSetIndex,
            elapsedSets: state.elapsedSets - 1,
          };
        }
      } else {
        // go to previous set
        return {
          ...state,
          setIndex: state.setIndex - 1,
          elapsedSets: state.elapsedSets - 1,
        };
      }

    case "NEXT_SET":
      const currentExerciseId = state.workout.exerciseIds[state.exerciseIndex];
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
            elapsedSets: 0,
          };
        } else {
          // go to next exercise
          return {
            ...state,
            exerciseIndex: state.exerciseIndex + 1,
            setIndex: 0,
            elapsedSets: state.elapsedSets + 1,
          };
        }
      } else {
        // go to next set
        return {
          ...state,
          setIndex: state.setIndex + 1,
          elapsedSets: state.elapsedSets + 1,
        };
      }

    case "CHANGE_SET_VALUE":
      // console.log("ACTION:", JSON.stringify(action, null, 2));
      return {
        ...state,
        sets: {
          ...state.sets,
          [action.setId]: {
            ...state.sets[action.setId],
            [action.field]: action[action.field],
          },
        },
      };
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
    setIndex: 0, // corresponds to exercise.setIds index
    elapsedSets: 0,
    workoutLength: calculateWorkoutLength(), // calculates the number of total sets in the workout
  });

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

  const setTypeColorsRef = useRef({
    Standard: "secondary",
    "Warm-up": "yellow",
    Drop: "purple",
    Failure: "red",
  });

  function calculateWorkoutLength() {
    return fullWorkout.workout.exerciseIds.reduce((totalSets, exerciseId) => {
      const exercise = fullWorkout.exercises[exerciseId];
      return totalSets + exercise.setIds.length;
    }, 0);
  }

  function getCurrentExercise() {
    return state.exercises[state.workout.exerciseIds[state.exerciseIndex]];
  }

  function getCurrentSet() {
    return state.sets[getCurrentExercise().setIds[state.setIndex]];
  }

  const contextValue = useMemo(
    () => ({ state, dispatch, currentExercise, currentSet, setTypeColorsRef }),
    [state, dispatch, currentExercise, currentSet, setTypeColorsRef]
  );

  useEffect(() => {
    console.log(JSON.stringify(currentSet, null, 2));
  }, [currentSet]);

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

const ProgressBar = () => {
  const { state } = useContext(WorkoutContext);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(state.elapsedSets / state.workoutLength);
  }, [state.elapsedSets]);

  return (
    <View className="flex-row items-center">
      <View
        className={`bg-primary h-1.5 rounded-md ${progress < 1 && "rounded-r-none"}`}
        style={{ flex: progress }}
      ></View>
      <View
        className={`bg-gray-200 h-1.5 rounded-md ${progress > 0 && "rounded-l-none"}`}
        style={{ flex: 1 - progress }}
      ></View>
    </View>
  );
};

const SetTypeIndicator = ({ type }) => {
  const { setTypeColorsRef } = useContext(WorkoutContext);
  return (
    <View
      className={`bg-${setTypeColorsRef.current[type]} px-2.5 py-1 rounded-xl`}
    >
      <Text className="text-white font-gsemibold text-cbody">{type} Set</Text>
    </View>
  );
};

const Counter = ({ field, value, handleChangeValue, containerStyles }) => {
  const [localValue, setLocalValue] = useState(value ? String(value) : "");

  useEffect(() => {
    setLocalValue(value ? String(value) : "");
  }, [value]);

  return (
    <CardContainer
      containerStyles={`flex-row items-center justify-between space-x-4 ${containerStyles}`}
    >
      <TouchableOpacity
        onPress={() => handleChangeValue(field, "subtract")}
        onLongPress={() => {}}
      >
        <Icons.subtractCircle />
      </TouchableOpacity>
      <View className="flex-1">
        <TextInput
          className="flex-[0.5] text-secondary font-gbold text-ch1 text-center"
          value={localValue}
          placeholder="N/A"
          placeholderTextColor="#6A6A6A" // 25%
          onChangeText={(v) => setLocalValue(v)}
          onBlur={() => handleChangeValue(field, "manual", localValue)}
          keyboardType="numeric"
          maxLength={field === "weight" ? 7 : 4}
          hitSlop={{ top: 12, bottom: 32 }}
        />
        <Text className="text-secondary font-gregular text-csub text-center">
          {field}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleChangeValue(field, "add")}
        onLongPress={() => {}}
      >
        <Icons.addCircle />
      </TouchableOpacity>
    </CardContainer>
  );
};

const InProgressWorkoutPage = () => {
  const { state, dispatch, currentExercise, currentSet } =
    useContext(WorkoutContext);

  const handleChangeValue = (field, operation, manualValue) => {
    switch (operation) {
      case "add":
        dispatch({
          type: "CHANGE_SET_VALUE",
          setId: currentSet._id,
          field: field,
          [field]:
            field === "weight" ? currentSet.weight + 5 : currentSet.reps + 1,
        });
        break;
      case "subtract":
        dispatch({
          type: "CHANGE_SET_VALUE",
          setId: currentSet._id,
          field: field,
          [field]:
            field === "weight" ? currentSet.weight - 5 : currentSet.reps - 1,
        });
        break;
      case "manual":
        dispatch({
          type: "CHANGE_SET_VALUE",
          setId: currentSet._id,
          field: field,
          [field]:
            field === "weight"
              ? parseDecimal(manualValue)
              : parseWhole(manualValue),
        });
        break;
      default:
        return;
    }
  };

  return (
    <>
      <View className="flex flex-row items-center space-x-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Icons.exitWorkout />
        </TouchableOpacity>
        <View className="flex-1">
          <ProgressBar />
        </View>
      </View>
      <ScrollView className="my-4">
        <Text className="text-gray font-gregular text-csub">
          {state.workout.name}
        </Text>
        <Text className="text-secondary font-gbold text-ch1">
          {currentExercise.name}
        </Text>
        <View className="flex flex-row items-center mt-2">
          <View className="bg-primary px-2.5 py-1 rounded-xl mr-1">
            <Text className="text-white font-gsemibold text-cbody">
              Set {state.setIndex + 1}/{currentExercise.setIds.length}
            </Text>
          </View>
          <SetTypeIndicator type={currentSet.type} />
        </View>
        <View className="mt-6">
          <Counter
            field="weight"
            value={currentSet.weight}
            handleChangeValue={handleChangeValue}
          />
          <Counter
            field="reps"
            value={currentSet.reps}
            handleChangeValue={handleChangeValue}
            containerStyles="mt-4"
          />
        </View>
        <View className="flex-row justify-between mt-8">
          <CustomButton
            title="Previous Set"
            style="secondary"
            handlePress={() => dispatch({ type: "PREVIOUS_SET" })}
            containerStyles="flex-[0.4]"
          />
          <CustomButton
            title="Next Set"
            style="primary"
            handlePress={() => dispatch({ type: "NEXT_SET" })}
            containerStyles="flex-[0.4]"
          />
        </View>
      </ScrollView>
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
