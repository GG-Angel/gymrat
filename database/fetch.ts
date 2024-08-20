/**
 * Contains methods that handle fetching elements from the database
 * and returning their normalized versions to be used in the application.
 */

import { splitField } from "@/utils/format";
import {
  Exercise,
  ExerciseSet,
  MasterExercise,
  Routine,
  SetType,
  Workout,
} from "@/utils/types";
import { SQLiteDatabase } from "expo-sqlite";

type FetchedWorkout = {
  _id: string;
  name: string;
  days: string | null;
  tags: string | null;
};

type FetchedExercise = {
  _id: string;
  workout_id: string;
  master_id: string | null;
  name: string;
  rest: number;
  notes: string;
  tags: string;
};

type FetchedSet = {
  _id: string;
  exercise_id: string;
  type: SetType;
  weight: number | null;
  reps: number | null;
};

type FetchedMasterExercise = {
  _id: string;
  name: string;
  muscles: string;
};

/**
 * Gets a specified workout routine from the database and
 * returns it in a viewable object format.
 * @param db The database.
 * @param workoutId The id of the workout we want to get.
 * @returns An object representation of the routine with displayable values.
 */
export const fetchRoutine = async (
  db: SQLiteDatabase,
  workoutId: string
): Promise<Routine> => {
  const workout = await fetchWorkout(db, workoutId);
  const exercises = await fetchExercisesFromWorkout(db, workoutId);
  const exerciseIds = exercises.map((exercise) => exercise._id);

  const routine: Routine = {
    workout: {
      ...workout,
      exerciseIds: exerciseIds,
    },
    exercises: {},
    sets: {},
  };

  for (const exercise of exercises) {
    const sets = await fetchSetsFromExercise(db, exercise._id);
    const setIds = sets.map((s) => s._id);

    routine.exercises[exercise._id] = {
      ...exercise,
      setIds: setIds,
    };

    sets.forEach((set) => (routine.sets[set._id] = set));
  }

  return routine;
};

/**
 * Fetches a workout from the database.
 * @param db The database.
 * @param workoutId The id of the workout we want to get.
 * @returns The normalized workout.
 */
export async function fetchWorkout(
  db: SQLiteDatabase,
  workoutId: string
): Promise<Workout> {
  const workout: FetchedWorkout | null = await db.getFirstAsync(
    "SELECT * FROM Workout WHERE _id = ?",
    workoutId
  );

  if (!workout) {
    throw new Error(`Could not find a Workout with an ID of ${workoutId}.`);
  }

  const exercises: Exercise[] = await fetchExercisesFromWorkout(db, workoutId);

  return {
    ...workout,
    exerciseIds: exercises.map((e) => e._id),
    days: splitField(workout.days),
    tags: splitField(workout.tags),
  };
}

/**
 * Fetches all available workouts from the database 
 * without their associated exercises for fast lookup.
 * @param db The database.
 * @returns An array of all available workouts.
 */
export async function fetchAllWorkouts(db: SQLiteDatabase): Promise<Omit<Workout, "exerciseIds">[]> {
  const workouts: FetchedWorkout[] = await db.getAllAsync("SELECT * FROM Workout") ?? [];

  return workouts.map((workout) => ({
    _id: workout._id,
    name: workout.name,
    days: splitField(workout.days),
    tags: splitField(workout.tags),
  }));
}


/**
 * Fetches an exercise from the database.
 * @param db The database.
 * @param exerciseId The id of the exercise we want to get.
 * @returns The normalized exercise.
 */
export async function fetchExercise(
  db: SQLiteDatabase,
  exerciseId: string
): Promise<Exercise> {
  const exercise: FetchedExercise | null = await db.getFirstAsync(
    "SELECT * FROM Exercise WHERE _id = ?",
    exerciseId
  );

  if (!exercise) {
    throw new Error(`Could not find an Exercise with an ID of ${exerciseId}.`);
  }

  const sets: ExerciseSet[] = await fetchSetsFromExercise(
    db,
    exercise.workout_id
  );

  return {
    ...exercise,
    setIds: sets.map((s) => s._id),
    tags: splitField(exercise.tags),
  };
}

/**
 * Fetches all exercises related to a particular workout.
 * @param db The database.
 * @param workoutId The id of the workout that has the exercises we want to get.
 * @returns An array of normalized exercises related to the workout.
 */
export async function fetchExercisesFromWorkout(
  db: SQLiteDatabase,
  workoutId: string
): Promise<Exercise[]> {
  const exercises: FetchedExercise[] | null = await db.getAllAsync(
    "SELECT * FROM Exercise WHERE workout_id = ?",
    workoutId
  );

  if (!exercises) {
    throw new Error(
      `Could not find Exercises from a Workout with an ID of ${workoutId}.`
    );
  }

  const normalizedExercises: Exercise[] = await Promise.all(
    exercises.map(async (exercise) => {
      const sets: ExerciseSet[] = await fetchSetsFromExercise(db, exercise._id); // use exercise._id for fetching sets
      return {
        ...exercise,
        setIds: sets.map((s) => s._id),
        tags: splitField(exercise.tags),
      };
    })
  );

  return normalizedExercises;
}

/**
 * Fetches a master exercise from the database.
 * @param db The database.
 * @param masterExerciseId The id of the master exercise we want to get.
 * @returns The normalized master exercise.
 */
export async function fetchMasterExercise(
  db: SQLiteDatabase,
  masterExerciseId: string
): Promise<MasterExercise> {
  const masterExercise: FetchedMasterExercise | null = await db.getFirstAsync(
    "SELECT * FROM MasterExercise WHERE _id = ?",
    masterExerciseId
  );

  if (!masterExercise) {
    throw new Error(
      `Could not find a Master Exercise with an ID of ${masterExerciseId}.`
    );
  }

  return {
    ...masterExercise,
    muscles: splitField(masterExercise.muscles),
  };
}

/**
 * Searches for a maximum of five master exercises according to the search query given by the user.
 * @param db The database.
 * @param query The user's search query.
 * @returns An array of related master exercises, or an empty array if nothing is found.
 */
export async function searchMasterExercise(db: SQLiteDatabase, query: string): Promise<MasterExercise[]> {
  const results: FetchedMasterExercise[] = await db.getAllAsync(
    "SELECT * FROM MasterExercise WHERE name LIKE ? LIMIT 5",
    query
  );
  return results.map(result => ({ ...result, muscles: splitField(result.muscles) }));
}

/**
 * Fetches an exercise set from the database.
 * @param db The database.
 * @param setId The id of the exercise set we want to get.
 * @returns The normalized exercise set.
 */
export async function fetchSet(
  db: SQLiteDatabase,
  setId: string
): Promise<ExerciseSet> {
  const set: FetchedSet | null = await db.getFirstAsync(
    "SELECT * FROM ExerciseSet WHERE _id = ?",
    setId
  );

  if (!set) {
    throw new Error(`Could not find a Set with an ID of ${setId}.`);
  }

  return set;
}

/**
 * Fetches all sets related to a particular exercise.
 * @param db The database.
 * @param exerciseId The id of the exercise that has the sets we want to get.
 * @returns An array of normalized sets related to the exercise.
 */
export async function fetchSetsFromExercise(
  db: SQLiteDatabase,
  exerciseId: string
): Promise<ExerciseSet[]> {
  const sets: FetchedSet[] | null = await db.getAllAsync(
    "SELECT * FROM ExerciseSet WHERE exercise_id = ?",
    exerciseId
  );

  if (!sets) {
    throw new Error(
      `Could not find Sets from an Exercise with an ID of ${exerciseId}.`
    );
  }

  return sets;
}
