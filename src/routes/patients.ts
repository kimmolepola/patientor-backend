import { toNewPatientEntry, toNewEntry } from '../utils';
import express from 'express';
import patientService from '../services/patientService';
const router = express.Router();

router.post('/:id/entries', (req, res) => {
    try {
        const newEntry = toNewEntry(req.body);
        const addedEntry = patientService.addEntry(req.params.id, newEntry);
        res.json(addedEntry);
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        res.status(400).send({ error: err.message });
    }
});

router.get('/:id', (req, res) => {
    const patient = patientService.findById(req.params.id);
    if (patient) {
        res.send(patient);
    } else {
        res.status(404).send({ error: "Not found" });
    }
});

router.post('/', (req, res) => {
    try {
        const newPatientEntry = toNewPatientEntry(req.body);
        const addedPatientEntry = patientService.addPatientEntry(newPatientEntry);
        res.json(addedPatientEntry);
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        res.status(400).send({ error: err.message });
    }
});

router.get('/', (_req, res) => {
    //console.log(Number('0x' + patientService.getEntriesNoSsn()[0].id.split('-')[0]));
    res.send(patientService.getEntriesNoSsn());
});

export default router;