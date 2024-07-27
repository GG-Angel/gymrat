import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import Divider from "../../components/Divider";
import CardContainer from "../../components/CardContainer";
import { fetchFullWorkout } from "../../database/database";
import { useSQLiteContext } from "expo-sqlite";

const ViewWorkoutContext = createContext();

const ViewWorkoutProvider = ({ children }) => {
  const db = useSQLiteContext();
  const params = useLocalSearchParams();
  const [fullWorkout, setFullWorkout] = useState(null);

  const contextValue = useMemo(() => ({ fullWorkout }), [fullWorkout]);

  useEffect(() => {
    const getFullWorkout = async () => {
      const workout = await fetchFullWorkout(db, params._id);
      setFullWorkout(workout);
    };

    getFullWorkout();
  }, [db, params._id]);

  // useEffect(() => {
  //   console.log(JSON.stringify(form, null, 2));
  // }, [workout]);

  return (
    <ViewWorkoutContext.Provider value={contextValue}>
      {children}
    </ViewWorkoutContext.Provider>
  )
}

const setTypeStyles = {
  "Standard": {
    container: "bg-white-100",
    text: "text-gray font-gregular",
  },
  "Warm-up": {
    container: "bg-yellow",
    text: "text-white font-gbold",
  },
  "Drop": {
    container: "bg-purple",
    text: "text-white font-gbold",
  },
  "Failure": {
    container: "bg-red",
    text: "text-white font-gbold",
  },
};

const ExerciseCardSet = ({ set, index }) => {
  return (
    <View className="flex flex-row justify-between items-center space-x-2">
      <View className={`flex-[0.16] py-1 rounded-md ${setTypeStyles[set.type].container}`}>
        <Text className={`text-cbody text-center ${setTypeStyles[set.type].text}`}>
          {set.type === "Standard" ? index + 1 : set.type.charAt(0)}
        </Text>
      </View>
      <View className={`flex-[0.48] bg-white-100 py-1 rounded-md ${!set.weight && "opacity-50"}`}>
        <Text className="text-gray font-gregular text-cbody text-center">
          {set.weight ?? "N/A"}
        </Text>
      </View>
      <View className={`flex-[0.36] bg-white-100 py-1 rounded-md ${!set.reps && "opacity-50"}`}>
        <Text className="text-gray font-gregular text-cbody text-center">
          {set.reps ?? "N/A"}
        </Text>
      </View>
    </View>
  )
}

const ExerciseCard = ({ exercise }) => {
  const { fullWorkout } = useContext(ViewWorkoutContext);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <CardContainer containerStyles={`${isExpanded && "rounded-b-none border-b-[1px] border-gray-200"}`}>
          <View className="flex-row justify-between items-center space-x-6">
            <View className="flex-1">
              <Text className="text-secondary font-gbold text-csub">
                {exercise.name}
              </Text>
              <Text className="text-gray font-gregular text-cbody">
                {`${exercise.setIds.length} Sets`}
              </Text>
              <FlatList
                className="flex-row flex-wrap mt-2 mb-[-4px]"
                data={exercise.tags}
                keyExtractor={(item) => item}
                renderItem={({ item: tag }) => (
                  <View className="bg-white-100 py-1 px-2.5 rounded-xl mr-1 mb-1">
                    <Text className="text-gray font-gregular text-ctri">
                      {tag}
                    </Text>
                  </View>
                )}
                scrollEnabled={false}
              />
            </View>
            <View className="w-[34px] h-[34px] flex justify-center items-center">
              {isExpanded ? <icons.collapse /> : <icons.expand />}
            </View>
          </View>
        </CardContainer>
      </TouchableOpacity>
      { isExpanded && (
        <CardContainer containerStyles="rounded-t-none">
          <FlatList 
            data={exercise.setIds}
            keyExtractor={(setId) => setId}
            renderItem={({ item: setId, index }) => (
              <ExerciseCardSet 
                set={fullWorkout.sets[setId]}
                index={index}
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
          />
        </CardContainer>
      ) }
    </>
  );
};

const ViewWorkoutPage = () => {
  const { fullWorkout } = useContext(ViewWorkoutContext);
  
  return (
    <>
      <View className="flex-row justify-between items-center space-x-2 mt-2">
        <View className="flex-row flex-1 items-center space-x-2">
          <TouchableOpacity onPress={() => router.back()}>
            <icons.crumbtrail />
          </TouchableOpacity>
          <Text className="text-secondary font-gbold text-ch1">Workout</Text>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <icons.hamburger />
        </TouchableOpacity>
      </View>
      <Divider />
      {fullWorkout && (
        <>
          <View className="flex-row justify-between items-start space-x-2">
            <Text className="text-gray font-gregular text-csub">
              {fullWorkout.workout.name}
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <icons.editLarge />
            </TouchableOpacity>
          </View>
          <FlatList
            className="mt-3"
            data={fullWorkout.workout.exerciseIds}
            keyExtractor={(exerciseId) => exerciseId}
            renderItem={({ item: exerciseId }) => (
              <ExerciseCard exercise={fullWorkout.exercises[exerciseId]} />
            )}
            ItemSeparatorComponent={() => <View className="h-4"></View>}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        </>
      )}
    </>
  );
}

const ViewWorkout = () => {
  const db = useSQLiteContext();
  const params = useLocalSearchParams();
  const [fullWorkout, setFullWorkout] = useState(null);

  return (
    <ViewWorkoutProvider>
      <SafeAreaView
        className="bg-white-100 h-full px-8"
        edges={["right", "left", "top"]}
      >
        <ViewWorkoutPage />
      </SafeAreaView>
    </ViewWorkoutProvider>
  );
};

export default ViewWorkout;
