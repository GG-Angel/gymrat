import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "../constants";
import { useSQLiteContext } from "expo-sqlite";
import { generateUUID } from "@/database/database";

const ExerciseBrowser = ({ handleSubmit, containerStyles }) => {
  const db = useSQLiteContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    async function fetchExercises() {
      const result = await db.getAllAsync(
        "SELECT * FROM MasterExercise WHERE name LIKE ?",
        `%${searchQuery}%`
      );
      setSearchResults(result.slice(0, 5));
    }
    fetchExercises();
  }, [searchQuery]);

  const processSelection = async (exerciseName, masterId) => {
    const trimmedName = exerciseName.trim();
    if (trimmedName.length === 0) {
      Alert.alert(
        "Invalid Exercise",
        "Please enter a valid name for your custom exercise"
      );
      return;
    }

    const exerciseMuscles = masterId 
      ? (await db.getFirstAsync("SELECT muscles FROM MasterExercise WHERE _id = ?", masterId)).muscles 
      : "";
    handleSubmit({
      _id: generateUUID(),
      master_id: masterId, // will be null if exercise is custom
      name: exerciseName,
      tags: exerciseMuscles // will be null if exercise is custom
    });
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
        className={`flex-row w-full py-3 px-4 mb-0 space-x-2 items-center bg-white ${
          searchQuery || focused
            ? "rounded-t-lg border-b-[1px] border-gray-200"
            : "rounded-lg border-none"
        }`}
      >
        <icons.search width={14} height={14} />
        <TextInput
          className="flex-1 text-secondary font-gregular text-[14px]"
          value={searchQuery}
          placeholder="Search for an exercise to add"
          placeholderTextColor="#6A6A6A"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={(s) => setSearchQuery(s)}
          onSubmitEditing={() => processSelection(searchQuery)} // submit custom exercise
          hitSlop={{ top: 16, bottom: 16, left: 48, right: 24 }}
        />
      </View>
      {(searchQuery || focused) && (
        <FlatList
          className="px-4 py-3 bg-white rounded-b-lg"
          data={searchResults}
          keyboardShouldPersistTaps="always"
          keyExtractor={(item) => item._id}
          renderItem={({ item: exercise, index }) => (
            <TouchableOpacity
              className={`flex-row space-x-2 items-center justify-between bg-white ${
                index === 4 && "rounded-b-lg"
              }`}
              onPress={() => processSelection(exercise.name, exercise._id)}
            >
              <icons.dumbbell width={14} height={14} />
              <Text className="flex-1 text-gray font-gregular text-body">
                {exercise.name}
              </Text>
              <icons.forwardSelf width={7.05} height={12} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View className="h-2 bg-white"></View>}
          ListEmptyComponent={() => (
            <TouchableOpacity
              className="flex-row items-center justify-between bg-white border-b-lg"
              onPress={() => processSelection(searchQuery)} // submit custom exercise
            >
              <Text className="text-gray font-gregular text-body">
                Add as custom exercise
              </Text>
              <icons.forwardSelf width={7.05} height={12} />
            </TouchableOpacity>
          )}
        />
      )}
    </ScrollView>
  );
};

export default ExerciseBrowser;
