// Import Dependencies
import express from "express";
import dotenv from "dotenv";
import {pool} from './config/connectToPG.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";
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



// For testing purposes - displays users
app.get('/users', async (req,res)=>{
    const usersData = await pool.query(`SELECT * FROM users`);
    const users = usersData.rows;
    res.json(users);
});

// Sign up user 
// Grab future login from user, add to database, respond with ???, then authenticate
app.post('/users/sign_up', async (req,res)=>{
    const{user_name, passcode} = req.body;
    const newUser = await pool.query(`INSERT INTO users (user_name, passcode) VALUES($1, $2)`, 
        [user_name, passcode]);
    res.json(newUser);
});


// Log in user 
// search existing database for username and password match
//      if match --> authenticate
//      else --> prompt user again 
app.get('/users/login', async (req,res, next)=>{
    
    const {user_name, passcode} = req.body; 
    const found = await pool.query(`SELECT EXISTS(SELECT 1 FROM users WHERE user_name = $1
        AND passcode = $2)`,[user_name, passcode] );
    if(!found.rows[0].exists)
    {
        res.status(202).send("No match");
        return;
    }
    else 
    {
        res.json(found);
        next();
    }
});

// Authenticate user
app.post('/users/login/auth', (req,res)=>{

    const {user_name, passcode} = req.body;  
    const user = {user_name, passcode};
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    res.json(user, accessToken);
});

// Token Authentication - should occur before accessing any user-specific data
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) 
    {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });

}

const getWebtoonTitles = async() => {
    try {
        const {data} = await axios.get("https://www.webtoons.com/en/originals");
        const $ = cheerio.load(data);
        const webtoonTitles=[];
        $('.subj').each((_idx,el)=>{
            const webtoonTitle = $(el).text();
            webtoonTitles.push(webtoonTitle);
        });
        console.log(webtoonTitles);
       return webtoonTitles; 

    }
    catch(err)
    {
        console.log(err);
    }
}
// Add webtoons to user through scripting
app.post('/users/login/auth/my-webtoons', async (req,res)=>{
  
    const webtoonTitles = await getWebtoonTitles()
    
    await pool.query(`INSERT INTO webtoons (title) SELECT unnest($1::text[])`, [webtoonTitles]);
    res.send(webtoonTitles);

});


// Connect to localhost and Start Server
const PORT = process.env.PORT;
app.listen(PORT, () =>
console.log(`Server running on port ${PORT}`));