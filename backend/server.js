// Import Dependencies
import express from "express";
import dotenv from "dotenv";
import {pool} from './config/connectToPG.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";
import {v4 as uuidv4} from "uuid";
import webtoonController from "./controllers/webtoonController.js";
dotenv.config();

// Create an App
const app = express();
app.use(cors());

// Routing
app.use(express.json());

app.get('/',(req, res) =>{
    console.log(req);
    return res.status(234).send("Welcome");
})

// Fetch Users - for testing
app.get('/users', async (req,res)=>{
    const usersData = await pool.query(`SELECT * FROM users`);
    const users = usersData.rows;
    res.json(users);
});

// Signup user 
app.post('/users/sign_up', webtoonController.signupUser);

// Login User 
app.get('/users/login', webtoonController.loginUser);

// Authenticate User
app.post('/users/login/auth', webtoonController.authUser);


// Fetch All Webtoons 
app.get('/webtoons', webtoonController.fetchWebtoons);


// Add Webtoon to User
app.post('/users/:id/my-webtoons', webtoonController.authenticateToken, webtoonController.addWebtoon);

// Add User-Rating to Webtoon
app.post('/users/:id/my-webtoons-ratings', webtoonController.authenticateToken, webtoonController.addRating);

// Update User Rating
app.post('/users/:id/my-webtoons-update-ratings', webtoonController.authenticateToken, webtoonController.updateRating);

// Delete Webtoon from User
app.delete('/users/:id/my-webtoons', webtoonController.authenticateToken, webtoonController.deleteRating);

// Connect to localhost and Start Server
const PORT = process.env.PORT;
app.listen(PORT, () =>
console.log(`Server running on port ${PORT}`));