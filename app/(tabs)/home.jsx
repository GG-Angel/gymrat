import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "../../constants";

import PFP from "../../assets/images/pfp.png";

import TodaysWorkout from "../../components/TodaysWorkout";
import Divider from "../../components/Divider";
import FilterBar from "../../components/FilterBar";
import CardContainer from "../../components/CardContainer";

const placeholderWorkouts = [
  {
    title: "Push Day",
    days: "Tuesday and Thursday",
    attributes: ["Back", "Biceps"],
    id: 1
  },
  {
    title: "Michael's Leg Day Workout",
    days: "Wednesday and Saturday",
    attributes: ["Quads", "Hamstrings", "Calves"],
    id: 2
  },
]

const LibraryCard = ({ title, days }) => {
  return (
    <CardContainer containerStyles="flex-row items-center space-x-6 mb-3">
      <View className="flex-1 space-y-2">
        <View className="space-y-1">
          <Text className="text-gray font-gregular text-cbody">
            {days}
          </Text>
          <Text className="text-secondary font-gbold text-csub">
            {title}
          </Text>
        </View>
      </View>
      <TouchableOpacity className="w-[34px] h-[34px] items-center justify-center">
        <icons.forward width={11.17} />
      </TouchableOpacity>
    </CardContainer>
  )
}

const Home = () => {
  return (
    <SafeAreaView className="bg-white-100 h-full">
      <FlatList
        data={placeholderWorkouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LibraryCard 
            title={item.title}
            days={item.days}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        ListHeaderComponent={() => (
          <View className="mt-2 mb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-secondary font-gbold text-ch1">Home</Text>
              <Image
                source={PFP}
                resizeMode="contain"
                className="w-9 h-9 rounded-[20px] border-2 border-secondary"
              />
            </View>
            <Divider />
            <View className="mb-6">
              <Text className="font-gregular text-gray text-csub mb-3">
                Recommended Workout
              </Text>
              <TodaysWorkout />
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="font-gregular text-gray text-csub mb-2">
                Workout Library
              </Text>
              <TouchableOpacity className="w-5 h-5">
                <icons.add width={12.25} height={12.25} />
              </TouchableOpacity>
            </View>
            {/* <FilterBar /> */}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
