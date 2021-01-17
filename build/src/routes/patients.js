"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const express_1 = __importDefault(require("express"));
const patientService_1 = __importDefault(require("../services/patientService"));
const router = express_1.default.Router();
router.post('/:id/entries', (req, res) => {
    try {
        const newEntry = utils_1.toNewEntry(req.body);
        const addedEntry = patientService_1.default.addEntry(req.params.id, newEntry);
        res.json(addedEntry);
    }
    catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        res.status(400).send({ error: err.message });
    }
});
router.get('/:id', (req, res) => {
    const patient = patientService_1.default.findById(req.params.id);
    if (patient) {
        res.send(patient);
    }
    else {
        res.status(404).send({ error: "Not found" });
    }
});
router.post('/', (req, res) => {
    try {
        const newPatientEntry = utils_1.toNewPatientEntry(req.body);
        const addedPatientEntry = patientService_1.default.addPatientEntry(newPatientEntry);
        res.json(addedPatientEntry);
    }
    catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        res.status(400).send({ error: err.message });
    }
});
router.get('/', (_req, res) => {
    //console.log(Number('0x' + patientService.getEntriesNoSsn()[0].id.split('-')[0]));
    res.send(patientService_1.default.getEntriesNoSsn());
});
exports.default = router;
