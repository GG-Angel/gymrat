export type Routine = {
  workout: Workout;
  exercises: { 
    [exerciseId: string]: Exercise 
  };
  sets: { 
    [setId: string]: ExerciseSet 
  };
};

export type Workout = {
  _id: string;
  exerciseIds: string[];
  name: string;
  days: string[];
  tags: string[];
};

export type MasterExercise = {
  _id: string;
  name: string;
  muscles: string[];
};

export type Exercise = {
  _id: string;
  workout_id: string;
  master_id: string | null;
  setIds: string[];
  name: string;
  rest: number;
  notes: string;
  tags: string[];
};

export type ExerciseSet = {
  _id: string;
  exercise_id: string;
  type: SetType;
  weight: number | null;
  reps: number | null;
};

export type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type MonthOfYear =   
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December"

export type SetType = "Standard" | "Warm-up" | "Drop" | "Failure";