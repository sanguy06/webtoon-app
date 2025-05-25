// Import Dependencies
import express from "express";
import dotenv from "dotenv";
import {pool} from './config/connectToPG.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
dotenv.config();

// Create an App
const app = express();
app.use(cors());

// Connect to Database and Run Query
//runQuery();

// Routing
app.use(express.json());

app.get('/',(req, res) =>{
    console.log(req);
    return res.status(234).send("Welcome");
})

// For testing purposes - displays users
app.get('/users', (req,res)=>{
    res.json(users);
})

// Sign up user 
// Grab future login from user, add to database, respond with ???, then authenticate
app.get('/users/sign_up',(req,res)=>{
    
});


// Log in user 
// search existing database
//      if match --> authenticate
//      else --> prompt user again 
app.post('/users/login', (req,res)=>{
    const username = req.body.username;
    const user = {name: username}
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
});


 // Authenticate User
app.post('/users/login/auth',(req,res)=>{

    const username = req.body.username;
    const user = {name: username}
    const accessToken = jwt.sign(user,process.env,ACCESS_TOKEN_SECRET);
    jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
})

/*
// this should be stored in a database
const users = []

app.get('/users',(req,res)=>{
    res.json(users);

})

app.post('/users', async (req,res)=>{

    try 
    { 
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {name: req.body.name, password: hashedPassword}
        users.push(user)
        res.status(201).send();
    } 
    catch
    {
        res.status(500).send();
    }
   
})

app.post('/users/login', async(req,res)=>{
    const user = users.find(user=>user.name=req.body.name)
    if(user==null){
        return res.status(400).send("Cannot find user")
    }
    try{
        if(await bcrypt.compare(req.body.password,user.password)){
            res.send("Success")
        }else {
            res.send("Not allowed");
        }
    }catch{
        res.status(500).send()
    }
})
*/
// Connect to localhost and Start Server
const PORT = process.env.PORT;
app.listen(PORT, () =>
console.log(`Server running on port ${PORT}`));