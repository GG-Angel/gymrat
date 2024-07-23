import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
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
import { SafeAreaView } from "react-native-safe-area-context";
import Divider from "../../components/Divider";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import ExerciseBrowser from "../../components/ExerciseBrowser";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import uuid from "react-native-uuid";
import CardContainer from "@/components/CardContainer";
import CustomButton from "@/components/CustomButton";

// const initialState = {
//   workout: {
//     _id: uuid.v4(),
//     name: "Push Day (PPL)",
//     days: ["Monday", "Thursday"],
//     exerciseIds: [0],
//   },
//   exercises: {
//     0: {
//       _id: 0,
//       name: "Chest Press Machine",
//       rest: 90,
//       notes: "Example notes",
//       setIds: [1, 2, 3, 4, 5],
//     },
//   },
//   sets: {
//     1: { _id: 1, type: "Warm-up", weight: 140, reps: 10 },
//     2: { _id: 2, type: "Standard", weight: 160, reps: 5 },
//     3: { _id: 3, type: "Standard", weight: 160, reps: 4 },
//     4: { _id: 4, type: "Failure", weight: 90, reps: 17 },
//     5: { _id: 5, type: "Standard", weight: 160, reps: 7 },
//   },
// };

const initialState = {
  workout: {
    _id: uuid.v4(),
    name: "",
    days: [],
    exerciseIds: [],
  },
  exercises: {},
  sets: {},
};

const WorkoutContext = createContext();

function workoutReducer(state, action) {
  switch (action.type) {
    case "CHANGE_NAME":
      return {
        ...state,
        workout: {
          ...state.workout,
          name: action.name,
        },
      };
    case "TOGGLE_DAY":
      return {
        ...state,
        workout: {
          ...state.workout,
          days: state.workout.days.includes(action.day)
            ? state.workout.days.filter((d) => d !== action.day)
            : [...state.workout.days, action.day],
        },
      };
    case "ADD_EXERCISE":
      const newExerciseId = uuid.v4();
      const setIds = [uuid.v4(), uuid.v4(), uuid.v4()];
      const newSets = {};

      setIds.forEach((id) => {
        newSets[id] = { _id: id, type: "Standard", weight: null, reps: null };
      });

      return {
        ...state,
        workout: {
          ...state.workout,
          exerciseIds: [...state.workout.exerciseIds, newExerciseId],
        },
        exercises: {
          ...state.exercises,
          [newExerciseId]: {
            _id: newExerciseId,
            name: action.name,
            rest: 90,
            notes: "",
            setIds: setIds,
          },
        },
        sets: {
          ...state.sets,
          ...newSets,
        },
      };
    case "EDIT_EXERCISE":
      return {
        ...state,
        exercises: {
          ...state.exercises,
          [action.exercise._id]: action.exercise,
        },
      };
    case "DELETE_EXERCISE":
      const {
        [action.removeExerciseId]: deletedExercise,
        ...remainingExercises
      } = state.exercises;

      // delete sets from state
      const remainingSets = { ...state.sets };
      deletedExercise.setIds.forEach((setId) => {
        delete remainingSets[setId];
      });

      return {
        ...state,
        workout: {
          ...state.workout,
          exerciseIds: state.workout.exerciseIds.filter(
            (id) => id !== action.removeExerciseId
          ),
        },
        exercises: remainingExercises,
        sets: remainingSets,
      };
    case "ADD_SET":
      return {
        ...state,
        exercises: {
          ...state.exercises,
          [action.exercise._id]: action.exercise,
        },
        sets: {
          ...state.sets,
          [action.newSetId]: {
            _id: action.newSetId,
            type: "Standard",
            weight: null,
            reps: null,
          },
        },
      };
    case "EDIT_SET":
      return {
        ...state,
        sets: {
          ...state.sets,
          [action.updatedSet._id]: action.updatedSet,
        },
      };
    case "REMOVE_SET":
      const alteredSets = { ...state.sets };
      delete alteredSets[action.removeSetId];

      return {
        ...state,
        exercises: {
          ...state.exercises,
          [action.exercise._id]: action.exercise,
        },
        sets: alteredSets,
      };
    default:
      return state;
  }
}

const WorkoutProvider = ({ children }) => {
  const [form, dispatch] = useReducer(workoutReducer, initialState);

  const contextValue = useMemo(() => ({ form, dispatch }), [form, dispatch]);

  // useEffect(() => {
  //   console.log(JSON.stringify(form, null, 2));
  // }, [form]);

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
};

const DayToggle = ({ day, isSelected, handleToggle }) => {
  return (
    <TouchableOpacity
      onPress={handleToggle}
      className={`${
        isSelected ? "bg-secondary" : "bg-white"
      } w-9 h-9 rounded-[18px] flex justify-center items-center`}
    >
      <Text
        className={`${
          isSelected ? "text-white font-gbold" : "text-gray font-gmedium"
        } text-cbody`}
      >
        {day.charAt(0)}
      </Text>
    </TouchableOpacity>
  );
};

const DaySelecter = () => {
  const { form, dispatch } = useContext(WorkoutContext);
  const daysOfWeek = useRef([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);

  return (
    <FlatList
      data={daysOfWeek.current}
      keyExtractor={(day) => day}
      renderItem={({ item: day }) => (
        <DayToggle
          day={day}
          isSelected={form.workout.days.includes(day)}
          handleToggle={() => dispatch({ type: "TOGGLE_DAY", day })}
        />
      )}
      horizontal
      contentContainerStyle={{
        flex: 1,
        justifyContent: "space-between",
      }}
    />
  );
};

const SetTypeEditor = ({ index, type, handlePress }) => {
  const styles = useRef({
    Standard: {
      container: "bg-white-100",
      text: "text-gray font-gregular",
    },
    "Warm-up": {
      container: "bg-yellow",
      text: "text-white font-gbold",
    },
    Drop: {
      container: "bg-purple",
      text: "text-white font-gbold",
    },
    Failure: {
      container: "bg-red",
      text: "text-white font-gbold",
    },
  });

  return (
    <TouchableOpacity
      className={`flex-[0.16] py-1 rounded-md ${styles.current[type].container}`}
      onPress={handlePress}
    >
      <Text className={`text-cbody text-center ${styles.current[type].text}`}>
        {type === "Standard" ? index + 1 : type.charAt(0)}
      </Text>
    </TouchableOpacity>
  );
};

const SetEditor = ({ index, set, handleEditSet }) => {
  const setTypes = useRef(["Standard", "Warm-up", "Drop", "Failure"]);

  const handleEdits = (field, value) => {
    switch (field) {
      case "type":
        const index = setTypes.current.indexOf(value);
        const newType =
          index === setTypes.current.length - 1
            ? setTypes.current[0]
            : setTypes.current[index + 1];
        handleEditSet({
          ...set,
          type: newType,
        });
        break;
      default:
        handleEditSet({
          ...set,
          [field]: value,
        });
    }
  };

  return (
    <View className="flex flex-row justify-between items-center space-x-2">
      <SetTypeEditor
        index={index}
        type={set.type}
        handlePress={() => handleEdits("type", set.type)}
      />
      <View
        className={`flex-[0.48] bg-white-100 py-1 rounded-md ${!set.weight && "opacity-50"}`}
      >
        <TextInput
          className="flex-1 text-gray font-gregular text-cbody text-center"
          keyboardType="numeric"
          value={set.weight && String(set.weight)}
          placeholder={"N/A"}
          placeholderTextColor="#BABABA"
          onChangeText={(w) => handleEdits("weight", w)}
          maxLength={8}
        />
      </View>
      <View
        className={`flex-[0.36] bg-white-100 py-1 rounded-md ${!set.reps && "opacity-50"}`}
      >
        <TextInput
          className="flex-1 text-gray font-gregular text-cbody text-center"
          keyboardType="numeric"
          value={set.reps && String(set.reps)}
          placeholder={"N/A"}
          placeholderTextColor="#BABABA"
          onChangeText={(r) => handleEdits("reps", r)}
          maxLength={5}
        />
      </View>
    </View>
  );
};

const EditorCard = ({ exercise }) => {
  const { form, dispatch } = useContext(WorkoutContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddSet = () => {
    const newSetId = uuid.v4();
    dispatch({
      type: "ADD_SET",
      newSetId: newSetId,
      exercise: {
        ...exercise,
        setIds: [...exercise.setIds, newSetId],
      },
    });
  };

  const handleEditSet = (updatedSet) => {
    dispatch({
      type: "EDIT_SET",
      updatedSet: updatedSet,
    });
  };

  const handleRemoveSet = () => {
    const removeSetId = exercise.setIds[exercise.setIds.length - 1];
    dispatch({
      type: "REMOVE_SET",
      removeSetId: removeSetId,
      exercise: {
        ...exercise,
        setIds: exercise.setIds.slice(0, -1),
      },
    });
  };

  const handleDeleteExercise = () => {
    dispatch({
      type: "DELETE_EXERCISE",
      removeExerciseId: exercise._id,
    });
  };

  return (
    <>
      <CardContainer
        containerStyles={`${isExpanded && "rounded-b-none border-b-[1px] border-gray-200"}`}
      >
        <View className="flex-row justify-between items-center space-x-6">
          <View>
            <Text className="text-secondary font-gbold text-csub mb-0.5">
              {exercise.name}
            </Text>
            <Text className="text-gray font-gregular text-ctri">
              {`${exercise.setIds.length} Sets`}
            </Text>
          </View>
          <TouchableOpacity
            className="w-[34px] h-[34px] flex justify-center items-center"
            onPress={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <icons.collapse /> : <icons.expand />}
          </TouchableOpacity>
        </View>
      </CardContainer>
      {isExpanded && (
        <CardContainer containerStyles="rounded-t-none">
          <FlatList
            data={exercise.setIds}
            keyExtractor={(setId) => setId}
            renderItem={({ item: setId, index }) => (
              <SetEditor
                index={index}
                set={form.sets[setId]}
                handleEditSet={handleEditSet}
              />
            )}
            ItemSeparatorComponent={() => <View className="h-1"></View>}
            ListHeaderComponent={() => (
              <View className="flex flex-row justify-between items-center space-x-2 mb-2">
                <Text className="text-secondary font-gsemibold text-cbody text-center flex-[0.16]">
                  Set
                </Text>
                <Text className="text-secondary font-gsemibold text-cbody text-center flex-[0.48]">
                  Weight (lbs)
                </Text>
                <Text className="text-secondary font-gsemibold text-cbody text-center flex-[0.36]">
                  Reps
                </Text>
              </View>
            )}
            ListFooterComponent={() => (
              <View className="mt-4">
                <View className="flex flex-row justify-between items-center">
                  <TouchableOpacity
                    className={`w-[38px] h-[38px] flex justify-center items-center ${form.workout.exerciseIds.length <= 1 && "opacity-25"}`}
                    onPress={handleDeleteExercise}
                    disabled={form.workout.exerciseIds.length <= 1}
                  >
                    <icons.trash />
                  </TouchableOpacity>
                  <View className="flex-row">
                    <CustomButton
                      title="Remove Set"
                      style="secondary"
                      handlePress={handleRemoveSet}
                      containerStyles="mr-2"
                      disabled={exercise.setIds.length <= 1}
                    />
                    <CustomButton
                      title="Add Set"
                      handlePress={handleAddSet}
                      disabled={exercise.setIds.length >= 15}
                    />
                  </View>
                </View>
              </View>
            )}
          />
        </CardContainer>
      )}
    </>
  );
};

const Editor = () => {
  const { form, dispatch } = useContext(WorkoutContext);

  return (
    <KeyboardAwareFlatList
      data={form.workout.exerciseIds}
      keyExtractor={(exerciseId) => exerciseId}
      renderItem={({ item: exerciseId }) => (
        <EditorCard exercise={form.exercises[exerciseId]} />
      )}
      contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 96 }}
      ItemSeparatorComponent={() => <View className="h-4"></View>}
      ListHeaderComponent={() => (
        <View className="w-full">
          <Text className="text-secondary font-gbold text-ch1 mt-2">
            New Workout
          </Text>
          <Divider />
          <Text className="text-gray font-gregular text-csub">
            Edit Details
          </Text>
          <FormField
            Icon={icons.edit}
            iconSize={15}
            iconInsideField
            value={form.workout.name}
            handleChangeText={(name) => dispatch({ type: "CHANGE_NAME", name })}
            placeholder="Enter workout name"
            containerStyles="mt-2 mb-3"
          />
          <DaySelecter />
          <Divider />
          <Text className="text-gray font-gregular text-csub">
            Modify Exercises
          </Text>
          <ExerciseBrowser
            containerStyles="mt-2 mb-4"
            handleSubmit={(name) => dispatch({ type: "ADD_EXERCISE", name })}
          />
        </View>
      )}
    />
  );
};

const NewWorkout = () => {
  return (
    <WorkoutProvider>
      <SafeAreaView
        className="bg-white-100 h-full"
        edges={["right", "left", "top"]}
      >
        <Editor />
        <View className="h-[76px] flex-row">
          <TouchableOpacity className="bg-secondary flex-1 items-center justify-center">
            <View className="flex-row items-center space-x-2">
              <icons.close />
              <Text className="text-white font-gbold text-csub">Cancel</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="bg-primary flex-1 flex items-center justify-center">
            <View className="flex-row items-center space-x-2">
              <icons.checkmark />
              <Text className="text-white font-gbold text-csub">Confirm</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </WorkoutProvider>
  );
};

export default NewWorkout;
