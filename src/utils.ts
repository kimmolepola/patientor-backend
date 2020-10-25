import {
    NewPatientEntry,
    Gender,
    PatientVisitEntryType,
    Entry,
    NewEntry,
    HealthCheckRating,
    HospitalEntry,
    OccupationalHealthcareEntry
} from './types';

/* 
eslint-disable 
@typescript-eslint/no-explicit-any, 
@typescript-eslint/explicit-module-boundary-types,
@typescript-eslint/no-unsafe-member-access
*/

const isSickLeave = (sickLeave: any): sickLeave is OccupationalHealthcareEntry["sickLeave"] => {
    return (isString(sickLeave.startDate)
        && isString(sickLeave.endDate)
        && isDate(sickLeave.startDate)
        && isDate(sickLeave.endDate))
        && new Date(sickLeave.startDate) <= new Date(sickLeave.endDate);
};

const parseSickLeave = (sickLeave: any): OccupationalHealthcareEntry["sickLeave"] => {
    if (!sickLeave || !isSickLeave(sickLeave)) {
        throw new Error('Incorrect or missing sick leave entry ' + JSON.stringify(sickLeave));
    }
    return sickLeave;
};

const parseEmployerName = (employerName: any): string => {
    if (!employerName || !isString(employerName)) {
        throw new Error('Incorrect or missing employer name ' + JSON.stringify(employerName));
    }
    return employerName;
};

const isDischarge = (discharge: any): discharge is HospitalEntry["discharge"] => {
    return (isString(discharge.date) && isDate(discharge.date) && isString(discharge.criteria));
};

const parseDischarge = (discharge: any): HospitalEntry["discharge"] => {
    if (!discharge || !isDischarge(discharge)) {
        throw new Error('Incorrect or missing discharge entry ' + JSON.stringify(discharge));
    }
    return discharge;
};

const parseHealthCheckRating = (rating: any): HealthCheckRating => {
    const isHealthCheckRating = (object: any): object is HealthCheckRating => {
        return Number.isInteger(object) && object >= 0 && object <= 3;
    };
    if (!isHealthCheckRating(rating)) {
        throw new Error('Incorrect or missing health check rating ' + JSON.stringify(rating));
    }
    return rating;
};

/*
const isHealthCheckRating = (rating: any): rating is HealthCheckRating => {
    return Object.values(HealthCheckRating).includes(rating);
};

const parseHealthCheckRating = (rating: any): HealthCheckRating => {
    if (!rating || !isHealthCheckRating(rating)) {
        throw new Error('Incorrect or missing health check rating' + String(rating));
    }
    return rating;
};
*/

const parseEntryType = (type: any): Entry["type"] => {
    if (!type || !Object.values(PatientVisitEntryType).includes(type)) {
        throw new Error('Incorrect or missing entry type ' + JSON.stringify(type));
    }
    return type as Entry["type"];
};

const parseDiagnosisCodes = (diagnosisCodes: any[]): string[] => {
    return diagnosisCodes.map(x => {
        if (!x || !isString(x)) {
            throw new Error('Incorrect or missing diagnosis code ' + JSON.stringify(x));
        }
        return x;
    });

};

const parseSpecialist = (specialist: any): string => {
    if (!specialist || !isString(specialist)) {
        throw new Error('Incorrect or missing specialist ' + JSON.stringify(specialist));
    }
    return specialist;
};

const parseDate = (date: any): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing entry date ' + JSON.stringify(date));
    }
    return date;
};

const parseDescription = (description: any): string => {
    if (!description || !isString(description)) {
        throw new Error('Incorrect or missing entry description ' + JSON.stringify(description));
    }
    return description;
};

/*
const toNewEntry = (object: any): NewEntry => {
    const asdf = {
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
        type: parseEntryType(object.type),
        employerName: parseEmployerName(object.employerName),
        //sickLeave: parseSickLeave(object.sickLeave),
        discharge: parseDischarge(object.discharge),
        //healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
    };
    return asdf;
};
*/

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const toNewEntry = (object: any): NewEntry => {
    const baseEntry: Omit<NewEntry, 'type'> = {
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        //diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
    };

    if (object.diagnosisCodes) {
        baseEntry.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
    }
    const type = parseEntryType(object.type);
    let newEntry;

    switch (type) {
        case "OccupationalHealthcare":
            newEntry = {
                ...baseEntry,
                type: type,
                employerName: parseEmployerName(object.employerName),
            };
            if (object.sickLeave && (object.sickLeave.startDate || object.sickLeave.endDate)) {
                newEntry = {
                    ...newEntry,
                    sickLeave: parseSickLeave(object.sickLeave)
                };
            }
            break;
        case "Hospital":
            newEntry = {
                ...baseEntry,
                type: type,
                discharge: parseDischarge(object.discharge),
            };
            break;
        case "HealthCheck":
            newEntry = {
                ...baseEntry,
                type: type,
                healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
            };
            break;
        default:
            assertNever(type);
            break;
    }
    if (!newEntry) {
        throw new Error('Incorrect or missing entry');
    }
    return newEntry;
};


const isEntry = (param: any): param is Entry => { // currently entry type validated only
    return Object.values(PatientVisitEntryType).includes(param.type);
};

const parsePatientVisitEntries = (entries: any[]): Entry[] => {
    if (!entries || entries.length == 0) {
        return [];
    }
    return entries.map(x => {
        if (!isEntry(x)) {
            throw new Error('Incorrect or missing patient data entry type ' + JSON.stringify(x.type));
        }
        return x;
    });
};

const parseOccupation = (occupation: any): string => {
    if (!occupation || !isString(occupation)) {
        throw new Error('Incorrect or missing occupation ' + JSON.stringify(occupation));
    }
    return occupation;
};

const isGender = (param: any): param is Gender => {
    return Object.values(Gender).includes(param);
};

const parseGender = (gender: any): Gender => {
    if (!gender || !isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender ' + JSON.stringify(gender));
    }
    return gender;
};

const isSsn = (ssn: string): boolean => {
    if ((ssn.length == 11 || ssn.length == 10) // Exercise hardcoded data includes a real world invalid SSN with 10 characters
        && Array.from(ssn.substring(0, 5)).every(x => !isNaN(Number(x)))
        && ssn.charAt(6) === '-') {
        return true;
    }
    return false;
};

const parseSsn = (ssn: any): string => {
    if (!ssn || !isString(ssn) || !isSsn(ssn)) {
        throw new Error('Incorrect or missing SSN ' + JSON.stringify(ssn));
    }
    return ssn;
};

const isDate = (date: any): boolean => {
    return Boolean(Date.parse(date));
};

const parseDateOfBirth = (date: any): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date of birth: ' + JSON.stringify(date));
    }
    return date;
};

const isString = (text: any): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const parseName = (name: any): string => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing name: ' + JSON.stringify(name));
    }
    return name;
};

const toNewPatientEntry = (object: any): NewPatientEntry => {
    return {
        name: parseName(object.name),
        dateOfBirth: parseDateOfBirth(object.dateOfBirth),
        ssn: parseSsn(object.ssn),
        gender: parseGender(object.gender),
        occupation: parseOccupation(object.occupation),
    };
};



export { toNewPatientEntry, parsePatientVisitEntries, toNewEntry };