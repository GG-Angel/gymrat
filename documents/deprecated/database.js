import * as SQLite from 'expo-sqlite';

const dataDB = await SQLite.openDatabaseAsync("gymrat-data.db");
// const statsDB = SQLITE.openDatabaseAsync("gymrat-stats.db");

const createDataTables = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS Workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      days_worked TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS MasterExercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      form_image BLOB
    );

    CREATE TABLE IF NOT EXISTS Exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      master_exercise_id INTEGER,
      title TEXT NOT NULL,
      rest_time INTEGER,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS Sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('Standard', 'Warm-Up', 'Drop', 'Failure')),
      weight REAL NOT NULL,
      reps INTEGER NOT NULL,
      FOREIGN KEY(exercise_id) REFERENCES Exercises(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS WorkoutExercises (
      workout_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      is_linked BOOLEAN NOT NULL DEFAULT 1,
      FOREIGN KEY(workout_id) REFERENCES Workouts(id) ON DELETE CASCADE,
      FOREIGN KEY(exercise_id) REFERENCES Exercises(id) ON DELETE CASCADE,
      PRIMARY KEY (workout_id, exercise_id)
    );
  `
  try {
    await dataDB.execAsync(sql);
    console.log("Data tables created successfully!");
  } catch (error) {
    console.log("Error creating data tables:", error);
  }
}

const setupDatabase = async () => {
  await createDataTables();
  console.log("Database setup successfully!")
}

export { setupDatabase, dataDB };