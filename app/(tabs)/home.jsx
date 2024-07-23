import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState, memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "../../constants";

import PFP from "../../assets/images/pfp.png";

import TodaysWorkout from "../../components/TodaysWorkout";
import Divider from "../../components/Divider";
import CardContainer from "../../components/CardContainer";
import EmptyState from "../../components/EmptyState";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { formatDays, formatTags, splitField } from "../../utils/format";

const LibraryCardTag = ({ tag, isSearched }) => {
  return (
    <View
      className={`${isSearched ? "bg-secondary" : "bg-white-100"} px-[10px] py-1 rounded-[10px] mr-1 mb-1`}
    >
      <Text
        className={`${isSearched ? "text-white font-gsemibold" : "text-gray font-gregular"} text-cbody text-center`}
      >
        {tag}
      </Text>
    </View>
  );
};

const LibraryCard = ({ name, days, tags, activeFilters }) => {
  return (
    <CardContainer containerStyles="flex-row items-center space-x-6 mb-3">
      <View className="flex-1 space-y-2">
        <View className="space-y-1">
          <Text className="text-gray font-gregular text-cbody">{days}</Text>
          <Text className="text-secondary font-gbold text-csub">{name}</Text>
        </View>
        {tags.length > 0 && (
          <View className="flex-row flex-wrap mb-[-4px]">
            {tags.map((tag, index) => (
              <LibraryCardTag
                key={index}
                tag={tag}
                isSearched={activeFilters.includes(tag)}
              />
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity
        className="w-[34px] h-[34px] items-center justify-center"
        onPress={() => {}}
      >
        <icons.forward width={11} />
      </TouchableOpacity>
    </CardContainer>
  );
};

const Filter = ({ filter, isSelected, handleToggleFilter }) => {
  return (
    <TouchableOpacity
      className={`${
        isSelected ? "bg-primary" : "bg-white"
      } px-[10px] py-1 rounded-xl w-auto mr-1`}
      onPress={() => handleToggleFilter(filter)}
    >
      <Text
        className={`${
          isSelected
            ? "text-white font-gsemibold"
            : "text-secondary font-gregular"
        } text-cbody`}
      >
        {filter}
      </Text>
    </TouchableOpacity>
  );
};

const Home = () => {
  const db = useSQLiteContext();
  const [workouts, setWorkouts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    async function fetchWorkouts() {
      const result = await db.getAllAsync("SELECT * FROM Workout;");
      setWorkouts(result);
    }
    async function fetchFilters() {
      const result = await db.getAllAsync("SELECT tags FROM Workout;");
      setFilters(formatTags(result));
    }
    fetchWorkouts();
    fetchFilters();
  }, []);

  const handleToggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <SafeAreaView
      className="bg-white-100 h-full"
      edges={["right", "left", "top"]}
    >
      <FlatList
        data={workouts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <LibraryCard
            name={item.name}
            days={formatDays(item.days)}
            tags={splitField(item.tags)}
            activeFilters={selectedFilters}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        ListHeaderComponent={() => {
          if (workouts.length === 0) {
            return null;
          }

          return (
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
              <View className="mb-2 flex-row justify-between items-center">
                <Text className="font-gregular text-gray text-csub">
                  Workout Library
                </Text>
                <TouchableOpacity
                  className="w-[22px] h-[22px] flex justify-center items-center"
                  onPress={() => router.push("editor/newworkout")}
                >
                  <icons.add width={13} height={13} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={filters}
                extraData={selectedFilters}
                renderItem={({ item, index }) => (
                  <Filter
                    key={index}
                    filter={item}
                    isSelected={selectedFilters.includes(item)}
                    handleToggleFilter={handleToggleFilter}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                horizontal
              />
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            Image={icons.empty}
            headerText="No Workouts Found"
            subheadText="Create a workout to begin tracking your progress"
            buttonTitle="Create a New Workout"
            buttonHandlePress={() => router.push("editor/newworkout")}
          />
        )}
      />
    </SafeAreaView>
  );
};

// const Filter = ({ filter, handlePress }) => {
//   const [isSelected, setIsSelected] = useState(false);
//   return (
//     <TouchableOpacity
//       className={`${
//         isSelected ? "bg-primary" : "bg-white"
//       } px-[10px] py-1 rounded-xl w-auto mr-1`}
//       onPress={() => {
//         handlePress();
//         setIsSelected(!isSelected);
//       }}
//     >
//       <Text
//         className={`${
//           isSelected
//             ? "text-white font-gsemibold"
//             : "text-secondary font-gregular"
//         } text-cbody`}
//       >
//         {filter}
//       </Text>
//     </TouchableOpacity>
//   );
// };

// const Home = () => {
//   const [count, setCount] = useState(0)

//   useEffect(() => console.log(count), [count]);

//   return (
//     <>
//       <SafeAreaView className="px-8 h-full flex items-center">
//         <FlatList
//           data={["Chest", "Shoulders", "Triceps", "Delts", "Hamstrings", "Calves"]}
//           horizontal
//           renderItem={({ item, index }) => (
//             <Filter
//               key={index}
//               filter={item}
//               handlePress={() => setCount(count + 1)}
//             />
//           )}
//         />
//       </SafeAreaView>
//     </>
//   )
// }

export default Home;
