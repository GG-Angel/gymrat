/**
 * Contains methods that handle inserting items into
 * the database, such as when creating a new workout routine.
 */

import { joinField, parseDecimal, parseWhole } from "@/utils/format";
import { Routine } from "@/utils/types";
import { SQLiteDatabase } from "expo-sqlite";

/**
 * Saves a completely new workout routine to the database.
 * @param db The database.
 * @param routine The workout routine we want to save.
 */
export const insertRoutine = async (
  db: SQLiteDatabase,
  routine: Routine
): Promise<void> => {
  const { workout, exercises, sets } = routine;

  // aggregate overall muscles worked for a workout
  const allTags = new Set(
    workout.exerciseIds.flatMap((exerciseId) => exercises[exerciseId].tags)
  );

  // insert workout
  await db.runAsync(
    "INSERT INTO Workout (_id, name, days, tags) VALUES (?, ?, ?, ?);",
    workout._id,
    workout.name,
    joinField(workout.days),
    joinField([...allTags])
  );

  // insert exercises
  for (const exerciseId of workout.exerciseIds) {
    const exercise = exercises[exerciseId];

    // insert an exercise
    await db.runAsync(
      "INSERT INTO Exercise (_id, workout_id, name, rest, notes, tags) VALUES (?, ?, ?, ?, ?, ?);",
      exercise._id,
      workout._id,
      exercise.name,
      exercise.rest,
      exercise.notes,
      joinField(exercise.tags)
    );

    // insert sets from this exercise
    for (const setId of exercise.setIds) {
      const set = sets[setId];

      // insert set
      await db.runAsync(
        "INSERT INTO ExerciseSet (_id, exercise_id, type, weight, reps) VALUES (?, ?, ?, ?, ?);",
        set._id,
        exercise._id,
        set.type,
        set.weight ? parseDecimal(set.weight) : null,
        set.reps ? parseWhole(set.reps) : null
      );
    }
  }

  console.log(
    "Saved new routine into database:",
    JSON.stringify(routine, null, 2)
  );
};