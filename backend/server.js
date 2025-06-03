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
import {signupUser,
    loginUser,
    authUser, 
    getUser,
    getUserWebtoons,
    addWebtoon,
    addRating, 
    updateRating,
    fetchWebtoons,
    authenticateToken,
    deleteWebtoon} from "./controllers/webtoonController.js";
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
app.post('/users/sign_up', signupUser);

// Login User 
app.post('/users/login', loginUser);

// Authenticate User
app.post('/users/auth', authUser);

app.get('/user', getUser);

// Fetch All Webtoons 
app.get('/webtoons', fetchWebtoons);

// Get Webtoons For Each User 
app.get('/users/:id/my-webtoons', authenticateToken, getUserWebtoons);

// Add Webtoon to User
app.post('/users/:id/add-webtoons', authenticateToken, addWebtoon);

// Add User-Rating to Webtoon
app.post('/users/:id/my-webtoons-ratings', authenticateToken, addRating);

// Update User Rating
app.post('/users/:id/my-webtoons-update-ratings', authenticateToken, updateRating);

// Delete Webtoon from User
app.delete('/users/:id/my-webtoons', authenticateToken, deleteWebtoon);

// Connect to localhost and Start Server
const PORT = process.env.PORT;
app.listen(PORT, () =>
console.log(`Server running on port ${PORT}`));