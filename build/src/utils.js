"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewEntry = exports.parsePatientVisitEntries = exports.toNewPatientEntry = void 0;
const types_1 = require("./types");
/*
eslint-disable
@typescript-eslint/no-explicit-any,
@typescript-eslint/explicit-module-boundary-types,
@typescript-eslint/no-unsafe-member-access
*/
const isSickLeave = (sickLeave) => {
    return (isString(sickLeave.startDate)
        && isString(sickLeave.endDate)
        && isDate(sickLeave.startDate)
        && isDate(sickLeave.endDate))
        && new Date(sickLeave.startDate) <= new Date(sickLeave.endDate);
};
const parseSickLeave = (sickLeave) => {
    if (!sickLeave || !isSickLeave(sickLeave)) {
        throw new Error('Incorrect or missing sick leave entry ' + JSON.stringify(sickLeave));
    }
    return sickLeave;
};
const parseEmployerName = (employerName) => {
    if (!employerName || !isString(employerName)) {
        throw new Error('Incorrect or missing employer name ' + JSON.stringify(employerName));
    }
    return employerName;
};
const isDischarge = (discharge) => {
    return (isString(discharge.date) && isDate(discharge.date) && isString(discharge.criteria));
};
const parseDischarge = (discharge) => {
    if (!discharge || !isDischarge(discharge)) {
        throw new Error('Incorrect or missing discharge entry ' + JSON.stringify(discharge));
    }
    return discharge;
};
const parseHealthCheckRating = (rating) => {
    const isHealthCheckRating = (object) => {
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
const parseEntryType = (type) => {
    if (!type || !Object.values(types_1.PatientVisitEntryType).includes(type)) {
        throw new Error('Incorrect or missing entry type ' + JSON.stringify(type));
    }
    return type;
};
const parseDiagnosisCodes = (diagnosisCodes) => {
    return diagnosisCodes.map(x => {
        if (!x || !isString(x)) {
            throw new Error('Incorrect or missing diagnosis code ' + JSON.stringify(x));
        }
        return x;
    });
};
const parseSpecialist = (specialist) => {
    if (!specialist || !isString(specialist)) {
        throw new Error('Incorrect or missing specialist ' + JSON.stringify(specialist));
    }
    return specialist;
};
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing entry date ' + JSON.stringify(date));
    }
    return date;
};
const parseDescription = (description) => {
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
const assertNever = (value) => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};
const toNewEntry = (object) => {
    const baseEntry = {
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
    };
    if (object.diagnosisCodes) {
        baseEntry.diagnosisCodes = parseDiagnosisCodes(object.diagnosisCodes);
    }
    const type = parseEntryType(object.type);
    let newEntry;
    switch (type) {
        case "OccupationalHealthcare":
            newEntry = Object.assign(Object.assign({}, baseEntry), { type: type, employerName: parseEmployerName(object.employerName) });
            if (object.sickLeave && (object.sickLeave.startDate || object.sickLeave.endDate)) {
                newEntry = Object.assign(Object.assign({}, newEntry), { sickLeave: parseSickLeave(object.sickLeave) });
            }
            break;
        case "Hospital":
            newEntry = Object.assign(Object.assign({}, baseEntry), { type: type, discharge: parseDischarge(object.discharge) });
            break;
        case "HealthCheck":
            newEntry = Object.assign(Object.assign({}, baseEntry), { type: type, healthCheckRating: parseHealthCheckRating(object.healthCheckRating) });
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
exports.toNewEntry = toNewEntry;
const isEntry = (param) => {
    return Object.values(types_1.PatientVisitEntryType).includes(param.type);
};
const parsePatientVisitEntries = (entries) => {
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
exports.parsePatientVisitEntries = parsePatientVisitEntries;
const parseOccupation = (occupation) => {
    if (!occupation || !isString(occupation)) {
        throw new Error('Incorrect or missing occupation ' + JSON.stringify(occupation));
    }
    return occupation;
};
const isGender = (param) => {
    return Object.values(types_1.Gender).includes(param);
};
const parseGender = (gender) => {
    if (!gender || !isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender ' + JSON.stringify(gender));
    }
    return gender;
};
const isSsn = (ssn) => {
    if ((ssn.length == 11 || ssn.length == 10) // Exercise hardcoded data includes a real world invalid SSN with 10 characters
        && Array.from(ssn.substring(0, 5)).every(x => !isNaN(Number(x)))
        && ssn.charAt(6) === '-') {
        return true;
    }
    return false;
};
const parseSsn = (ssn) => {
    if (!ssn || !isString(ssn) || !isSsn(ssn)) {
        throw new Error('Incorrect or missing SSN ' + JSON.stringify(ssn));
    }
    return ssn;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const parseDateOfBirth = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date of birth: ' + JSON.stringify(date));
    }
    return date;
};
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const parseName = (name) => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing name: ' + JSON.stringify(name));
    }
    return name;
};
const toNewPatientEntry = (object) => {
    return {
        name: parseName(object.name),
        dateOfBirth: parseDateOfBirth(object.dateOfBirth),
        ssn: parseSsn(object.ssn),
        gender: parseGender(object.gender),
        occupation: parseOccupation(object.occupation),
    };
};
exports.toNewPatientEntry = toNewPatientEntry;
