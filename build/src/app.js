"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("./routes/patients"));
const diagnoses_1 = __importDefault(require("./routes/diagnoses"));
const express_1 = __importDefault(require("express"));
const cors = require('cors'); // eslint-disable-line
const app = express_1.default();
app.use(express_1.default.json());
app.use(cors()); // eslint-disable-line
app.use('/api/diagnosis', diagnoses_1.default);
app.use('/api/patients', patients_1.default);
//const PORT = 3001;
app.get('/api/ping/', (_req, res) => {
    console.log('pinged');
    res.send('pong');
});
module.exports = app;
