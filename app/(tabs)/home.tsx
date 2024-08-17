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
  Dispatch,
  PropsWithChildren,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icons, Images } from "../../constants";

import Divider from "../../components/Divider";
import CardContainer from "../../components/CardContainer";
import EmptyState from "../../components/EmptyState";
import { router } from "expo-router";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { formatDays, formatTags, splitField } from "../../utils/format";
import { useFocusEffect } from "@react-navigation/native";
import { FetchedWorkout } from "@/database/database";
import { calculateWeightPotential } from "@/utils/calculations";

interface HomeContextValues {
  state: HomeState;
  dispatch: Dispatch<ReducerAction>;
}

interface HomeState {
  workouts: FormattedWorkout[];
  unselectedFilters: string[];
  selectedFilters: string[];
}

interface FormattedWorkout {
  _id: string;
  name: string;
  days: string;
  tags: string[];
}

type ReducerAction =
  | {
      type: "SET_WORKOUTS";
      workouts: FormattedWorkout[];
    }
  | {
      type: "TOGGLE_FILTER";
      filter: string;
    }
  | {
      type: "CLEAR_FILTERS";
    }
  | {
      type: "ORGANIZE_FILTERS";
      allFilters: string[];
    };

const HomeContext = createContext<HomeContextValues>({} as HomeContextValues);

function homeReducer(state: HomeState, action: ReducerAction) {
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
    case "CLEAR_FILTERS":
      return {
        ...state,
        selectedFilters: [],
      };
    case "ORGANIZE_FILTERS":
      return {
        ...state,
        unselectedFilters: [
          ...action.allFilters.filter(
            (f) => !state.selectedFilters.includes(f)
          ),
        ],
      };
    default:
      return state;
  }
}

const HomeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const db: SQLiteDatabase = useSQLiteContext();
  const allFiltersRef: React.MutableRefObject<string[]> = useRef([
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
    workouts: [] as FormattedWorkout[],
    unselectedFilters: [] as string[],
    selectedFilters: [] as string[],
  });

  // refetches the workouts when loading the home screen
  useFocusEffect(
    useCallback(() => {
      async function fetchWorkouts() {
        const fetchedWorkouts: FetchedWorkout[] = await db.getAllAsync(
          "SELECT * FROM Workout;"
        );
        const formattedWorkouts: FormattedWorkout[] = fetchedWorkouts.map(
          (workout) => ({
            _id: workout._id,
            name: workout.name,
            days: formatDays(workout.days),
            tags: splitField(workout.tags),
          })
        );
        dispatch({
          type: "SET_WORKOUTS",
          workouts: formattedWorkouts,
        });
      }
      fetchWorkouts();
    }, [])
  );

  // reorganizes the filter bar when a filter is toggled
  useEffect(() => {
    dispatch({
      type: "ORGANIZE_FILTERS",
      allFilters: allFiltersRef.current,
    });
  }, [state.selectedFilters]);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>
  );
};

// const TodaysWorkout = ({ workout }) => {
//   return (
//     <CardContainer>

//     </CardContainer>
//   )
// }

// const RecommendedWorkouts = () => {
//   return (
//     <>
//       <TodaysWorkout />
//     </>
//   )
// }

const FilterBar: React.FC = () => {
  const { state, dispatch } = useContext(HomeContext);
  return (
    <>
      <FlatList
        data={state.unselectedFilters}
        keyExtractor={(item) => item}
        renderItem={({ item: filter }) => (
          <TouchableOpacity
            className="bg-white px-3 py-1 rounded-xl mr-1"
            onPress={() =>
              dispatch({ type: "TOGGLE_FILTER", filter: filter })
            }
          >
            <Text className="text-gray font-gregular text-cbody">
              {filter}
            </Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      {state.selectedFilters.length > 0 && (
        <View className="flex-row justify-between items-center space-x-2 mt-2">
          <FlatList
            data={state.selectedFilters}
            keyExtractor={(item) => item}
            renderItem={({ item: filter }) => (
              <TouchableOpacity
                className="bg-primary px-3 py-1 rounded-xl mr-1"
                onPress={() =>
                  dispatch({ type: "TOGGLE_FILTER", filter: filter })
                }
              >
                <Text className="text-white font-gsemibold text-cbody">
                  {filter}
                </Text>
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <TouchableOpacity
            onPress={() => dispatch({ type: "CLEAR_FILTERS" })}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icons.clear />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const WorkoutCard: React.FC<{ workout: FormattedWorkout }> = ({ workout }) => {
  const { state } = useContext(HomeContext);
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/view-workout",
          params: { ...workout },
        })
      }
    >
      <CardContainer containerStyles="flex-row justify-between items-center">
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
            renderItem={({ item: tag }) => {
              return (
                <View
                  className={`${state.selectedFilters.includes(tag) ? "bg-secondary" : "bg-white-100"} py-1 px-2.5 rounded-xl mr-1 mb-1`}
                >
                  <Text
                    className={`${state.selectedFilters.includes(tag) ? "text-white font-gsemibold" : "text-gray font-gregular"} text-ctri`}
                  >
                    {tag}
                  </Text>
                </View>
              );
            }}
            scrollEnabled={false}
          />
        </View>
        <Icons.forward />
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
      { state.workouts.length > 0 && (
        <>
          <View className="mt-6">
            <Text className="text-gray font-gregular text-csub mb-3">
              Recommended Workouts
            </Text>
            {/* <RecommendedWorkouts /> */}
          </View>
          <View className="mt-6">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray font-gregular text-csub mb-3">
                Workout Library
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/new-workout")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icons.add />
              </TouchableOpacity>
            </View>
            <FilterBar />
          </View>
        </>
      )}
      <FlatList
        className="mt-4"
        contentContainerStyle={{
          paddingBottom: 72,
          flexGrow: 1,
        }}
        data={state.workouts}
        keyExtractor={(item) => item._id}
        renderItem={({ item: workout }) => <WorkoutCard workout={workout} /> }
        ItemSeparatorComponent={() => <View className="h-[12px]"></View>}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center">
            <EmptyState 
              Image={Icons.empty}
              headerText="No Workouts Found"
              subheadText="Create a new workout to start tracking your progress"
              buttonTitle="Create a New Workout"
              buttonHandlePress={() => router.push("/new-workout")}
            />
          </View>
        )}
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
