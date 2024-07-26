import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import Divider from "../../components/Divider";
import CardContainer from "../../components/CardContainer";
import { fetchFullWorkout } from "../../database/database";
import { useSQLiteContext } from "expo-sqlite";

const ExerciseCard = ({ exercise }) => {
  return <CardContainer></CardContainer>;
};

const ViewWorkout = () => {
  const db = useSQLiteContext();
  const params = useLocalSearchParams();
  const [fullWorkout, setFullWorkout] = useState({});

  useEffect(() => {
    const getFullWorkout = async () => {
      const workout = await fetchFullWorkout(db, params._id);
      setFullWorkout(workout);
    };

    getFullWorkout();
  }, [db, params._id]);

  return (
    <SafeAreaView
      className="bg-white-100 h-full px-8"
      edges={["right", "left", "top"]}
    >
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
      <View className="flex-row justify-between items-start space-x-2">
        <Text className="text-gray font-gregular text-csub">
          {fullWorkout.workout.name}
        </Text>
        <TouchableOpacity onPress={() => {}}>
          <icons.editLarge />
        </TouchableOpacity>
      </View>
      <FlatList />
    </SafeAreaView>
  );
};

export default ViewWorkout;
