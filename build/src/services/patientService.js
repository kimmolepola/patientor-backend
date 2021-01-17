"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const utils_1 = require("../utils");
const generateId = (patientsArray) => {
    const generateIdCandidate = (idChars) => {
        let id = "";
        for (let i = 0; i < 36; i++) {
            if (i == 8 || i == 13 || i == 18 || i == 23) {
                id = id.concat('-');
            }
            else {
                id = id.concat(idChars.charAt(Math.floor(Math.random() * idChars.length)));
            }
        }
        return id;
    };
    const idChars = "abcdef0123456789";
    let idIsUnique = false;
    let id = "";
    while (!idIsUnique) {
        idIsUnique = true;
        id = generateIdCandidate(idChars);
        for (const patient of patientsArray) {
            if (patient.id.localeCompare(id) === 0) {
                idIsUnique = false;
            }
            if (idIsUnique === false) {
                break;
            }
            for (const entry of patient.entries) {
                if (entry.id.localeCompare(id) === 0) {
                    idIsUnique = false;
                    break;
                }
            }
        }
    }
    return id;
};
const addEntry = (patientId, entry) => {
    const newEntry = Object.assign(Object.assign({}, entry), { id: generateId(patients) });
    const patient = patients.find(x => x.id === patientId);
    if (patient) {
        patient.entries.push(newEntry);
    }
    else {
        throw new Error("undefined patient");
    }
    return newEntry;
};
const findById = (id) => {
    return patients.find(x => x.id === id);
};
/*
const prepareData = (patientData: Array<PatientEntryUnpreparedData>): Array<PatientEntry> => {
    return patientData.map(x => {
        const data = toNewPatientEntry(x) as PatientEntry;
        data.entries = [];
        if (x.entries != undefined) {
            data.entries = x.entries;
        }
        data.id = x.id;
        return data;
    });
};
*/
const prepareData = (patientData) => {
    return patientData.map(x => {
        if (!x) {
            throw new Error("undefined patient");
        }
        const data = utils_1.toNewPatientEntry(x);
        data.entries = utils_1.parsePatientVisitEntries(x.entries);
        data.id = x.id;
        return data;
    });
};
const patients = prepareData(patients_1.default);
const publicPatient = patients;
/*
const generatePatientId = (patientsArray: Array<PatientEntry>): string => {
    return String(Math.max(...patientsArray.map(p => Number('0x' + p.id.split('-')[0]))) + 1)
        + patientsArray[0].id.substring(patientsArray[0].id.indexOf('-'));
};
*/
const addPatientEntry = (entry) => {
    const newPatientEntry = Object.assign({ id: generateId(patients), entries: [] }, entry);
    patients.push(newPatientEntry);
    return newPatientEntry;
};
const getEntriesNoSsn = () => {
    return publicPatient.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id, name, dateOfBirth, gender, occupation
    }));
};
const getEntries = () => {
    return patients;
};
exports.default = { addPatientEntry, getEntries, getEntriesNoSsn, findById, addEntry };
