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
import { Icons } from "../constants";
import { useSQLiteContext } from "expo-sqlite";
import { Exercise, MasterExercise } from "@/utils/types";
import { generateUUID } from "@/database-old/setup";
import {
  fetchMasterExercise,
  searchMasterExercise,
} from "@/database-old/fetch";

type Submission = Pick<Exercise, "_id" | "master_id" | "name" | "tags">;

interface ExerciseBrowserProps {
  handleSubmit: (exercise: Submission) => void;
  containerStyles?: string;
}

const ExerciseBrowser = ({
  handleSubmit,
  containerStyles,
}: ExerciseBrowserProps) => {
  const db = useSQLiteContext();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<MasterExercise[]>([]);
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    async function performSearch() {
      const results = await searchMasterExercise(db, searchQuery);
      setSearchResults(results);
    }
    performSearch();
  }, [searchQuery]);

  const processSelection = async (exerciseName: string, masterId?: string) => {
    if (exerciseName.trim().length === 0) {
      Alert.alert(
        "Invalid Exercise",
        "Please enter a valid name for your custom exercise"
      );
    } else {
      handleSubmit({
        _id: generateUUID(),
        master_id: masterId ?? null,
        name: exerciseName,
        tags: masterId ? (await fetchMasterExercise(db, masterId)).muscles : [],
      });

      setSearchQuery("");
      setFocused(false);
      Keyboard.dismiss;
    }
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
        <Icons.search width={14} height={14} />
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
          keyExtractor={(exercise) => exercise._id}
          renderItem={({ item: exercise, index }) => (
            <TouchableOpacity
              className={`flex-row space-x-2 items-center justify-between bg-white ${
                index === 4 && "rounded-b-lg"
              }`}
              hitSlop={10}
              onPress={() => processSelection(exercise.name, exercise._id)}
            >
              <Icons.dumbbell width={14} height={14} />
              <Text className="flex-1 text-gray font-gregular text-body">
                {exercise.name}
              </Text>
              <Icons.forwardSelf width={7.05} height={12} />
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
              <Icons.forwardSelf width={7.05} height={12} />
            </TouchableOpacity>
          )}
        />
      )}
    </ScrollView>
  );
};

export default ExerciseBrowser;
