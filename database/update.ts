/**
 * Contains methods that handle upating rows in the database,
 * such as in the case of updating a completed workout.
 */

import { joinField } from "@/utils/format";
import { Exercise, ExerciseSet, Routine, Workout } from "@/utils/types";
import { SQLiteDatabase } from "expo-sqlite";

/**
 * Updates a full workout routine in the database; used when finishing a workout.
 * @param db The database.
 * @param routine The workout routine we want to update.
 */
export const updateRoutine = async (
  db: SQLiteDatabase,
  routine: Routine
): Promise<void> => {
  const { workout, exercises, sets } = routine;

  // update the workout portion
  updateWorkout(db, workout);

  // update each exercise
  workout.exerciseIds.forEach((exerciseId) => {
    const exercise = exercises[exerciseId];
    updateExercise(db, exercise);

    // update each set from each exercise
    exercise.setIds.forEach((setId) => {
      const set = sets[setId];
      updateSet(db, set);
    });
  });
};

/**
 * Updates the workout portion of a full workout routine in the database,
 * such as name, days, and tags.
 * @param db The database.
 * @param workout The workout portion of the routine.
 */
const updateWorkout = async (
  db: SQLiteDatabase,
  workout: Workout
): Promise<void> => {
  const { _id, name, days } = workout;

  await db.runAsync(
    "UPDATE Workout SET name = ?, days = ? WHERE _id = ?",
    name,
    joinField(days),
    _id
  );
};

/**
 * Updates a specific exercise in the database.
 * @param db The database.
 * @param exercise The exercise we want to update.
 */
const updateExercise = async (
  db: SQLiteDatabase,
  exercise: Exercise
): Promise<void> => {
  const { _id, rest, notes } = exercise;

  await db.runAsync(
    "UPDATE Exercise SET rest = ?, notes = ? WHERE _id = ?",
    rest,
    notes,
    _id
  );
};

/**
 * Updates a specific exercise set in the database.
 * @param db The database.
 * @param set The set we want to update.
 */
const updateSet = async (
  db: SQLiteDatabase,
  set: ExerciseSet
): Promise<void> => {
  const { _id, type, weight, reps } = set;

  await db.runAsync(
    "UPDATE ExerciseSet SET type = ?, weight = ?, reps = ? WHERE _id = ?",
    type,
    weight,
    reps,
    _id
  );
};