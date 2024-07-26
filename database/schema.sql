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