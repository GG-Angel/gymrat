/**
 * Contains methods that only handle fetching elements from the database
 * and returning their normalized versions to be used in the application.
 */

import { splitField } from "@/utils/format";
import {
  Exercise,
  ExerciseSet,
  MasterExercise,
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
 * Fetches a workout from the database.
 * @param db The database.
 * @param workoutId The id of the workout we want to get.
 * @returns The normalized workout.
 */
async function fetchWorkout(
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

  return {
    ...workout,
    days: splitField(workout.days),
    tags: splitField(workout.tags),
  };
}

/**
 * Fetches an exercise from the database.
 * @param db The database.
 * @param exerciseId The id of the exercise we want to get.
 * @returns The normalized exercise.
 */
async function fetchExercise(
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

  return {
    ...exercise,
    tags: splitField(exercise.tags),
  };
}

/**
 * Fetches a master exercise from the database.
 * @param db The database.
 * @param masterExerciseId The id of the master exercise we want to get. 
 * @returns The normalized master exercise.
 */ 
async function fetchMasterExercise(
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
 * Fetches an exercise set from the database.
 * @param db The database.
 * @param setId The id of the exercise set we want to get.
 * @returns The normalized exercise set.
 */
async function fetchSet(
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
