CREATE TABLE
  IF NOT EXISTS Workout (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    days TEXT,
    tags TEXT
  );

CREATE TABLE
  IF NOT EXISTS Exercise (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    rest INTEGER,
    notes TEXT,
    FOREIGN KEY (workout_id) REFERENCES Workouts (id) ON DELETE CASCADE
  );

CREATE TABLE
  IF NOT EXISTS ExerciseSet (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL,
    type TEXT CHECK (
      type IN ('Standard', 'Warm-up', 'Drop', 'Failure')
    ),
    weight REAL,
    reps INTEGER,
    FOREIGN KEY (exercise_id) REFERENCES Exercises (id) ON DELETE CASCADE
  );