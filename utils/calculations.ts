import { parseDecimal, parseWhole } from "./format";

const PERCENTAGE_OF_1RM = [
  0, 1.0, 0.97, 0.94, 0.92, 0.89, 0.86, 0.83, 0.81, 0.78, 0.75, 0.73, 0.71, 0.7,
  0.68, 0.67, 0.65, 0.64, 0.63, 0.61, 0.6, 0.59, 0.58, 0.57, 0.56, 0.55, 0.54,
  0.53, 0.52, 0.51, 0.5,
];

function calculateOneRepMax(weight: number, reps: number): number {
  if (weight < 0 || reps < 0) {
    throw new Error(
      "Weight or reps cannot be below zero when calculating one rep max."
    );
  }

  const percentageOfOneRepMax =
    reps > 30 ? PERCENTAGE_OF_1RM[30] : PERCENTAGE_OF_1RM[reps];
  return weight / percentageOfOneRepMax;
}

export function calculateWeightPotential(
  weight: number,
  reps: number
): {
  percentage: number;
  weight: number;
  reps: number;
}[] {
  if (weight < 0 || reps < 0) {
    throw new Error(
      "Weight or reps cannot be below zero when calculating weight potential."
    );
  }
  
  const oneRepMax = calculateOneRepMax(weight, reps);
  const repsToShow = [1, 2, 4, 6, 8, 10, 12, 16, 20, 25, 30];
  const weightPotentialSheet: {
    percentage: number;
    weight: number;
    reps: number;
  }[] = [];

  repsToShow.forEach((reps) => {
    weightPotentialSheet.push({
      percentage: parseWhole(PERCENTAGE_OF_1RM[reps] * 100),
      weight: parseWhole(oneRepMax * PERCENTAGE_OF_1RM[reps]),
      reps: reps,
    });
  });
  
  return weightPotentialSheet;
}
