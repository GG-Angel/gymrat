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

INSERT INTO
  Workout (id, name, days, tags)
VALUES
  (
    123,
    'Push Day',
    'Monday, Wednesday',
    'Chest, Shoulders, Triceps'
  );

INSERT INTO
  Exercise (id, workout_id, name, rest, notes)
VALUES
  (
    456,
    123,
    'Chest Press Machine',
    90,
    'Seat position: 8'
  );

INSERT INTO
  ExerciseSet (id, exercise_id, type, weight, reps)
VALUES
  (1, 456, 'Warm-up', 140, 10);

INSERT INTO
  ExerciseSet (id, exercise_id, type, weight, reps)
VALUES
  (2, 456, 'Standard', 180, 8);

INSERT INTO
  ExerciseSet (id, exercise_id, type, weight, reps)
VALUES
  (3, 456, 'Failure', 90, 15);