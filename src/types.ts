
export type NewEntry = Omit<HospitalEntry, 'id'> | Omit<OccupationalHealthcareEntry, 'id'> | Omit<HealthCheckEntry, 'id'>;

export const PatientVisitEntryType = {
    OccupationalHealthcare: 'OccupationalHealthcare',
    Hospital: 'Hospital',
    HealthCheck: 'HealthCheck'
};

export interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    employerName: string;
    sickLeave?: { startDate: string, endDate: string }
}

export interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: { date: string, criteria: string };
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
}

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}

interface BaseEntry {
    id: string;
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: Array<DiagnoseEntry['code']>;
}

export enum Gender { Male = 'male', Female = 'female', Other = 'other' }

export type NewPatientEntry = Omit<PatientEntry, 'id' | 'entries'>;

export type PublicPatient = Omit<PatientEntry, 'ssn' | 'entries'>;

export type Patient = PatientEntry | undefined;

export interface PatientEntry {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
    entries: Entry[];
}

/*
export interface PatientEntryUnpreparedData {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: string;
    occupation: string;
    entries?: Entry[];
}
*/

export interface DiagnoseEntry {
    code: string;
    name: string;
    latin?: string;
}