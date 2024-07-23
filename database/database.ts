import { SQLiteDatabase } from "expo-sqlite";

interface LastInsertRowIdResult {
  'last_insert_rowid()': number;
}

async function getLastInsertRowId(db: SQLiteDatabase): Promise<number> {
  const result: LastInsertRowIdResult | null = await db.getFirstAsync('SELECT last_insert_rowid();');

  if (result === null) {
    throw new Error("Could not fetch last insert row ID.");
  }

  return result['last_insert_rowid()'];
}

export const setupDatabase = async (db: SQLiteDatabase) => {  
  // reset db
  await db.execAsync(`
    DROP TABLE IF EXISTS Workout;
    DROP TABLE IF EXISTS Exercise;
    DROP TABLE IF EXISTS ExerciseSet;
  `);

  // create tables
  await db.execAsync(`
    CREATE TABLE
      IF NOT EXISTS Workout (
        _id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        days TEXT,
        tags TEXT
      );
  
    CREATE TABLE
      IF NOT EXISTS Exercise (
        _id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        rest INTEGER,
        notes TEXT,
        FOREIGN KEY (workout_id) REFERENCES Workouts (_id) ON DELETE CASCADE
      );
  
    CREATE TABLE
      IF NOT EXISTS ExerciseSet (
        _id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_id INTEGER NOT NULL,
        type TEXT CHECK (
          type IN ('Standard', 'Warm-up', 'Drop', 'Failure')
        ),
        weight REAL,
        reps INTEGER,
        FOREIGN KEY (exercise_id) REFERENCES Exercises (_id) ON DELETE CASCADE
      );
  `);

  // insert dummy data
  await db.execAsync(`
    INSERT INTO
      Workout (name, days, tags)
    VALUES
      (
        'Push Day',
        'Monday, Thursday',
        'Chest, Shoulders, Triceps, Delts'
      );
    
    INSERT INTO
      Workout (name, days, tags)
    VALUES
      (
        'Pull Day',
        'Tuesday, Friday',
        'Back, Traps, Lats, Biceps'
      );

    INSERT INTO
      Workout (name, days, tags)
    VALUES
      (
        'Leg Day',
        'Wednesday, Saturday',
        'Quads, Hamstrings, Calves, Glutes'
      );
    
    INSERT INTO
      Workout (name, days, tags)
    VALUES
      (
        'Full Body Workout',
        'Monday, Thursday',
        'Chest, Shoulders, Triceps, Delts, Back, Biceps, Quads, Hamstrings, Calves, Glutes'
      );
  `);

  const workoutId = await getLastInsertRowId(db);
  await db.execAsync(`
    INSERT INTO
      Exercise (workout_id, name, rest, notes)
    VALUES
      (
        ${workoutId},
        'Chest Press Machine',
        90,
        'Seat Level: 8'
      );  
  `);

  const exerciseId = await getLastInsertRowId(db);
  await db.execAsync(`
    INSERT INTO
      ExerciseSet (exercise_id, type, weight, reps)
    VALUES
      (
        ${exerciseId},
        'Warm-up',
        140,
        10
      );  
  `);
  
  console.log("Database Started");
}