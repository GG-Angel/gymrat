import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Vibration,
} from "react-native";
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
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
import CardContainer from "@/components/CardContainer";
import { formatTime, parseDecimal, parseWhole } from "@/utils/format";
import { UsableRoutine } from "@/database/database";
import { SvgProps } from "react-native-svg";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface WorkoutState extends UsableRoutine {
  exerciseIndex: number;
  setIndex: number;
  elapsedSets: number;
  workoutLength: number;
}

interface WorkoutContextValues {
  state: WorkoutState;
  dispatch: Dispatch<ReducerAction>;
  currentExercise: CurrentExercise;
  currentSet: CurrentSet;
  setTypeColorsRef: React.MutableRefObject<SetTypeColors>;
  isOpened: IsOpenedState;
  setIsOpened: Dispatch<SetStateAction<IsOpenedState>>;
}

type ReducerAction =
  | {
      type: "NEXT_SET" | "PREVIOUS_SET";
    }
  | {
      type: "CHANGE_NOTES";
      exerciseId: string;
      notes: string;
    }
  | {
      type: "CHANGE_SET_VALUE";
      setId: string;
      field: "weight" | "reps";
      weight?: number;
      reps?: number;
    };

interface IsOpenedState {
  calculator: boolean;
  timer: boolean;
  notes: boolean;
}

type CurrentExercise = {
  _id: string;
  master_id: string | null;
  name: string;
  rest: number;
  notes: string;
  tags: string[];
  setIds: string[];
};

type CurrentSet = {
  _id: string;
  type: "Standard" | "Warm-up" | "Drop" | "Failure";
  weight: number | null;
  reps: number | null;
};

type SetTypeColors = {
  Standard: string;
  "Warm-up": string;
  Drop: string;
  Failure: string;
};

type SetTypes = "Standard" | "Warm-up" | "Drop" | "Failure";

const WorkoutContext = createContext<WorkoutContextValues>(
  {} as WorkoutContextValues
);

function workoutReducer(state: WorkoutState, action: ReducerAction) {
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

    case "CHANGE_NOTES":
      return {
        ...state,
        exercises: {
          ...state.exercises,
          [action.exerciseId]: {
            ...state.exercises[action.exerciseId],
            notes: action.notes,
          },
        },
      };

    case "CHANGE_SET_VALUE":
      // console.log("ACTION:", JSON.stringify(action, null, 2));
      return {
        ...state,
        sets: {
          ...state.sets,
          [action.setId]: {
            ...state.sets[action.setId],
            [action.field]:
              action.field === "weight" ? action.weight : action.reps,
          },
        },
      };
    default:
      return state;
  }
}

const WorkoutProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const params = useLocalSearchParams();
  const fullWorkout: UsableRoutine = JSON.parse(params.jsonWorkout as string);

  const [state, dispatch] = useReducer(workoutReducer, {
    ...fullWorkout,
    exerciseIndex: 0, // corresponds to workout.exerciseIds index
    setIndex: 0, // corresponds to exercise.setIds index
    elapsedSets: 0,
    workoutLength: calculateWorkoutLength(), // calculates the number of total sets in the workout
  });

  const [currentExercise, setCurrentExercise] =
    useState<CurrentExercise>(getCurrentExercise());
  const [currentSet, setCurrentSet] = useState<CurrentSet>(getCurrentSet());
  const [isOpened, setIsOpened] = useState<IsOpenedState>({
    calculator: false,
    timer: false,
    notes: false,
  });

  const setTypeColorsRef = useRef({
    Standard: "secondary",
    "Warm-up": "yellow",
    Drop: "purple",
    Failure: "red",
  });

  useEffect(() => {
    const exercise = getCurrentExercise();
    setCurrentExercise(exercise);
  }, [state.exercises[currentExercise._id], state.exerciseIndex]);

  useEffect(() => {
    const set = getCurrentSet();
    setCurrentSet(set);
  }, [state.sets[currentSet._id], state.setIndex]);

  function calculateWorkoutLength(): number {
    return fullWorkout.workout.exerciseIds.reduce((totalSets, exerciseId) => {
      const exercise = fullWorkout.exercises[exerciseId];
      return totalSets + exercise.setIds.length;
    }, 0);
  }

  function getCurrentExercise(): CurrentExercise {
    return state.exercises[state.workout.exerciseIds[state.exerciseIndex]];
  }

  function getCurrentSet(): CurrentSet {
    return state.sets[getCurrentExercise().setIds[state.setIndex]];
  }

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      currentExercise,
      currentSet,
      setTypeColorsRef,
      isOpened,
      setIsOpened,
    }),
    [
      state,
      dispatch,
      currentExercise,
      currentSet,
      setTypeColorsRef,
      isOpened,
      setIsOpened,
    ]
  );

  useEffect(() => {
    console.log(JSON.stringify(currentExercise, null, 2));
  }, [currentExercise]);

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

const ProgressBar = () => {
  const { state } = useContext(WorkoutContext);
  const [progress, setProgress] = useState<number>(0);

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

const SetTypeIndicator: React.FC<{ type: SetTypes }> = ({ type }) => {
  const { setTypeColorsRef } = useContext(WorkoutContext);
  return (
    <View
      className={`bg-${setTypeColorsRef.current[type]} px-2.5 py-1 rounded-xl`}
    >
      <Text className="text-white font-gsemibold text-cbody">{type} Set</Text>
    </View>
  );
};

const Counter: React.FC<{
  field: "weight" | "reps";
  value: number | null;
  handleChangeValue: (
    field: "weight" | "reps",
    operation: "add" | "subtract" | "manual",
    manualValue?: string
  ) => void;
  containerStyles?: string;
}> = ({ field, value, handleChangeValue, containerStyles }) => {
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

const RestTimer: React.FC<{
  initialSeconds: number;
  containerStyles?: string;
}> = ({ initialSeconds, containerStyles }) => {
  const { setIsOpened } = useContext(WorkoutContext);
  const [seconds, setSeconds] = useState(initialSeconds);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const oneSecondInMS = 1000;
  const halfSecondInMS = 500;
  const vibrationPattern =
    Platform.OS === "android"
      ? [
          0, // start immediately
          halfSecondInMS, // vibrate for 0.5s
          oneSecondInMS, // wait for 1s
          halfSecondInMS, // vibrate for 0.5s
          oneSecondInMS, // wait for 1s
          halfSecondInMS, // vibrate for 0.5s
        ]
      : [
          0, // start immediately
          halfSecondInMS, // vibrate
          halfSecondInMS, // wait
          halfSecondInMS, // vibrate
          halfSecondInMS, // wait, then vibrate
        ];

  useEffect(() => {
    // decrement timer
    if (seconds > 0) {
      timerIdRef.current = setTimeout(() => {
        setSeconds((prev) => prev - 1);
      }, oneSecondInMS);
    } else {
      // close timer once time ends after 7 seconds
      Vibration.vibrate(vibrationPattern);
      timerIdRef.current = setTimeout(() => {
        setIsOpened((prev) => ({ ...prev, timer: false }));
      }, 7 * oneSecondInMS);
    }

    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, [seconds]);

  return (
    <CardContainer
      containerStyles={`flex-row space-x-2 justify-between ${containerStyles}`}
    >
      <View className="flex-row space-x-2">
        <Icons.restTimer />
        <View>
          <Text className="text-secondary font-gbold text-ch1">
            {seconds > 0 ? formatTime(seconds) : "Start Set!"}
          </Text>
          <Text className="text-gray font-gregular text-csub">Rest Timer</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => setIsOpened((prev) => ({ ...prev, timer: false }))}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Icons.closeTab />
      </TouchableOpacity>
    </CardContainer>
  );
};

const Notes: React.FC<{ containerStyles?: string }> = ({ containerStyles }) => {
  const { dispatch, currentExercise, setIsOpened } = useContext(WorkoutContext);
  const [localValue, setLocalValue] = useState(currentExercise.notes);

  useEffect(() => {
    setLocalValue(currentExercise.notes);
  }, [currentExercise])

  return (
    <CardContainer containerStyles={containerStyles}>
      <View className="flex-row justify-between">
        <View className="flex-row space-x-2">
          <Icons.notes />
          <Text className="text-secondary font-gsemibold text-csub">Notes</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsOpened((prev) => ({ ...prev, notes: false }))}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
          <Icons.closeTab />
        </TouchableOpacity>
      </View>
      <View className="bg-white-100 rounded-md mt-4">
        <TextInput
          className="text-secondary font-gregular text-body py-3 px-4"
          value={localValue}
          onChangeText={(v) => setLocalValue(v)}
          onBlur={() =>
            dispatch({
              type: "CHANGE_NOTES",
              exerciseId: currentExercise._id,
              notes: localValue,
            })
          }
          placeholder="Enter exercise notes here"
          multiline={true}
          numberOfLines={4}
        />
      </View>
    </CardContainer>
  );
};

const TabBarIcon: React.FC<{
  Icon: React.FC<SvgProps>;
  disabled?: boolean;
  handlePress: () => void;
}> = ({ Icon, disabled, handlePress }) => {
  return (
    <TouchableOpacity
      className={`${disabled && "opacity-25"}`}
      disabled={disabled}
      onPress={handlePress}
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    >
      <Icon />
    </TouchableOpacity>
  );
};

const TabBar: React.FC = () => {
  const { state, dispatch, isOpened, setIsOpened } = useContext(WorkoutContext);

  return (
    <View className="h-[76px] px-8 flex-row justify-between">
      <TabBarIcon
        Icon={Icons.tabLeft}
        disabled={state.exerciseIndex === 0 && state.setIndex === 0}
        handlePress={() => dispatch({ type: "PREVIOUS_SET" })}
      />
      <TabBarIcon
        Icon={Icons.tabCalc}
        disabled={isOpened.calculator}
        handlePress={() =>
          setIsOpened((prev) => ({ ...prev, calculator: true }))
        }
      />
      <TabBarIcon
        Icon={Icons.tabTimer}
        disabled={isOpened.timer}
        handlePress={() => setIsOpened((prev) => ({ ...prev, timer: true }))}
      />
      <TabBarIcon
        Icon={Icons.tabNotes}
        disabled={isOpened.notes}
        handlePress={() => setIsOpened((prev) => ({ ...prev, notes: true }))}
      />
      <TabBarIcon
        Icon={Icons.tabRight}
        handlePress={() => dispatch({ type: "NEXT_SET" })}
      />
    </View>
  );
};

const InProgressWorkoutPage: React.FC = () => {
  const {
    state,
    dispatch,
    currentExercise,
    currentSet,
    isOpened,
    setIsOpened,
  } = useContext(WorkoutContext);

  useEffect(() => {
    setIsOpened({
      calculator: false,
      timer: false,
      notes: true,
    });
  }, [state.exerciseIndex]);

  const handleChangeValue = (
    field: "weight" | "reps",
    operation: "add" | "subtract" | "manual",
    manualValue?: string
  ) => {
    switch (operation) {
      case "add":
        dispatch({
          type: "CHANGE_SET_VALUE",
          setId: currentSet._id,
          field: field,
          [field]:
            field === "weight"
              ? (currentSet.weight ?? 0) + 5
              : (currentSet.reps ?? 0) + 1,
        });
        break;
      case "subtract":
        dispatch({
          type: "CHANGE_SET_VALUE",
          setId: currentSet._id,
          field: field,
          [field]:
            field === "weight"
              ? (currentSet.weight ?? 0) - 5
              : (currentSet.reps ?? 0) - 1,
        });
        break;
      case "manual":
        dispatch({
          type: "CHANGE_SET_VALUE",
          setId: currentSet._id,
          field: field,
          [field]:
            field === "weight"
              ? parseDecimal(manualValue as string)
              : parseWhole(manualValue as string),
        });
        break;
      default:
        return;
    }
  };

  return (
    <View className="flex-1 justify-between">
      <View className="flex-1 px-8">
        <View className="flex flex-row items-center space-x-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Icons.exitWorkout />
          </TouchableOpacity>
          <View className="flex-1">
            <ProgressBar />
          </View>
        </View>
        <KeyboardAwareScrollView
          className="my-4"
          keyboardShouldPersistTaps="never"
          enableAutomaticScroll={true}
          keyboardOpeningTime={425}
          extraScrollHeight={64}
        >
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
            {isOpened.timer && (
              <RestTimer
                initialSeconds={currentExercise.rest}
                containerStyles="mt-4"
              />
            )}
            {isOpened.notes && <Notes containerStyles="mt-4" />}
          </View>
        </KeyboardAwareScrollView>
      </View>
      <TabBar />
    </View>
  );
};

const ActiveWorkout = () => {
  return (
    <WorkoutProvider>
      <SafeAreaView
        className="bg-white-100 h-full"
        edges={["left", "right", "top"]}
      >
        <InProgressWorkoutPage />
      </SafeAreaView>
    </WorkoutProvider>
  );
};

export default ActiveWorkout;
