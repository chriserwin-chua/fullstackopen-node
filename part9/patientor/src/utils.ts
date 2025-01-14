import { NewPatientEntry, Gender, EntryType, HealthCheckRating } from './types';

// const isString = (text: unknown): text is string => {
//   return typeof text === 'string' || text instanceof String;
// };

// const parseString = (string: unknown): string => {
//   if (!isString(string)) {
//     throw new Error('Incorrect string');
//   }

//   return string;
// };

// const isDate = (date: string): boolean => {
//   return Boolean(Date.parse(date));
// };

// const parseDate = (date: unknown): string => {
//   if (!isString(date) || !isDate(date)) {
//     throw new Error('Incorrect date: ' + date);
//   }
//   return date;
// };

// const isValidGender = (param: string): param is Gender => {
//   return Object.values(Gender)
//     .map((v) => v.toString())
//     .includes(param);
// };

// const parseGender = (gender: unknown): Gender => {
//   if (!isString(gender) || !isValidGender(gender)) {
//     throw new Error('Incorrect gender: ' + gender);
//   }
//   return gender;
// };

// export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
//   if (!object || typeof object !== 'object') {
//     throw new Error('Incorrect or missing data');
//   }

//   if (
//     'name' in object &&
//     'dateOfBirth' in object &&
//     'gender' in object &&
//     'ssn' in object &&
//     'occupation' in object
//   ) {
//     const newEntry: NewPatientEntry = {
//       name: parseString(object.name),
//       occupation: parseString(object.occupation),
//       ssn: parseString(object.ssn),
//       gender: parseGender(object.gender),
//       dateOfBirth: parseDate(object.dateOfBirth),
//     };

//     return newEntry;
//   }

//   throw new Error('Incorrect data: some fields are missing');
// };

// import { NewDiaryEntry, Weather, Visibility } from "./types";
import { z } from 'zod';

export const NewPatientSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  gender: z.nativeEnum(Gender),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
});

export const NewEntrySchema = z.object({
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()),
  type: z.nativeEnum(EntryType),
  healthCheckRating: z.nativeEnum(HealthCheckRating).optional(),
  employerName: z.string().optional(),
  sickLeave: z
    .object({ startDate: z.string(), endDate: z.string() })
    .optional(),
  discharge: z.object({ date: z.string(), criteria: z.string() }).optional(),
});

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  return NewPatientSchema.parse(object);
};
