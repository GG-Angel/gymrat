import {
  formatDays,
  joinField,
  parseDecimal,
  parseWhole,
  splitField,
} from "@/utils/format";
import {
  Routine,
  Workout,
  Exercise,
  MasterExercise,
  ExerciseSet,
  SetType,
} from "@/utils/types";
import { SQLiteDatabase } from "expo-sqlite";
import uuid from "react-native-uuid";

/**
 * Sets up the required tables for the local database to function,
 * which include the workout, exercise, master exercise, and set tables.
 * @param db The database.
 */
export const setupDatabase = async (db: SQLiteDatabase) => {
  // reset db
  await db.execAsync(`
    DROP TABLE IF EXISTS Workout;
    DROP TABLE IF EXISTS Exercise;
    DROP TABLE IF EXISTS ExerciseSet;
    DROP TABLE IF EXISTS MasterExercise;
  `);

  // create tables
  await db.execAsync(`
    CREATE TABLE
      IF NOT EXISTS Workout (
        _id TEXT PRIMARY KEY UNIQUE,
        name TEXT NOT NULL,
        days TEXT,
        tags TEXT
      );
  
    CREATE TABLE
      IF NOT EXISTS Exercise (
        _id TEXT PRIMARY KEY UNIQUE,
        workout_id TEXT NOT NULL,
        master_id TEXT,
        name TEXT NOT NULL,
        rest INTEGER,
        notes TEXT,
        tags TEXT,
        FOREIGN KEY (master_id) REFERENCES MasterExercise (_id),
        FOREIGN KEY (workout_id) REFERENCES Workout (_id) ON DELETE CASCADE
      );
  
    CREATE TABLE
      IF NOT EXISTS ExerciseSet (
        _id TEXT PRIMARY KEY UNIQUE,
        exercise_id TEXT NOT NULL,
        type TEXT CHECK (
          type IN ('Standard', 'Warm-up', 'Drop', 'Failure')
        ),
        weight REAL,
        reps INTEGER,
        FOREIGN KEY (exercise_id) REFERENCES Exercise (_id) ON DELETE CASCADE
      );

    CREATE TABLE 
      IF NOT EXISTS MasterExercise (
        _id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        muscles TEXT NOT NULL
    );
  `);

  // setup master table
  await setupMasterTable(db);

  // setup dummy data
  await setupDummyData(db);

  console.log("Database Started");
};

/**
 * Gets a specified workout routine from the database and
 * returns it in a viewable object format.
 * @param db The database.
 * @param workoutId The id of the workout we want to get.
 * @returns An object representation of the routine with displayable values.
 */
export const getRoutine = async (
  db: SQLiteDatabase,
  workoutId: string
): Promise<Routine> => {
  const workout: Workout = (await db.getFirstAsync(
    "SELECT * FROM Workout WHERE _id = ?",
    workoutId
  ))!;
  const exercises: Exercise[] = await db.getAllAsync(
    "SELECT * FROM Exercise WHERE workout_id = ?",
    workoutId
  );
  const exerciseIds: string[] = exercises.map((e) => e._id);

  const fullWorkout: Routine = {
    workout: {
      _id: workout._id,
      name: workout.name,
      days: splitField(workout.days),
      tags: splitField(workout.tags),
      exerciseIds: exerciseIds,
    },
    exercises: {},
    sets: {},
  };

  await Promise.all(
    exercises.map(async (exercise) => {
      const sets: ExerciseSet[] = await db.getAllAsync(
        "SELECT * FROM ExerciseSet WHERE exercise_id = ?",
        exercise._id
      );
      const setIds: string[] = sets.map((s) => s._id);

      fullWorkout.exercises[exercise._id] = {
        _id: exercise._id,
        master_id: exercise.master_id,
        name: exercise.name,
        rest: exercise.rest,
        notes: exercise.notes,
        tags: splitField(exercise.tags),
        setIds: setIds,
      };

      sets.forEach((set) => {
        fullWorkout.sets[set._id] = {
          _id: set._id,
          type: set.type,
          weight: set.weight,
          reps: set.reps,
        };
      });
    })
  );

  // console.log("Fetched full workout from database:", JSON.stringify(fullWorkout, null, 2));

  return fullWorkout;
};

/**
 * Saves a completely new workout routine to the database.
 * @param db The database.
 * @param newRoutine The workout routine we want to save.
 */
export const saveNewRoutine = async (
  db: SQLiteDatabase,
  newRoutine: EditableRoutine
): Promise<void> => {
  const { workout, exercises, sets } = newRoutine;

  // aggregate overall muscles worked for a workout
  let allTags: Set<string> = new Set();
  workout.exerciseIds.forEach((exerciseId) => {
    const exercise = exercises[exerciseId];
    const exerciseTags = splitField(exercise.tags);
    for (const tag of exerciseTags) {
      allTags.add(tag);
    }
  });

  // insert workout
  await db.runAsync(
    `INSERT INTO Workout (_id, name, days, tags) VALUES (?, ?, ?, ?);`,
    workout._id,
    workout.name.trim(),
    joinField(workout.days),
    joinField([...allTags])
  );

  // insert exercises
  workout.exerciseIds.forEach(async (exerciseId) => {
    const exercise = exercises[exerciseId];

    // insert an exercise
    await db.runAsync(
      `INSERT INTO Exercise (_id, workout_id, name, rest, notes, tags) VALUES (?, ?, ?, ?, ?, ?);`,
      exerciseId,
      workout._id,
      exercise.name.trim(),
      parseWhole(exercise.rest),
      exercise.notes,
      exercise.tags
    );

    // insert the sets for this exercise
    exercise.setIds.forEach(async (setId) => {
      const set = sets[setId];

      // insert a set from this exercise
      await db.runAsync(
        `INSERT INTO ExerciseSet (_id, exercise_id, type, weight, reps) VALUES (?, ?, ?, ?, ?);`,
        setId,
        exerciseId,
        set.type,
        set.weight ? parseDecimal(set.weight) : null,
        set.reps ? parseWhole(set.reps) : null
      );
    });
  });

  console.log(
    "Saved new workout into database:",
    JSON.stringify(newRoutine, null, 2)
  );
};

/**
 * Updates a full workout routine in the database; used when finishing a workout.
 * @param db The database.
 * @param routine The workout routine we want to update.
 */
export const updateRoutine = async (
  db: SQLiteDatabase,
  routine: ViewableRoutine
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
  workout: ViewableWorkout
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
  exercise: ViewableExercise
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
  set: ViewableSet
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

/**
 * Generates a unique UUID to identify specific rows in the database.
 * @returns A unique string UUID.
 */
export const generateUUID = (): string => {
  return String(uuid.v4());
};

/**
 * Sets up the master exercise table, which contains a long list of exercises
 * that the user can search from to use in their workouts.
 * @param db The database.
 */
const setupMasterTable = async (db: SQLiteDatabase): Promise<void> => {
  const exerciseData = [
    {
      exercise: "Squats",
      muscles: "Quadriceps, Hamstrings, Glutes, Lower Back",
    },
    {
      exercise: "Deadlifts",
      muscles: "Hamstrings, Glutes, Lower Back, Traps, Forearms",
    },
    { exercise: "Bench Press", muscles: "Chest, Triceps, Shoulders" },
    { exercise: "Shoulder Press", muscles: "Shoulders, Triceps" },
    { exercise: "Overhead Press", muscles: "Shoulders, Triceps" },
    { exercise: "Barbell Rows", muscles: "Back, Biceps, Shoulders" },
    { exercise: "Pull-ups", muscles: "Back, Biceps, Shoulders" },
    { exercise: "Dips", muscles: "Chest, Triceps, Shoulders" },
    { exercise: "Lunges", muscles: "Quadriceps, Hamstrings, Glutes" },
    {
      exercise: "Romanian Deadlifts",
      muscles: "Hamstrings, Glutes, Lower Back",
    },
    {
      exercise: "Power Cleans",
      muscles: "Back, Shoulders, Glutes, Hamstrings, Forearms",
    },
    {
      exercise: "Snatch",
      muscles: "Shoulders, Back, Glutes, Hamstrings, Quads",
    },
    {
      exercise: "Clean and Jerk",
      muscles: "Shoulders, Back, Glutes, Hamstrings, Quads, Traps",
    },
    { exercise: "Leg Press", muscles: "Quadriceps, Hamstrings, Glutes" },
    { exercise: "Calf Raises", muscles: "Calves" },
    { exercise: "Bicep Curls", muscles: "Biceps" },
    { exercise: "Tricep Extensions", muscles: "Triceps" },
    { exercise: "Lat Pulldowns", muscles: "Back, Biceps, Shoulders" },
    { exercise: "Seated Cable Rows", muscles: "Back, Biceps, Shoulders" },
    { exercise: "Glute Bridges", muscles: "Glutes, Hamstrings, Lower Back" },
    { exercise: "Farmer's Walk", muscles: "Forearms, Traps, Shoulders, Core" },
    { exercise: "Front Squats", muscles: "Quadriceps, Glutes, Core" },
    {
      exercise: "Sumo Deadlifts",
      muscles: "Hamstrings, Glutes, Inner Thighs, Lower Back",
    },
    {
      exercise: "Incline Bench Press",
      muscles: "Upper Chest, Shoulders, Triceps",
    },
    { exercise: "Arnold Press", muscles: "Shoulders, Triceps" },
    { exercise: "Bent Over Rows", muscles: "Back, Biceps, Shoulders" },
    { exercise: "Chin-ups", muscles: "Back, Biceps, Shoulders" },
    { exercise: "Skull Crushers", muscles: "Triceps" },
    {
      exercise: "Bulgarian Split Squats",
      muscles: "Quadriceps, Hamstrings, Glutes",
    },
    { exercise: "Hip Thrusts", muscles: "Glutes, Hamstrings" },
    {
      exercise: "Kettlebell Swings",
      muscles: "Glutes, Hamstrings, Lower Back, Core",
    },
    { exercise: "Hammer Curls", muscles: "Biceps, Forearms" },
    { exercise: "Cable Flyes", muscles: "Chest, Shoulders" },
    { exercise: "Hack Squats", muscles: "Quadriceps, Hamstrings, Glutes" },
    {
      exercise: "Box Jumps",
      muscles: "Quadriceps, Glutes, Hamstrings, Calves",
    },
    { exercise: "Lateral Raises", muscles: "Shoulders" },
    { exercise: "Reverse Flyes", muscles: "Back, Shoulders" },
    { exercise: "Good Mornings", muscles: "Hamstrings, Glutes, Lower Back" },
    { exercise: "Plank Rows", muscles: "Back, Core, Biceps, Shoulders" },
    { exercise: "Wall Sits", muscles: "Quadriceps, Glutes" },
    { exercise: "Overhead Tricep Extension", muscles: "Triceps" },
    { exercise: "Preacher Curls", muscles: "Biceps" },
    { exercise: "Leg Extensions", muscles: "Quadriceps" },
    { exercise: "Leg Curls", muscles: "Hamstrings" },
    { exercise: "Step-ups", muscles: "Quadriceps, Hamstrings, Glutes, Calves" },
    { exercise: "Decline Bench Press", muscles: "Chest, Triceps, Shoulders" },
    { exercise: "Cable Pulldowns", muscles: "Back, Biceps" },
    { exercise: "Cable Kickbacks", muscles: "Triceps" },
    { exercise: "Dumbbell Pullover", muscles: "Chest, Lats, Triceps" },
    { exercise: "Standing Calf Raises", muscles: "Calves" },
    {
      exercise: "Bent Over Reverse Flyes",
      muscles: "Rear Deltoids, Upper Back",
    },
    { exercise: "Machine Chest Press", muscles: "Chest, Triceps, Shoulders" },
    {
      exercise: "Smith Machine Squats",
      muscles: "Quadriceps, Hamstrings, Glutes, Lower Back",
    },
    { exercise: "Seated Leg Press", muscles: "Quadriceps, Hamstrings, Glutes" },
    { exercise: "Cable Crunches", muscles: "Abdominals" },
    { exercise: "Russian Twists", muscles: "Obliques, Abdominals" },
    {
      exercise: "Sled Pushes",
      muscles: "Quadriceps, Hamstrings, Glutes, Calves",
    },
    { exercise: "Battle Ropes", muscles: "Shoulders, Core, Arms" },
    {
      exercise: "Box Squats",
      muscles: "Quadriceps, Hamstrings, Glutes, Lower Back",
    },
    {
      exercise: "Zercher Squats",
      muscles: "Quadriceps, Hamstrings, Glutes, Core",
    },
    {
      exercise: "Overhead Squats",
      muscles: "Quadriceps, Hamstrings, Glutes, Shoulders, Core",
    },
    {
      exercise: "Jefferson Deadlifts",
      muscles: "Hamstrings, Glutes, Lower Back, Quads, Forearms",
    },
    { exercise: "T-Bar Rows", muscles: "Back, Biceps, Shoulders" },
    { exercise: "Chest Flyes", muscles: "Chest, Shoulders" },
    { exercise: "Face Pulls", muscles: "Upper Back, Rear Shoulders, Traps" },
    { exercise: "Glute-Ham Raises", muscles: "Hamstrings, Glutes, Lower Back" },
    {
      exercise: "Romanian Split Squats",
      muscles: "Quadriceps, Hamstrings, Glutes",
    },
    { exercise: "Sissy Squats", muscles: "Quadriceps, Hip Flexors" },
    { exercise: "Spider Curls", muscles: "Biceps" },
    { exercise: "Concentration Curls", muscles: "Biceps" },
    { exercise: "Lateral Raises Machine", muscles: "Shoulders" },
    {
      exercise: "Leg Press Machine",
      muscles: "Quadriceps, Hamstrings, Glutes",
    },
    { exercise: "Pec Deck Flyes", muscles: "Chest" },
    { exercise: "Shoulder Press Machine", muscles: "Shoulders, Triceps" },
    {
      exercise: "Smith Machine Deadlifts",
      muscles: "Hamstrings, Glutes, Lower Back, Traps, Forearms",
    },
    {
      exercise: "Smith Machine Bench Press",
      muscles: "Chest, Triceps, Shoulders",
    },
    {
      exercise: "Trap Bar Deadlifts",
      muscles: "Hamstrings, Glutes, Lower Back, Traps, Forearms",
    },
    { exercise: "Upright Rows", muscles: "Shoulders, Traps" },
    { exercise: "Wrist Curls", muscles: "Forearms" },
    {
      exercise: "Incline Dumbbell Press",
      muscles: "Chest, Triceps, Shoulders",
    },
    { exercise: "Seated Military Press", muscles: "Shoulders, Triceps" },
    { exercise: "Dumbbell Rows", muscles: "Back, Biceps, Shoulders" },
    {
      exercise: "Bent Over Rear Delt Raises",
      muscles: "Rear Deltoids, Upper Back",
    },
    { exercise: "Machine Rows", muscles: "Back, Biceps, Shoulders" },
    { exercise: "Calf Press on Leg Press Machine", muscles: "Calves" },
    {
      exercise: "Dumbbell Step-ups",
      muscles: "Quadriceps, Hamstrings, Glutes",
    },
    { exercise: "Landmine Press", muscles: "Shoulders, Triceps, Chest" },
    {
      exercise: "Landmine Squat",
      muscles: "Quadriceps, Hamstrings, Glutes, Lower Back",
    },
    {
      exercise: "One-Arm Dumbbell Bench Press",
      muscles: "Chest, Triceps, Shoulders",
    },
    { exercise: "One-Arm Dumbbell Row", muscles: "Back, Biceps, Shoulders" },
    { exercise: "One-Legged Cable Kickback", muscles: "Glutes, Hamstrings" },
    { exercise: "Cable Woodchopper", muscles: "Obliques, Core, Shoulders" },
    {
      exercise: "Cable Face Pulls",
      muscles: "Rear Deltoids, Traps, Rhomboids",
    },
    { exercise: "Cable Lateral Raises", muscles: "Shoulders" },
    { exercise: "Cable Seated Rows", muscles: "Back, Biceps, Rear Deltoids" },
    { exercise: "Cable Tricep Pushdown", muscles: "Triceps" },
    { exercise: "Cable Wrist Curl", muscles: "Forearms" },
    { exercise: "Barbell Hip Thrusts", muscles: "Glutes, Hamstrings" },
    {
      exercise: "Barbell Turkish Get-ups",
      muscles: "Core, Shoulders, Glutes, Legs",
    },
    {
      exercise: "Bent Over T-Bar Rows",
      muscles: "Back, Biceps, Rear Deltoids",
    },
    { exercise: "Chest Supported Rows", muscles: "Back, Biceps, Shoulders" },
    {
      exercise: "Dumbbell Deadlifts",
      muscles: "Hamstrings, Glutes, Lower Back, Forearms",
    },
    { exercise: "Dumbbell Lunges", muscles: "Quadriceps, Hamstrings, Glutes" },
    { exercise: "Dumbbell Skull Crushers", muscles: "Triceps" },
    {
      exercise: "Dumbbell Snatch",
      muscles: "Shoulders, Traps, Glutes, Hamstrings, Back",
    },
    {
      exercise: "Dumbbell Squeeze Press",
      muscles: "Chest, Triceps, Shoulders",
    },
    {
      exercise: "Dumbbell Stiff Leg Deadlifts",
      muscles: "Hamstrings, Glutes, Lower Back",
    },
    {
      exercise: "Dumbbell Thrusters",
      muscles: "Shoulders, Quadriceps, Glutes, Triceps",
    },
    { exercise: "Dumbbell Tricep Kickbacks", muscles: "Triceps" },
    {
      exercise: "Farmer's Walk with Dumbbells",
      muscles: "Forearms, Traps, Shoulders, Core",
    },
    { exercise: "Front Dumbbell Raises", muscles: "Front Deltoids, Shoulders" },
    {
      exercise: "Goblet Squats",
      muscles: "Quadriceps, Hamstrings, Glutes, Core",
    },
    { exercise: "Hanging Leg Raises", muscles: "Abdominals, Hip Flexors" },
    { exercise: "Incline Dumbbell Curl", muscles: "Biceps, Forearms" },
    { exercise: "Incline Dumbbell Flyes", muscles: "Chest, Shoulders" },
    { exercise: "Inverted Rows", muscles: "Back, Biceps, Shoulders" },
    {
      exercise: "Kettlebell Clean and Press",
      muscles: "Shoulders, Traps, Back, Legs, Core",
    },
    { exercise: "Kettlebell Figure 8", muscles: "Core, Legs, Back" },
    {
      exercise: "Kettlebell High Pull",
      muscles: "Shoulders, Traps, Back, Legs",
    },
    { exercise: "Kettlebell Press", muscles: "Shoulders, Triceps, Core" },
    { exercise: "Kettlebell Renegade Rows", muscles: "Back, Biceps, Core" },
    { exercise: "Kettlebell Russian Twist", muscles: "Obliques, Core" },
    { exercise: "Kettlebell Side Bends", muscles: "Obliques, Core" },
    {
      exercise: "Kettlebell Snatch",
      muscles: "Shoulders, Back, Glutes, Hamstrings",
    },
    {
      exercise: "Kettlebell Swing",
      muscles: "Glutes, Hamstrings, Lower Back, Core",
    },
    {
      exercise: "Kettlebell Windmill",
      muscles: "Shoulders, Core, Obliques, Hamstrings",
    },
    { exercise: "Landmine Rows", muscles: "Back, Biceps, Shoulders" },
    {
      exercise: "Lateral Box Jumps",
      muscles: "Quads, Hamstrings, Glutes, Calves",
    },
    {
      exercise: "Lateral Lunges",
      muscles: "Quadriceps, Hamstrings, Glutes, Adductors",
    },
    { exercise: "Leg Abduction Machine", muscles: "Hip Abductors, Glutes" },
    { exercise: "Leg Curl Machine", muscles: "Hamstrings" },
    { exercise: "Lever Overhead Press", muscles: "Shoulders, Triceps" },
    { exercise: "Machine Bicep Curl", muscles: "Biceps" },
    { exercise: "Machine Calf Raise", muscles: "Calves" },
    { exercise: "Machine Shoulder Press", muscles: "Shoulders, Triceps" },
    { exercise: "Machine Tricep Dip", muscles: "Triceps, Chest, Shoulders" },
    {
      exercise: "Medicine Ball Chest Pass",
      muscles: "Chest, Triceps, Shoulders",
    },
    { exercise: "Medicine Ball Slam", muscles: "Shoulders, Core, Hamstrings" },
  ];

  for (const e of exerciseData) {
    await db.runAsync(
      `INSERT INTO MasterExercise (_id, name, muscles) VALUES (?, ?, ?);`,
      generateUUID(),
      e.exercise,
      e.muscles
    );
  }

  console.log("Inserted master table into database");
};

/**
 * Sets up a dummy workout to test this application ourselves.
 * Used on database startup.
 * @param db The database.
 */
const setupDummyData = async (db: SQLiteDatabase): Promise<void> => {
  const workoutId: string = generateUUID();
  const masterIdChest: string = (await db.getFirstAsync(
    `SELECT _id FROM MasterExercise WHERE name = ?`,
    "Machine Chest Press"
  ))!;
  const masterIdShoulders: string = (await db.getFirstAsync(
    `SELECT _id FROM MasterExercise WHERE name = ?`,
    "Overhead Press"
  ))!;
  const exerciseIds: string[] = [generateUUID(), generateUUID()] as string[];
  const setIds: string[] = [
    generateUUID(),
    generateUUID(),
    generateUUID(),
    generateUUID(),
    generateUUID(),
    generateUUID(),
  ] as string[];

  const dummyWorkout: EditableRoutine = {
    workout: {
      _id: workoutId,
      name: "My Personal Workout",
      days: ["Monday", "Thursday"],
      exerciseIds: [exerciseIds[0], exerciseIds[1]],
    },
    exercises: {
      [exerciseIds[0]]: {
        _id: exerciseIds[0],
        master_id: masterIdChest,
        name: "Machine Chest Press",
        rest: "90",
        notes: "Seat level 8, Thumbs on tips of handles",
        tags: "Chest, Triceps, Shoulders",
        setIds: [setIds[0], setIds[1], setIds[2]],
      },
      [exerciseIds[1]]: {
        _id: exerciseIds[1],
        master_id: masterIdShoulders,
        name: "Overhead Press",
        rest: "60",
        notes:
          "Seat level 4, Keep back flat on seat, Move down until elbows are 90 degrees",
        tags: "Shoulders, Triceps",
        setIds: [setIds[3], setIds[4], setIds[5]],
      },
    },
    sets: {
      [setIds[0]]: {
        _id: setIds[0],
        type: "Warm-up",
        weight: "90",
        reps: "15",
      },
      [setIds[1]]: {
        _id: setIds[1],
        type: "Standard",
        weight: null,
        reps: "10",
      },
      [setIds[2]]: {
        _id: setIds[2],
        type: "Failure",
        weight: "135",
        reps: "10",
      },
      [setIds[3]]: {
        _id: setIds[3],
        type: "Warm-up",
        weight: "90",
        reps: "10",
      },
      [setIds[4]]: {
        _id: setIds[4],
        type: "Standard",
        weight: "110",
        reps: "8",
      },
      [setIds[5]]: {
        _id: setIds[5],
        type: "Drop",
        weight: "110",
        reps: "14",
      },
    },
  };

  await saveNewRoutine(db, dummyWorkout);
};
