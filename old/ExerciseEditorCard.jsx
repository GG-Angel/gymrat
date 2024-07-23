import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import CardContainer from "../components/CardContainer";
import { icons } from "../constants";
import CustomButton from "../components/CustomButton";
import uuid from "react-native-uuid";

const setTypes = ["Standard", "Warm-up", "Drop", "Failure"];

const SetEditor = ({ index, set, handleSetEdits }) => {
  const [type, setType] = useState(setTypes.indexOf(set.type));
  const [weight, setWeight] = useState(set.weight);
  const [reps, setReps] = useState(set.reps);

  useEffect(() => {
    handleSetEdits({
      ...set,
      type: setTypes[type],
    });
  }, [type]);

  useEffect(() => {
    handleSetEdits({
      ...set,
      weight: weight,
      reps: reps,
    });
  }, [weight, reps]);

  const handleType = () => {
    setType((prev) => {
      if (prev === setTypes.length - 1) {
        return 0;
      } else {
        return prev + 1;
      }
    });
  };

  const handleBlur = () => {
    let formattedWeight = parseFloat(weight).toFixed(2);
    formattedWeight = isNaN(formattedWeight)
      ? null
      : formattedWeight.replace(/\.?0*$/, "");

    let parsedReps = parseInt(reps);
    parsedReps = isNaN(parsedReps) ? null : parsedReps;

    setWeight(formattedWeight);
    setReps(parsedReps);
  };

  return (
    <View className="flex flex-row justify-between items-center space-x-2">
      <TouchableOpacity
        className={`flex-[0.16] py-1 rounded-md ${
          ["bg-white-100", "bg-yellow", "bg-purple", "bg-red"][type]
        }`}
        onPress={handleType}
      >
        <Text
          className={`${
            type > 0 ? "text-white font-gbold" : "text-gray font-gregular"
          } text-cbody text-center`}
        >
          {type === 0 ? index + 1 : setTypes[type].charAt(0)}
        </Text>
      </TouchableOpacity>
      <View className="flex-[0.48] bg-white-100 py-1 rounded-md">
        <TextInput
          className="flex-1 text-gray font-gregular text-cbody text-center"
          keyboardType="numeric"
          value={weight ? String(weight) : ""}
          placeholder={"N/A"}
          placeholderTextColor="#BABABA"
          onChangeText={(w) => setWeight(w)}
          onBlur={handleBlur}
          maxLength={8}
        />
      </View>
      <View className="flex-[0.36] bg-white-100 py-1 rounded-md">
        <TextInput
          className="flex-1 text-gray font-gregular text-cbody text-center"
          keyboardType="numeric"
          value={reps ? String(reps) : ""}
          placeholder={"N/A"}
          placeholderTextColor="#BABABA"
          onChangeText={(r) => setReps(r)}
          onBlur={handleBlur}
          maxLength={8}
        />
      </View>
    </View>
  );
};

const ExerciseEditorCard = ({ exercise, handleEdits, handleDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [exerciseDetails, setExerciseDetails] = useState(exercise);

  const handleAddSet = () => {
    setExerciseDetails((prev) => ({
      ...prev,
      sets: [
        ...prev.sets,
        {
          _id: uuid.v4(),
          type: "Standard",
          weight: null,
          reps: null,
        },
      ],
    }));
  };

  const handleEditSet = (updatedSet) => {
    setExerciseDetails((prev) => ({
      ...prev,
      sets: prev.sets.map((set) =>
        set._id === updatedSet._id ? updatedSet : set
      ),
    }));
  };

  const handleRemoveLastSet = () => {
    setExerciseDetails((prev) => {
      const updatedSets = prev.sets.slice(0, -1);
      return {
        ...prev,
        sets: updatedSets,
      };
    });
  };

  useEffect(() => {
    console.log("Exercise Updated\n", JSON.stringify(exerciseDetails, null, 2));
    handleEdits(exerciseDetails);
  }, [exerciseDetails]);

  return (
    <>
      <CardContainer
        containerStyles={`${
          expanded ? "rounded-b-none border-b-[1px] border-gray-200" : ""
        }`}
      >
        <View className="flex-row justify-between items-center space-x-6">
          <View>
            <Text className="text-secondary font-gbold text-csub mb-0.5">
              {exercise.title}
            </Text>
            <Text className="text-gray font-gregular text-cbody">
              {`${exercise.sets.length} Sets`}
            </Text>
          </View>
          <TouchableOpacity
            className="w-[34px] h-[34px] flex justify-center items-center"
            onPress={() => setExpanded(!expanded)}
          >
            {expanded ? <icons.collapse /> : <icons.expand />}
          </TouchableOpacity>
        </View>
      </CardContainer>
      {expanded ? (
        <CardContainer containerStyles="rounded-t-none">
          <FlatList
            data={exercise.sets}
            keyExtractor={(item) => item._id}
            renderItem={({ setId: item, index }) => (
              <SetEditor
                index={index}
                set={item}
                handleSetEdits={handleEditSet}
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
                    className="w-[38px] h-[38px] flex justify-center items-center"
                    onPress={() => handleDelete(exercise)}
                  >
                    <icons.trash />
                  </TouchableOpacity>
                  <View className="flex-row">
                    <CustomButton
                      title="Remove Set"
                      handlePress={handleRemoveLastSet}
                      containerStyles="bg-secondary mr-2"
                    />
                    <CustomButton title="Add Set" handlePress={handleAddSet} />
                  </View>
                </View>
              </View>
            )}
          />
        </CardContainer>
      ) : (
        <></>
      )}
    </>
  );
};

export default ExerciseEditorCard;
