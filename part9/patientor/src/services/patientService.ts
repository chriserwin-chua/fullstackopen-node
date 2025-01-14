import patientData from '../../data/patients';
import { Entry, NewPatientEntry, Patient } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientData;

const getPatients = (): Patient[] => {
  return patients;
};

const getPatient = (id: string) => {
  return patients.find((patient) => patient.id == id);
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const id = uuid();
  const newPatient = {
    id: id,
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const addPatientEntry = (id: string, entry: Entry): Entry[] => {
  const newId = uuid();
  const patientIndex = patients.findIndex((patient) => patient.id === id);
  const patientEntries = patients[patientIndex].entries ?? [];
  patients[patientIndex] = {
    ...patients[patientIndex],
    entries: [...patientEntries, { ...entry, id: newId }],
  };

  return patients[patientIndex].entries ?? [];
};

export default {
  getPatients,
  getPatient,
  addPatient,
  addPatientEntry,
};
