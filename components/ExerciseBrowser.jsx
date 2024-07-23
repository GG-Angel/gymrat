import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "../constants";

const exercises = [
  "Squats",
  "Deadlifts",
  "Bench Press",
  "Shoulder Press",
  "Overhead Press",
  "Barbell Rows",
  "Pull-ups",
];

const ExerciseBrowser = ({ handleSubmit, containerStyles }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setSearchResults(
      exercises.filter((e) => e.includes(searchQuery)).slice(0, 5)
    );
  }, [searchQuery]);

  const processSelection = (selectedExercise) => {
    handleSubmit(selectedExercise);
    setSearchQuery("");
    setFocused(false);
    Keyboard.dismiss;
  };

  return (
    <ScrollView
      className={`${containerStyles}`}
      keyboardShouldPersistTaps="always"
    >
      <View
        className={`flex-row w-full py-3 px-4 mb-0 space-x-3 items-center bg-white ${
          searchQuery || focused
            ? "rounded-t-lg border-b-[1px] border-gray-200"
            : "rounded-lg border-none"
        }`}
      >
        <icons.search width={14} height={14} />
        <TextInput
          className="flex-1 text-secondary font-gregular text-body"
          value={searchQuery}
          placeholder="Search for an exercise to add"
          placeholderTextColor="#6A6A6A"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={(s) => setSearchQuery(s)}
          onSubmitEditing={() => processSelection(searchQuery)} // submit custom exercise
        />
      </View>
      {(searchQuery || focused) && (
        <FlatList
          className="px-4 py-3 bg-white rounded-b-lg"
          data={searchResults}
          // keyExtractor
          renderItem={({ item: exercise, index }) => (
            <TouchableOpacity
              className={`flex-row space-x-2 items-center justify-between bg-white ${
                index === 4 && "rounded-b-lg"
              }`}
              onPress={() => processSelection(exercise)}
              key={index}
            >
              <icons.dumbbell width={14} height={14} />
              <Text className="flex-1 text-gray font-gregular text-body">
                {exercise}
              </Text>
              <icons.forward width={7.05} height={12} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View className="h-2 bg-white"></View>}
          ListEmptyComponent={() => (
            <TouchableOpacity
              className="flex-row items-center justify-between bg-white border-b-lg"
              onPress={() => processSelection(searchQuery)}
            >
              <Text className="text-gray font-gregular text-body">
                Add as custom exercise
              </Text>
              <icons.forward width={7.05} height={12} />
            </TouchableOpacity>
          )}
        />
      )}
    </ScrollView>
  );
};

export default ExerciseBrowser;
