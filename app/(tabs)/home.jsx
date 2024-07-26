import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React, {
  useCallback,
  useEffect,
  useState,
  memo,
  createContext,
  useRef,
  useReducer,
  useMemo,
  useContext,
} from "react";
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
import { useFocusEffect } from "@react-navigation/native";

// const LibraryCardTag = ({ tag, isSearched }) => {
//   return (
//     <View
//       className={`${isSearched ? "bg-secondary" : "bg-white-100"} px-[10px] py-1 rounded-[10px] mr-1 mb-1`}
//     >
//       <Text
//         className={`${isSearched ? "text-white font-gsemibold" : "text-gray font-gregular"} text-cbody text-center`}
//       >
//         {tag}
//       </Text>
//     </View>
//   );
// };

// const LibraryCard = ({ name, days, tags, activeFilters }) => {
//   return (
//     <CardContainer containerStyles="flex-row items-center space-x-6 mb-3">
//       <View className="flex-1 space-y-2">
//         <View className="space-y-1">
//           <Text className="text-gray font-gregular text-cbody">{days}</Text>
//           <Text className="text-secondary font-gbold text-csub">{name}</Text>
//         </View>
//         {tags.length > 0 && (
//           <View className="flex-row flex-wrap mb-[-4px]">
//             {tags.map((tag, index) => (
//               <LibraryCardTag
//                 key={index}
//                 tag={tag}
//                 isSearched={activeFilters.includes(tag)}
//               />
//             ))}
//           </View>
//         )}
//       </View>
//       <TouchableOpacity
//         className="w-[34px] h-[34px] items-center justify-center"
//         onPress={() => {}}
//       >
//         <icons.forward width={11} />
//       </TouchableOpacity>
//     </CardContainer>
//   );
// };

// const Filter = ({ filter, isSelected, handleToggleFilter }) => {
//   return (
//     <TouchableOpacity
//       className={`${
//         isSelected ? "bg-primary" : "bg-white"
//       } px-[10px] py-1 rounded-xl w-auto mr-1`}
//       onPress={() => handleToggleFilter(filter)}
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
//   const db = useSQLiteContext();
//   const [workouts, setWorkouts] = useState([]);
//   const [filters, setFilters] = useState([]);
//   const [selectedFilters, setSelectedFilters] = useState([]);

//   useFocusEffect(
//     useCallback(() => {
//     async function fetchWorkouts() {
//       const result = await db.getAllAsync("SELECT * FROM Workout;");
//       setWorkouts(result);
//     }
//     async function fetchFilters() {
//       const result = await db.getAllAsync("SELECT tags FROM Workout;");
//       setFilters(formatTags(result));
//     }
//     fetchWorkouts();
//     fetchFilters();
//     }, [])
//   )

//   const handleToggleFilter = (filter) => {
//     setSelectedFilters((prev) =>
//       prev.includes(filter)
//         ? prev.filter((f) => f !== filter)
//         : [...prev, filter]
//     );
//   };

//   return (
//     <SafeAreaView
//       className="bg-white-100"
//       edges={["right", "left", "top"]}
//     >
//       <FlatList
//         data={workouts}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <LibraryCard
//             name={item.name}
//             days={formatDays(item.days)}
//             tags={splitField(item.tags)}
//             activeFilters={selectedFilters}
//           />
//         )}
//         contentContainerStyle={{ paddingHorizontal: 32, height: "100%" }}
//         ListHeaderComponent={() => {
//           if (workouts.length === 0) {
//             return null;
//           }

//           return (
//             <View className="mt-2 mb-4">
//               <View className="flex-row justify-between items-center">
//                 <Text className="text-secondary font-gbold text-ch1">Home</Text>
//                 <Image
//                   source={PFP}
//                   resizeMode="contain"
//                   className="w-9 h-9 rounded-[20px] border-2 border-secondary"
//                 />
//               </View>
//               <Divider />
//               <View className="mb-6">
//                 <Text className="font-gregular text-gray text-csub mb-3">
//                   Recommended Workout
//                 </Text>
//                 <TodaysWorkout />
//               </View>
//               <View className="mb-2 flex-row justify-between items-center">
//                 <Text className="font-gregular text-gray text-csub">
//                   Workout Library
//                 </Text>
//                 <TouchableOpacity
//                   className="w-[22px] h-[22px] flex justify-center items-center"
//                   onPress={() => router.push("/new-workout")}
//                 >
//                   <icons.add width={13} height={13} />
//                 </TouchableOpacity>
//               </View>
//               <FlatList
//                 data={filters}
//                 extraData={selectedFilters}
//                 renderItem={({ item, index }) => (
//                   <Filter
//                     key={index}
//                     filter={item}
//                     isSelected={selectedFilters.includes(item)}
//                     handleToggleFilter={handleToggleFilter}
//                   />
//                 )}
//                 showsHorizontalScrollIndicator={false}
//                 horizontal
//               />
//             </View>
//           );
//         }}
//         ListEmptyComponent={() => (
//           <EmptyState
//             Image={icons.empty}
//             headerText="No Workouts Found"
//             subheadText="Create a workout to begin tracking your progress"
//             buttonTitle="Create a New Workout"
//             buttonHandlePress={() => router.push("/new-workout")}
//           />
//         )}
//       />
//     </SafeAreaView>
//   );
// };

const HomeContext = createContext();

function homeReducer(state, action) {
  switch (action.type) {
    case "SET_WORKOUTS":
      return {
        ...state,
        workouts: action.workouts,
      };
    case "TOGGLE_FILTER":
      return {
        ...state,
        selectedFilters: state.selectedFilters.includes(action.filter)
          ? state.selectedFilters.filter((f) => f !== action.filter)
          : [...state.selectedFilters, action.filter],
      };
    case "REORDER_FILTERS": 
      return {
        ...state,
        orderedFilters: [
          ...state.selectedFilters,
          ...action.allFilters.filter((f) => !state.selectedFilters.includes(f))
        ]
      }
    default:
      return state;
  }
}

const HomeProvider = ({ children }) => {
  const db = useSQLiteContext();
  const allFiltersRef = useRef([
    "Abdominals",
    "Adductors",
    "Arms",
    "Back",
    "Biceps",
    "Calves",
    "Chest",
    "Core",
    "Forearms",
    "Front Deltoids",
    "Glutes",
    "Hamstrings",
    "Hip Abductors",
    "Hip Flexors",
    "Inner Thighs",
    "Lats",
    "Legs",
    "Lower Back",
    "Obliques",
    "Quads",
    "Quadriceps",
    "Rear Deltoids",
    "Rear Shoulders",
    "Rhomboids",
    "Shoulders",
    "Traps",
    "Triceps",
    "Upper Back",
    "Upper Chest",
  ]);
  const [state, dispatch] = useReducer(homeReducer, {
    workouts: [],
    selectedFilters: [],
    orderedFilters: [],
  });

  // refetches the workouts when loading the home screen
  useFocusEffect(
    useCallback(() => {
      async function fetchWorkouts() {
        const fetchedWorkouts = await db.getAllAsync("SELECT * FROM Workout;");
        const formatWorkouts = fetchedWorkouts.map((workout) => ({
          _id: workout._id,
          name: workout.name,
          days: formatDays(workout.days),
          tags: splitField(workout.tags),
        }));
        dispatch({
          type: "SET_WORKOUTS",
          workouts: formatWorkouts,
        });
      }
      fetchWorkouts();
    }, [])
  );

  // reorders the filter bar when a filter is toggled
  useEffect(() => {
    dispatch({
      type: "REORDER_FILTERS",
      allFilters: allFiltersRef.current
    })
  }, [state.selectedFilters])

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>
  );
};

const FilterBar = () => {
  const { state, dispatch } = useContext(HomeContext);
  return (
    <FlatList
      data={state.orderedFilters}
      keyExtractor={(item) => item}
      renderItem={({ item: filter }) => (
        <TouchableOpacity
          className={`${state.selectedFilters.includes(filter) ? "bg-primary" : "bg-white"} px-3 py-1 rounded-xl mr-1`}
          onPress={() => dispatch({ type: "TOGGLE_FILTER", filter: filter })}
        >
          <Text
            className={`${state.selectedFilters.includes(filter) ? "text-white font-gsemibold" : "text-gray font-gregular"} text-cbody`}
          >
            {filter}
          </Text>
        </TouchableOpacity>
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const WorkoutCard = ({ workout }) => {
  const { state } = useContext(HomeContext);
  return (
    <TouchableOpacity onPress={() => {}}>
      <CardContainer containerStyles="flex-row justify-between">
        <View className="flex-1">
          <Text className="text-gray font-gregular text-cbody">
            {workout.days}
          </Text>
          <Text className="text-secondary font-gsemibold text-csub mt-1">
            {workout.name}
          </Text>
          <FlatList
            className="flex-row flex-wrap mt-2 mb-[-4px]"
            data={workout.tags}
            keyExtractor={(item) => item}
            renderItem={({ item: tag }) => (
              <View className={`${state.selectedFilters.includes(tag) ? "bg-secondary" : "bg-white-100"} py-1 px-2.5 rounded-xl mr-1 mb-1`}>
                <Text className={`${state.selectedFilters.includes(tag) ? "text-white font-gsemibold" : "text-gray font-gregular"} text-ctri`}>
                  {tag}
                </Text>
              </View>
            )}
            scrollEnabled={false}
          />
        </View>
        <View className="w-[34px] h-[34px] items-center justify-center">
          <icons.forward />
        </View>
      </CardContainer>
    </TouchableOpacity>
  );
};

const HomePage = () => {
  const { state, dispatch } = useContext(HomeContext);
  return (
    <>
      <View className="mt-2">
        <Text className="text-secondary font-gbold text-ch1">Home</Text>
      </View>
      <View className="mt-6">
        <Text className="text-gray font-gregular text-csub mb-3">
          Recommended Workouts
        </Text>
        <CardContainer></CardContainer>
      </View>
      <View className="mt-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray font-gregular text-csub mb-3">
            Workout Library
          </Text>
          <TouchableOpacity onPress={() => router.push("/new-workout")}>
            <icons.add />
          </TouchableOpacity>
        </View>
        <FilterBar />
      </View>
      <FlatList
        className="mt-4"
        data={state.workouts}
        keyExtractor={(item) => item._id}
        renderItem={({ item: workout }) => <WorkoutCard workout={workout} />}
      />
    </>
  );
};

export const Home = () => {
  return (
    <HomeProvider>
      <SafeAreaView
        className="bg-white-100 h-full px-8"
        edges={["right", "left", "top"]}
      >
        <HomePage />
      </SafeAreaView>
    </HomeProvider>
  );
};

export default Home;
