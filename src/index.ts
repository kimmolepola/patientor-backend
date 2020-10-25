import patientRouter from './routes/patients';
import diagnoseRouter from './routes/diagnoses';
import express from 'express';
require('dotenv').config();
const { PORT } = process.env;

const cors = require('cors'); // eslint-disable-line
const app = express();
app.use(express.json());
app.use(cors()); // eslint-disable-line
app.use('/api/diagnosis', diagnoseRouter);
app.use('/api/patients', patientRouter);

//const PORT = 3001;

app.get('/api/ping/', (_req, res) => {
    console.log('pinged');
    res.send('pong');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});