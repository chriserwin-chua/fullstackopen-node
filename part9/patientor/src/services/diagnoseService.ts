import diagnosesData from '../../data/diagnosis';

import { Diagnosis } from '../types';

const diagnosis: Diagnosis[] = diagnosesData as Diagnosis[];

const getDiagnosis = (): Diagnosis[] => {
  return diagnosis;
};

const addDiagnose = () => {
  return null;
};

export default {
  getDiagnosis,
  addDiagnose,
};
