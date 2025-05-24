import express from "express";
import dotenv from "dotenv";
import {runQuery} from './config/connectToPG.js';

dotenv.config();

const app = express();
runQuery();

app.get('/',(req, res) =>{
    console.log(req);
    return res.status(234).send("Welcome");
})

const PORT = process.env.PORT;

app.listen(PORT, () =>
console.log(`Server running on port ${PORT}`));