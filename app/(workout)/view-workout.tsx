import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icons } from "../../constants";
import Divider from "../../components/Divider";
import CardContainer from "../../components/CardContainer";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { formatTime } from "../../utils/format";
import CustomButton from "../../components/CustomButton";
import { Exercise, ExerciseSet, Routine } from "@/utils/types";
import { fetchRoutine } from "@/database/fetch";

interface ViewWorkoutContextValue {
  routine: Routine | null;
}

const ViewWorkoutContext = createContext<ViewWorkoutContextValue>(
  {} as ViewWorkoutContextValue
);

const ViewWorkoutProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const db: SQLiteDatabase = useSQLiteContext();
  const params = useLocalSearchParams();
  const [routine, setRoutine] = useState<Routine | null>(null);

  const contextValue = useMemo(() => ({ routine }), [routine]);

  useEffect(() => {
    const getFullWorkout = async () => {
      const workout: Routine = await fetchRoutine(db, params._id as string);
      setRoutine(workout);
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
  );
};

const setTypeStyles = {
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
};

const ExerciseCardSet: React.FC<{ set: ExerciseSet; index: number }> = ({
  set,
  index,
}) => {
  return (
    <View className="flex flex-row justify-between items-center space-x-2">
      <View
        className={`flex-[0.16] py-1 rounded-md ${setTypeStyles[set.type].container}`}
      >
        <Text
          className={`text-cbody text-center ${setTypeStyles[set.type].text}`}
        >
          {set.type === "Standard" ? index + 1 : set.type.charAt(0)}
        </Text>
      </View>
      <View
        className={`flex-[0.48] bg-white-100 py-1 rounded-md ${!set.weight && "opacity-50"}`}
      >
        <Text className="text-gray font-gregular text-cbody text-center">
          {set.weight ?? "N/A"}
        </Text>
      </View>
      <View
        className={`flex-[0.36] bg-white-100 py-1 rounded-md ${!set.reps && "opacity-50"}`}
      >
        <Text className="text-gray font-gregular text-cbody text-center">
          {set.reps ?? "N/A"}
        </Text>
      </View>
    </View>
  );
};

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({
  exercise,
}) => {
  const { routine } = useContext(ViewWorkoutContext);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <CardContainer
          containerStyles={`${isExpanded && "rounded-b-none border-b-[1px] border-gray-200"}`}
        >
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
              {isExpanded ? <Icons.collapse /> : <Icons.expand />}
            </View>
          </View>
        </CardContainer>
      </TouchableOpacity>
      {isExpanded && routine && (
        <CardContainer containerStyles="rounded-t-none">
          <FlatList
            data={exercise.setIds}
            keyExtractor={(setId) => setId}
            renderItem={({ item: setId, index }) => (
              <ExerciseCardSet set={routine.sets[setId]} index={index} />
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
          <View className="bg-white-100 px-2.5 py-1 rounded-md mt-4 flex-shrink self-start">
            <Text className="text-gray font-gregular text-cbody">
              Rest for {formatTime(exercise.rest)}
            </Text>
          </View>
        </CardContainer>
      )}
    </>
  );
};

const ViewWorkoutPage = () => {
  const { routine } = useContext(ViewWorkoutContext);

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center space-x-2 mt-2">
        <View className="flex-row flex-1 items-center space-x-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Icons.crumbtrail />
          </TouchableOpacity>
          <Text className="text-secondary font-gbold text-ch1">
            Workout
          </Text>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Icons.hamburger />
        </TouchableOpacity>
      </View>
      <Divider />
      {routine && (
        <>
          <Text className="text-gray font-gregular text-csub">
            {routine.workout.name}
          </Text>
          <FlatList
            className="mt-3"
            data={routine.workout.exerciseIds}
            keyExtractor={(exerciseId) => exerciseId}
            renderItem={({ item: exerciseId }) => (
              <ExerciseCard exercise={routine.exercises[exerciseId]} />
            )}
            ItemSeparatorComponent={() => <View className="h-4"></View>}
            contentContainerStyle={{ paddingBottom: 200 }}
          />
        </>
      )}
      <View className="w-full absolute bottom-16 shadow-lg shadow-primary">
        <CustomButton
          title="Start Workout"
          style="primary"
          handlePress={() =>
            router.push({
              pathname: "/active-workout",
              params: { jsonWorkout: JSON.stringify(routine) }, // for some reason we need to do this
            })
          }
        />
      </View>
    </View>
  );
};

const ViewWorkout = () => {
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
