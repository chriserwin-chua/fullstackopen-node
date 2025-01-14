interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateResult = (
  target: number,
  exerciseLogs: number[]
): ExerciseResult => {
  const daysTrained = exerciseLogs.filter((log) => log > 0);
  const avgTraining =
    exerciseLogs.reduce((prev, curr) => prev + curr, 0) / exerciseLogs.length;
  let isSuccess: boolean = false;
  let rating: number = 1;
  if (avgTraining > target) {
    isSuccess = true;
    rating = 3;
  } else if (avgTraining + 1 > target) {
    rating = 2;
  } else {
    rating = 1;
  }
  let ratingDescription: string = 'good';
  if (rating == 2) {
    ratingDescription = 'not too bad but could be better';
  } else if (rating == 1) {
    ratingDescription = 'quite bad, needs to exercise more';
  }
  return {
    periodLength: exerciseLogs.length,
    trainingDays: daysTrained.length,
    success: isSuccess,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: avgTraining,
  };
};

// interface CalculateProps {
//   targetValue: number;
//   exerciseLogs: number[];
// }

// const parseArguments = (args: string[]): CalculateProps => {
//   let targetValue: number = 0;
//   if (!isNaN(Number(args[2]))) {
//     targetValue = Number(args[2]);
//   } else {
//     throw new Error('Only input valid numbers.');
//   }

//   const exerciseLogs: number[] = [];

//   for (let i = 3; args.length > i; i++) {
//     if (!isNaN(Number(args[i]))) {
//       exerciseLogs.push(Number(args[i]));
//     } else {
//       throw new Error('Only input valid numbers.');
//     }
//   }
//   return {
//     targetValue: targetValue,
//     exerciseLogs: exerciseLogs,
//   };
// };

// try {
//   const { targetValue, exerciseLogs } = parseArguments(process.argv);
//   console.log(calculateResult(targetValue, exerciseLogs));
// } catch (error: unknown) {
//   let errorMessage = 'Something bad happened.';
//   if (error instanceof Error) {
//     errorMessage += ' Error: ' + error.message;
//   }
//   console.log(errorMessage);
// }
