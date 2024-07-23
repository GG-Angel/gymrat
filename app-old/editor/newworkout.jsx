import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Divider from "../../components/Divider";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import ExerciseBrowser from "../../components/ExerciseBrowser";
import ExerciseEditorCard from "../../old/ExerciseEditorCard";
import uuid from "react-native-uuid";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DateToggle = ({ day, isSelected, handlePress }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${
        isSelected ? "bg-secondary" : "bg-white"
      } w-9 h-9 rounded-[18px] flex justify-center items-center`}
    >
      <Text
        className={`${
          isSelected ? "text-white font-gbold" : "text-gray font-gmedium"
        } text-cbody`}
      >
        {day}
      </Text>
    </TouchableOpacity>
  );
};

const NewWorkout = () => {
  const [workoutDetails, setWorkoutDetails] = useState({
    workoutName: "Push Day",
    selectedDays: ["Monday", "Thursday"],
    exercises: [
      {
        _id: uuid.v4(),
        title: "Chest Press Machine",
        rest_time: 90,
        notes: "Example notes",
        sets: [
          {
            _id: uuid.v4(),
            type: "Warm-up",
            weight: 140,
            reps: 10,
          },
          {
            _id: uuid.v4(),
            type: "Standard",
            weight: 160,
            reps: 7,
          },
          {
            _id: uuid.v4(),
            type: "Standard",
            weight: 160,
            reps: 5,
          },
          {
            _id: uuid.v4(),
            type: "Standard",
            weight: 160,
            reps: 4,
          },
          {
            _id: uuid.v4(),
            type: "Failure",
            weight: 90,
            reps: 17,
          },
        ],
      },
    ],
  });

  const handleToggleDay = (day) => {
    const { selectedDays } = workoutDetails;
    if (selectedDays.includes(day)) {
      setWorkoutDetails({
        ...workoutDetails,
        selectedDays: selectedDays.filter((d) => d !== day),
      });
    } else {
      setWorkoutDetails({
        ...workoutDetails,
        selectedDays: [...selectedDays, day],
      });
    }
  };

  const handleAddExercise = (exerciseName) => {
    const { exercises } = workoutDetails;
    if (!exercises.includes(exerciseName)) {
      setWorkoutDetails({
        ...workoutDetails,
        exercises: [
          ...exercises,
          // default exercise settings
          {
            _id: uuid.v4(),
            title: exerciseName,
            rest_time: 90,
            notes: "",
            sets: Array.from({ length: 3 }, () => ({
              _id: uuid.v4(),
              type: "Standard",
              weight: null,
              reps: null,
            })),
          },
        ],
      });
    }
  };

  const handleEditExercise = (updatedExercise) => {
    setWorkoutDetails((prev) => {
      const { exercises } = workoutDetails;
      return {
        ...prev,
        exercises: exercises.map((e) =>
          e._id === updatedExercise._id ? updatedExercise : e
        ),
      };
    });
  };

  const handleDeleteExercise = (deletedExercise) => {
    setWorkoutDetails((prev) => {
      const { exercises } = workoutDetails;
      return {
        ...prev,
        exercises: exercises.filter((e) => e._id !== deletedExercise._id),
      };
    });
  };

  useEffect(() => {
    console.log(JSON.stringify(workoutDetails, null, 2));
  }, [workoutDetails]);

  return (
    <View>
      <SafeAreaView
        className="bg-white-100 h-full"
        edges={["right", "left", "top"]}
      >
        <KeyboardAwareFlatList
          data={workoutDetails.exercises}
          keyExtractor={(item) => item._id}
          renderItem={({ setId: exercise }) => (
            <ExerciseEditorCard
              exercise={exercise}
              handleEdits={handleEditExercise}
              handleDelete={handleDeleteExercise}
            />
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
                value={workoutDetails.workoutName}
                handleChangeText={(w) =>
                  setWorkoutDetails({ ...workoutDetails, workoutName: w })
                }
                placeholder="Enter workout name"
                containerStyles="mt-2 mb-3"
              />
              <KeyboardAwareFlatList
                data={daysOfWeek}
                keyExtractor={(item) => item}
                renderItem={({ setId: day }) => (
                  <DateToggle
                    day={day.charAt(0)}
                    isSelected={workoutDetails.selectedDays.includes(day)}
                    handlePress={() => handleToggleDay(day)}
                  />
                )}
                horizontal
                contentContainerStyle={{
                  flex: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              />
              <Divider />
              <Text className="text-gray font-gregular text-csub">
                Modify Exercises
              </Text>
              <ExerciseBrowser
                containerStyles="mt-2 mb-4"
                handleSubmit={handleAddExercise}
              />
            </View>
          )}
        />
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
    </View>
  );
};

export default NewWorkout;
