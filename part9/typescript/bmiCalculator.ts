export const bmiCalculator = (height: number, weight: number) => {
  const bmiValue = (weight / height / height) * 10000;

  if (bmiValue < 16) {
    return 'Severe Thinness';
  }
  if (bmiValue > 16 && bmiValue < 17) {
    return 'Moderate Thinness';
  }
  if (bmiValue > 17 && bmiValue < 18.5) {
    return 'Mild Thinness';
  }
  if (bmiValue > 18.5 && bmiValue < 25) {
    return 'Normal Range';
  }
  if (bmiValue > 25 && bmiValue < 30) {
    return 'Overweight';
  }
  if (bmiValue > 30 && bmiValue < 35) {
    return 'Obese Class I';
  }
  if (bmiValue > 35 && bmiValue < 40) {
    return 'Obese Class II';
  }
  if (bmiValue > 40) {
    return 'Obese Class III';
  }

  return 'Invalid BMI Value';
  // Severe Thinness	< 16
  // Moderate Thinness	16 - 17
  // Mild Thinness	17 - 18.5
  // Normal	18.5 - 25
  // Overweight	25 - 30
  // Obese Class I	30 - 35
  // Obese Class II	35 - 40
  // Obese Class III	> 40
  // BMI chart for adults

  // if (bmiValue > 18.5 && bmiValue < 24.9) {
  //   return 'Normal Range';
  // }
};

// const height: number = Number(process.argv[2]);
// const weight: number = Number(process.argv[3]);
// console.log(bmiCalculator(height, weight));
