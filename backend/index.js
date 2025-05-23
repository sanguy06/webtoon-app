import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get('/',(req, res) =>{
    console.log(req);
    return res.status(234).send("Welcome");
})

const PORT = process.env.PORT;

app.listen(PORT, () =>
console.log(`Server running on port ${PORT}`));