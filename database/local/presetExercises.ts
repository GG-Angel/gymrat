interface PresetExercise {
  name: string;
  musclesWorked: string[];
}

export const PresetExercises: PresetExercise[] = [
  {
    name: "Squats",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Lower Back"],
  },
  {
    name: "Deadlifts",
    musclesWorked: ["Hamstrings", "Glutes", "Lower Back", "Traps", "Forearms"],
  },
  { name: "Bench Press", musclesWorked: ["Chest", "Triceps", "Shoulders"] },
  { name: "Shoulder Press", musclesWorked: ["Shoulders", "Triceps"] },
  { name: "Overhead Press", musclesWorked: ["Shoulders", "Triceps"] },
  { name: "Barbell Rows", musclesWorked: ["Back", "Biceps", "Shoulders"] },
  { name: "Pull-ups", musclesWorked: ["Back", "Biceps", "Shoulders"] },
  { name: "Dips", musclesWorked: ["Chest", "Triceps", "Shoulders"] },
  { name: "Lunges", musclesWorked: ["Quadriceps", "Hamstrings", "Glutes"] },
  {
    name: "Romanian Deadlifts",
    musclesWorked: ["Hamstrings", "Glutes", "Lower Back"],
  },
  {
    name: "Power Cleans",
    musclesWorked: ["Back", "Shoulders", "Glutes", "Hamstrings", "Forearms"],
  },
  {
    name: "Snatch",
    musclesWorked: ["Shoulders", "Back", "Glutes", "Hamstrings", "Quads"],
  },
  {
    name: "Clean and Jerk",
    musclesWorked: [
      "Shoulders",
      "Back",
      "Glutes",
      "Hamstrings",
      "Quads",
      "Traps",
    ],
  },
  { name: "Leg Press", musclesWorked: ["Quadriceps", "Hamstrings", "Glutes"] },
  { name: "Calf Raises", musclesWorked: ["Calves"] },
  { name: "Bicep Curls", musclesWorked: ["Biceps"] },
  { name: "Tricep Extensions", musclesWorked: ["Triceps"] },
  { name: "Lat Pulldowns", musclesWorked: ["Back", "Biceps", "Shoulders"] },
  { name: "Seated Cable Rows", musclesWorked: ["Back", "Biceps", "Shoulders"] },
  {
    name: "Glute Bridges",
    musclesWorked: ["Glutes", "Hamstrings", "Lower Back"],
  },
  {
    name: "Farmer's Walk",
    musclesWorked: ["Forearms", "Traps", "Shoulders", "Core"],
  },
  { name: "Front Squats", musclesWorked: ["Quadriceps", "Glutes", "Core"] },
  {
    name: "Sumo Deadlifts",
    musclesWorked: ["Hamstrings", "Glutes", "Inner Thighs", "Lower Back"],
  },
  {
    name: "Incline Bench Press",
    musclesWorked: ["Upper Chest", "Shoulders", "Triceps"],
  },
  { name: "Arnold Press", musclesWorked: ["Shoulders", "Triceps"] },
  { name: "Bent Over Rows", musclesWorked: ["Back", "Biceps", "Shoulders"] },
  { name: "Chin-ups", musclesWorked: ["Back", "Biceps", "Shoulders"] },
  { name: "Skull Crushers", musclesWorked: ["Triceps"] },
  {
    name: "Bulgarian Split Squats",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes"],
  },
  { name: "Hip Thrusts", musclesWorked: ["Glutes", "Hamstrings"] },
  {
    name: "Kettlebell Swings",
    musclesWorked: ["Glutes", "Hamstrings", "Lower Back", "Core"],
  },
  { name: "Hammer Curls", musclesWorked: ["Biceps", "Forearms"] },
  { name: "Cable Flyes", musclesWorked: ["Chest", "Shoulders"] },
  {
    name: "Hack Squats",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes"],
  },
  {
    name: "Box Jumps",
    musclesWorked: ["Quadriceps", "Glutes", "Hamstrings", "Calves"],
  },
  { name: "Lateral Raises", musclesWorked: ["Shoulders"] },
  { name: "Reverse Flyes", musclesWorked: ["Back", "Shoulders"] },
  {
    name: "Good Mornings",
    musclesWorked: ["Hamstrings", "Glutes", "Lower Back"],
  },
  {
    name: "Plank Rows",
    musclesWorked: ["Back", "Core", "Biceps", "Shoulders"],
  },
  { name: "Wall Sits", musclesWorked: ["Quadriceps", "Glutes"] },
  { name: "Overhead Tricep Extension", musclesWorked: ["Triceps"] },
  { name: "Preacher Curls", musclesWorked: ["Biceps"] },
  { name: "Leg Extensions", musclesWorked: ["Quadriceps"] },
  { name: "Leg Curls", musclesWorked: ["Hamstrings"] },
  {
    name: "Step-ups",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
  },
  {
    name: "Decline Bench Press",
    musclesWorked: ["Chest", "Triceps", "Shoulders"],
  },
  { name: "Cable Pulldowns", musclesWorked: ["Back", "Biceps"] },
  { name: "Cable Kickbacks", musclesWorked: ["Triceps"] },
  { name: "Dumbbell Pullover", musclesWorked: ["Chest", "Lats", "Triceps"] },
  { name: "Standing Calf Raises", musclesWorked: ["Calves"] },
  {
    name: "Bent Over Reverse Flyes",
    musclesWorked: ["Rear Deltoids", "Upper Back"],
  },
  {
    name: "Machine Chest Press",
    musclesWorked: ["Chest", "Triceps", "Shoulders"],
  },
  {
    name: "Smith Machine Squats",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Lower Back"],
  },
  {
    name: "Seated Leg Press",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes"],
  },
  { name: "Cable Crunches", musclesWorked: ["Abdominals"] },
  { name: "Russian Twists", musclesWorked: ["Obliques", "Abdominals"] },
  {
    name: "Sled Pushes",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
  },
  { name: "Battle Ropes", musclesWorked: ["Shoulders", "Core", "Arms"] },
  {
    name: "Box Squats",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Lower Back"],
  },
  {
    name: "Zercher Squats",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Core"],
  },
  {
    name: "Overhead Squats",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Shoulders", "Core"],
  },
  {
    name: "Jefferson Deadlifts",
    musclesWorked: ["Hamstrings", "Glutes", "Lower Back", "Quads", "Forearms"],
  },
  { name: "T-Bar Rows", musclesWorked: ["Back", "Biceps", "Shoulders"] },
  { name: "Chest Flyes", musclesWorked: ["Chest", "Shoulders"] },
  {
    name: "Face Pulls",
    musclesWorked: ["Upper Back", "Rear Shoulders", "Traps"],
  },
  {
    name: "Glute-Ham Raises",
    musclesWorked: ["Hamstrings", "Glutes", "Lower Back"],
  },
  {
    name: "Romanian Split Squats",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes"],
  },
  { name: "Sissy Squats", musclesWorked: ["Quadriceps", "Hip Flexors"] },
  { name: "Spider Curls", musclesWorked: ["Biceps"] },
  { name: "Concentration Curls", musclesWorked: ["Biceps"] },
  { name: "Lateral Raises Machine", musclesWorked: ["Shoulders"] },
  {
    name: "Leg Press Machine",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes"],
  },
  { name: "Pec Deck Flyes", musclesWorked: ["Chest"] },
  { name: "Shoulder Press Machine", musclesWorked: ["Shoulders", "Triceps"] },
  {
    name: "Smith Machine Deadlifts",
    musclesWorked: ["Hamstrings", "Glutes", "Lower Back", "Traps", "Forearms"],
  },
  {
    name: "Smith Machine Bench Press",
    musclesWorked: ["Chest", "Triceps", "Shoulders"],
  },
  {
    name: "Trap Bar Deadlifts",
    musclesWorked: ["Hamstrings", "Glutes", "Lower Back", "Traps", "Forearms"],
  },
  { name: "Upright Rows", musclesWorked: ["Shoulders", "Traps"] },
  { name: "Wrist Curls", musclesWorked: ["Forearms"] },
  {
    name: "Incline Dumbbell Press",
    musclesWorked: ["Chest", "Triceps", "Shoulders"],
  },
  { name: "Seated Military Press", musclesWorked: ["Shoulders", "Triceps"] },
  { name: "Dumbbell Rows", musclesWorked: ["Back", "Biceps", "Shoulders"] },
  {
    name: "Bent Over Rear Delt Raises",
    musclesWorked: ["Rear Deltoids", "Upper Back"],
  },
  { name: "Machine Rows", musclesWorked: ["Back", "Biceps", "Shoulders"] },
  { name: "Calf Press on Leg Press Machine", musclesWorked: ["Calves"] },
  {
    name: "Dumbbell Step-ups",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes"],
  },
  { name: "Landmine Press", musclesWorked: ["Shoulders", "Triceps", "Chest"] },
  {
    name: "Landmine Squat",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Lower Back"],
  },
  {
    name: "One-Arm Dumbbell Bench Press",
    musclesWorked: ["Chest", "Triceps", "Shoulders"],
  },
  {
    name: "One-Arm Dumbbell Row",
    musclesWorked: ["Back", "Biceps", "Shoulders"],
  },
  {
    name: "One-Legged Cable Kickback",
    musclesWorked: ["Glutes", "Hamstrings"],
  },
  {
    name: "Cable Woodchopper",
    musclesWorked: ["Obliques", "Core", "Shoulders"],
  },
  {
    name: "Cable Face Pulls",
    musclesWorked: ["Rear Deltoids", "Traps", "Rhomboids"],
  },
  { name: "Cable Lateral Raises", musclesWorked: ["Shoulders"] },
  {
    name: "Cable Seated Rows",
    musclesWorked: ["Back", "Biceps", "Rear Deltoids"],
  },
  { name: "Cable Tricep Pushdown", musclesWorked: ["Triceps"] },
  { name: "Cable Wrist Curl", musclesWorked: ["Forearms"] },
  { name: "Barbell Hip Thrusts", musclesWorked: ["Glutes", "Hamstrings"] },
  {
    name: "Barbell Turkish Get-ups",
    musclesWorked: ["Core", "Shoulders", "Glutes", "Legs"],
  },
  {
    name: "Bent Over T-Bar Rows",
    musclesWorked: ["Back", "Biceps", "Rear Deltoids"],
  },
  {
    name: "Chest Supported Rows",
    musclesWorked: ["Back", "Biceps", "Shoulders"],
  },
  {
    name: "Dumbbell Deadlifts",
    musclesWorked: ["Hamstrings", "Glutes", "Lower Back", "Forearms"],
  },
  {
    name: "Dumbbell Lunges",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes"],
  },
  { name: "Dumbbell Skull Crushers", musclesWorked: ["Triceps"] },
  {
    name: "Dumbbell Snatch",
    musclesWorked: ["Shoulders", "Traps", "Glutes", "Hamstrings", "Back"],
  },
  {
    name: "Dumbbell Squeeze Press",
    musclesWorked: ["Chest", "Triceps", "Shoulders"],
  },
  {
    name: "Dumbbell Stiff Leg Deadlifts",
    musclesWorked: ["Hamstrings", "Glutes", "Lower Back"],
  },
  {
    name: "Dumbbell Thrusters",
    musclesWorked: ["Shoulders", "Quadriceps", "Glutes", "Triceps"],
  },
  { name: "Dumbbell Tricep Kickbacks", musclesWorked: ["Triceps"] },
  {
    name: "Farmer's Walk with Dumbbells",
    musclesWorked: ["Forearms", "Traps", "Shoulders", "Core"],
  },
  {
    name: "Front Dumbbell Raises",
    musclesWorked: ["Front Deltoids", "Shoulders"],
  },
  {
    name: "Goblet Squats",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Core"],
  },
  { name: "Hanging Leg Raises", musclesWorked: ["Abdominals", "Hip Flexors"] },
  { name: "Incline Dumbbell Curl", musclesWorked: ["Biceps", "Forearms"] },
  { name: "Incline Dumbbell Flyes", musclesWorked: ["Chest", "Shoulders"] },
  { name: "Inverted Rows", musclesWorked: ["Back", "Biceps", "Shoulders"] },
  {
    name: "Kettlebell Clean and Press",
    musclesWorked: ["Shoulders", "Traps", "Back", "Legs", "Core"],
  },
  { name: "Kettlebell Figure 8", musclesWorked: ["Core", "Legs", "Back"] },
  {
    name: "Kettlebell High Pull",
    musclesWorked: ["Shoulders", "Traps", "Back", "Legs"],
  },
  { name: "Kettlebell Press", musclesWorked: ["Shoulders", "Triceps", "Core"] },
  {
    name: "Kettlebell Renegade Rows",
    musclesWorked: ["Back", "Biceps", "Core"],
  },
  { name: "Kettlebell Russian Twist", musclesWorked: ["Obliques", "Core"] },
  { name: "Kettlebell Side Bends", musclesWorked: ["Obliques", "Core"] },
  {
    name: "Kettlebell Snatch",
    musclesWorked: ["Shoulders", "Back", "Glutes", "Hamstrings"],
  },
  {
    name: "Kettlebell Swing",
    musclesWorked: ["Glutes", "Hamstrings", "Lower Back", "Core"],
  },
  {
    name: "Kettlebell Windmill",
    musclesWorked: ["Shoulders", "Core", "Obliques", "Hamstrings"],
  },
  { name: "Landmine Rows", musclesWorked: ["Back", "Biceps", "Shoulders"] },
  {
    name: "Lateral Box Jumps",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Calves"],
  },
  {
    name: "Lateral Lunges",
    musclesWorked: ["Quadriceps", "Hamstrings", "Glutes", "Adductors"],
  },
  { name: "Leg Abduction Machine", musclesWorked: ["Hip Abductors", "Glutes"] },
  { name: "Leg Curl Machine", musclesWorked: ["Hamstrings"] },
  { name: "Lever Overhead Press", musclesWorked: ["Shoulders", "Triceps"] },
  { name: "Machine Bicep Curl", musclesWorked: ["Biceps"] },
  { name: "Machine Calf Raise", musclesWorked: ["Calves"] },
  { name: "Machine Shoulder Press", musclesWorked: ["Shoulders", "Triceps"] },
  {
    name: "Machine Tricep Dip",
    musclesWorked: ["Triceps", "Chest", "Shoulders"],
  },
  {
    name: "Medicine Ball Chest Pass",
    musclesWorked: ["Chest", "Triceps", "Shoulders"],
  },
  {
    name: "Medicine Ball Slam",
    musclesWorked: ["Shoulders", "Core", "Hamstrings"],
  },
];
