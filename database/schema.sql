CREATE TABLE
  IF NOT EXISTS Workout (
    _id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    days TEXT,
    tags TEXT
  );

CREATE TABLE
  IF NOT EXISTS Exercise (
    _id TEXT PRIMARY KEY,
    workout_id TEXT NOT NULL,
    name TEXT NOT NULL,
    rest INTEGER,
    notes TEXT,
    FOREIGN KEY (workout_id) REFERENCES Workouts (_id) ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS ExerciseSet (
    _id TEXT PRIMARY KEY,
    exercise_id TEXT NOT NULL,
    type TEXT CHECK (
      type IN ('Standard', 'Warm-up', 'Drop', 'Failure')
    ),
    weight REAL,
    reps INTEGER,
    FOREIGN KEY (exercise_id) REFERENCES Exercises (_id) ON DELETE CASCADE
  );

CREATE TABLE 
  IF NOT EXISTS MasterExercise (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);