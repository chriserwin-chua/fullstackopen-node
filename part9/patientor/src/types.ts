import { z } from 'zod';
import { NewEntrySchema, NewPatientSchema } from './utils';
export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Diagnosis['code'][];
}
export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}

export enum EntryType {
  HealthCheck = 'HealthCheck',
  OccupationalHealthcare = 'OccupationalHealthcare',
  Hospital = 'Hospital',
}
export interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating: HealthCheckRating;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  employerName?: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export interface HospitalEntry extends BaseEntry {
  type: 'Hospital';
  discharge: {
    date: string;
    criteria: string;
  };
}

// export interface Entry {
//   id: string;
//   date: string;
//   type: string;
//   specialist: string;
//   employerName?: string;
//   diagnosisCodes?: string[];
//   description: string;
//   sickLeave?: {
//     startDate: string;
//     endDate: string;
//   };
//   healthCheckRating?: number;
//   discharge?: {
//     date: string;
//     criteria: string;
//   };
// }

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: Gender;
  occupation: string;
  ssn: string;
  entries?: Entry[];
}
//export type NewPatientEntry = Omit<Patient, 'id'>;

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export type NewPatientEntry = z.infer<typeof NewPatientSchema>;
export type NewEntry = z.infer<typeof NewEntrySchema>;
