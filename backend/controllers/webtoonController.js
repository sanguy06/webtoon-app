
import {pool} from '../config/connectToPG.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";
import {v4 as uuidv4} from "uuid";
import puppeteer from 'puppeteer';

// Signup User
const signupUser = async (req,res)=>{
        
    const userID = uuidv4();
    const hashedPassword = await bcrypt.hash(req.body.passcode, 10);
    const{user_name, passcode} = {user_name: req.body.user_name, passcode: hashedPassword};
    const newUser = await pool.query(`INSERT INTO users (user_name, passcode, user_id) VALUES($1, $2, $3)`, 
        [user_name, passcode, userID]);
    res.json(newUser);

};

// Login User
const loginUser = async (req,res)=>{
    try {
    const {user_name, passcode} = req.body; 
    const found = await pool.query(`SELECT passcode FROM users WHERE user_name = $1`,[user_name] );
    console.log(found.rows[0].passcode);
    if(found.rows.length<0)
    {
        res.send(false);
        //res.status(202).send("No match");
        return;
    }
    else 
    {        
        if(await bcrypt.compare(passcode, found.rows[0].passcode))
        {
            // generates access token associated with user
            const smth = await pool.query(`SELECT user_id FROM users WHERE user_name = $1 `, [user_name]);
            const user_id = smth.rows[0].user_id;
            const user = {user_name, user_id, passcode};
            const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
            res.json({user,accessToken});
            console.log("match found");

        }
        else 
        {
            res.send(false); 
            console.log("not allowed");
        }

    }} catch(err) {
        console.log(err);
    }
};

// Authenticate User
const authUser = (req,res)=>{

    const {user_name, passcode} = req.body;  
    const user = {user_name, passcode};
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    
    res.send(user, accessToken);
    console.log("user is authenticated");
};

// Get Specific User
const getUser = async(req,res)=> {
    const {user_name, passcode} = req.body;
    
    const smth = await pool.query(`SELECT user_id from users where user_name = $1 AND passcode = $2`, 
        [user_name, passcode]);
    if(smth.rows.length ===0)
    {
        console.log("uh oh");
    }
    let userID = smth.rows[0].user_id;
    res.send(userID);
}

// Token Authentication - should occur before accessing any user-specific data
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization'];
    console.log("authHeader is" + authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token in server is " + token);
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
    console.log("token authenticated");

}

const searchWebtoons = async (req,res) =>
{

    const {webtoonTitle} = req.query;
    const webtoonsSearched= await pool.query(`SELECT * FROM webtoons where title ILIKE $1`, [`%${webtoonTitle}%`]);
    console.log(webtoonsSearched.rows);
    res.json(webtoonsSearched.rows);
}   

const displayWebtoonInfo = async(req,res) => {
    const webtoonID = req.params.webtoonID; 
    console.log(webtoonID);
    const webtoonDisplayed = await pool.query(`SELECT * FROM webtoons where webtoon_id = $1`, [webtoonID]);
    res.json(webtoonDisplayed.rows[0]);
}

const getUserWebtoons = async(req,res)=>
{
    
   const userID = req.user.user_id;
    let userWebtoonIDs= [];
    const userWebtoons = [];
    userWebtoonIDs = await pool.query(`SELECT webtoon_id FROM user_webtoons where user_id = $1`, [userID]);
    for(let i = 0; i < userWebtoonIDs.rows.length; i++)
    {
        let userRating = 0;
        let userReview = "";
        const smth = await pool.query(`SELECT title FROM webtoons where webtoon_id = $1`, [userWebtoonIDs.rows[i].webtoon_id]);
        const webtoonTitle = smth.rows[0].title;
        const smth2 = await pool.query(`SELECT author FROM webtoons where webtoon_id = $1`, [userWebtoonIDs.rows[i].webtoon_id]);
        const webtoonAuthor = smth2.rows[0].author;
        
        const smth3 = await pool.query(`SELECT rating FROM user_ratings where webtoon_id = $1 AND user_id = $2`, 
            [userWebtoonIDs.rows[i].webtoon_id, userID]);
        if(smth3.rows.length>0) {
           userRating = smth3.rows[0].rating;
        } 
         const smth4 = await pool.query(`SELECT review FROM user_reviews where webtoon_id = $1 AND user_id = $2`, 
            [userWebtoonIDs.rows[i].webtoon_id, userID]);
         if(smth4.rows.length>0) {
           userReview = smth4.rows[0].review;
           
        } 
    
        userWebtoons.push({title: webtoonTitle, author: webtoonAuthor, rating: userRating, webtoonID: userWebtoonIDs.rows[i].webtoon_id, 
            review: userReview
        });
    }   
    if (userWebtoons.length===0){
        console.log("mhm");
        res.send("")
        
    } else {
        console.log("no");
    res.json(userWebtoons);
    }
   
}

// Add Webtoon to User
const addWebtoon = async (req,res)=>{
   
    const userID = req.user.user_id;
    const {webtoonTitle} = req.body;
    const smth = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
    let webtoonID = smth.rows[0].webtoon_id;
    //console.log(webtoonID);
    await pool.query(`INSERT INTO user_webtoons (user_id, webtoon_id) VALUES($1,$2)`, [userID,webtoonID]);
    res.send(userID);
};

// Get Rating
const getRating = async (req,res) => {
    const userID = req.user.user_id;
    const{webtoonTitle} = req.query; 
    console.log(webtoonTitle);
     const smth = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
     console.log(smth);
    let webtoonID = smth.rows[0].webtoon_id;
    const smth2 = await pool.query(`SELECT rating FROM user_ratings where webtoon_id = $1 AND user_id = $2 `, 
        [webtoonID, userID]);
    if(smth2.rows.length ===0)
        res.send("");
    else 
    {
        console.log(smth2.rows[0].rating)
         res.send(smth2.rows[0].rating);
    }
}

// Get All Ratings From a User
const getUserRatings = async (req, res) => {
    let userRatings = []; 
    const userID = req.user.user_id; 
    const ratings = await pool.query(`SELECT * FROM user_ratings where user_id = $1`, [userID]); 

    for(let i = 0; i < ratings.rows.length; i++) {
        const webtoonTitle = await pool.query(`SELECT title FROM webtoons where webtoon_id = $1`, 
            [ratings.rows[i].webtoon_id]);
        userRatings.push({rating: ratings.rows[i].rating, title: webtoonTitle.rows[0].title,});
    }
    res.send(userRatings);


}

// Add User-Rating to Webtoon
const addRating = async (req, res)=>{
    console.log("ADDED");
    const userID = req.user.user_id;
    const{webtoonTitle, userRating} = req.body; 
    console.log("rating is " + userRating);
    const smth = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
    let webtoonID = smth.rows[0].webtoon_id;
    console.log("The ID is" + webtoonID);
    await pool.query(`INSERT INTO user_ratings (user_id, webtoon_id, rating) VALUES ($1,$2,$3)`, 
        [userID, webtoonID, userRating]);
    res.send(userRating);
};

// Update User-Rating
const updateRating = async (req,res)=>{
    const userID = req.user.user_id;
    const{webtoonTitle, userRating} = req.body; 
    console.log("title is " + webtoonTitle);
    console.log("rating is " + userRating);
    const smth = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
    
    let webtoonID = smth.rows[0].webtoon_id;
    
    await pool.query(`UPDATE user_ratings SET rating = $1 WHERE user_id = $2 AND webtoon_id = $3`, 
        [userRating, userID, webtoonID]);
    
    res.send(userRating);
    
};

const getReview = async(req,res) => {
    const userID = req.user.user_id; 
    const {webtoonTitle} = req.query; 
    const smth = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
    let webtoonID = smth.rows[0].webtoon_id;
    const review = await pool.query(`SELECT review FROM user_reviews WHERE user_id = $1 AND webtoon_id = $2`, 
        [userID, webtoonID]); 
    if(review.rows.length==0) 
    {
        console.log("review doesn't exist on backend");
        res.send("");
    }
    else 
        res.send(review.rows[0].review);
    

}

const getUserReviews = async(req, res) => {
    const userID = req.user.user_id;
    const reviews =  await pool.query(`SELECT * FROM user_reviews WHERE user_id = $1`, [userID]); 
    let userReviews = []; 
    for(let i = 0; i < reviews.rows.length; i++)
    {
         const webtoonTitle = await pool.query(`SELECT title FROM webtoons where webtoon_id = $1`, 
            [reviews.rows[i].webtoon_id]);
        userReviews.push({review: reviews.rows[i].review, title: webtoonTitle.rows[0].title,});
    }
    res.send(userReviews);
}
// Add User-Review
const addReview = async(req, res) => {
    const userID = req.user.user_id; 
    const{webtoonTitle, review} = req.body; 
    const webtoon = await pool.query(`SELECT webtoon_id FROM webtoons WHERE title = $1`, [webtoonTitle]);
    const webtoonID = webtoon.rows[0].webtoon_id; 
    await pool.query(`INSERT INTO user_reviews (user_id, webtoon_id, review) VALUES ($1, $2, $3)`, 
        [userID, webtoonID, review]);
    res.send(review);


}

// Update User-Review
const updateReview = async(req,res) => {
    const userID = req.user.user_id; 
    const{webtoonTitle, review} = req.body; 
    const webtoon = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
    let webtoonID = webtoon.rows[0].webtoon_id;
    await pool.query(`UPDATE user_reviews SET review = $1 WHERE user_id = $2 AND webtoon_id = $3`, 
        [review, userID, webtoonID]);
    res.send(review);
}

const deleteReview = async(req,res) =>{
    const userID = req.user.user_id; 
    const{webtoonTitle} = req.body; 
    const webtoon = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
    let webtoonID = webtoon.rows[0].webtoon_id;
    await pool.query(`DELETE FROM user_reviews WHERE user_id = $1 AND webtoon_id = $2`, 
        [userID, webtoonID]
    );
    res.send("Deleted");
}

// Delete Webtoon 
const deleteWebtoon = async (req, res)=>{
    const userID = req.user.user_id;
    console.log(userID);
    const{webtoonTitle} = req.query; 
    console.log(webtoonTitle);
    const smth = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
    let webtoonID = smth.rows[0].webtoon_id;
    console.log(webtoonID);
    await pool.query(`DELETE FROM user_webtoons WHERE webtoon_id = $1 AND user_id = $2`, [webtoonID, userID]);
    await pool.query(`DELETE FROM user_ratings WHERE webtoon_id = $1 AND user_id = $2`, [webtoonID, userID]);
    res.send("deleted");
};

// DONT RUN THIS - it inserts webtoons into the database
const fetchWebtoons = async (req,res)=>{
    const webtoonTitles = await getWebtoonTitles();
    const webtoonAuthors = await getWebtoonAuthors();
    await pool.query(`INSERT INTO webtoons (title, author) SELECT * FROM unnest($1::text[],$2::text[]) AS t(title, author)`, [webtoonTitles,webtoonAuthors]);
    //await pool.query(`INSERT INTO webtoons (title) SELECT * FROM unnest ($1::text[])`, [webtoonTitles]);
    
}

// Add webtoon titles to database through scraping
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

// Add webtoon authors to database through scraping - not working yet
const getWebtoonAuthors = async() => {
    try 
    {
        const {data} = await axios.get("https://www.webtoons.com/en/originals");
        const $ = cheerio.load(data);
        const webtoonAuthors=[];
        $('.author').each((_idx,el)=>{
            const webtoonAuthor = $(el).text();
            webtoonAuthors.push(webtoonAuthor);
        });
        console.log(webtoonAuthors);
       return webtoonAuthors; 

    }
    catch(err)
    {
        console.log(err);
    }
}

const getWebtoonImages = async () => {
    try{
        const browser = await puppeteer.launch(); 
        const page = await browser.newPage(); 
       
        await page.goto('https://www.webtoons.com/en/originals', 
            { referer: 'http://www.webtoons.com'} , 
        );
        
        await page.locator('img[loading=lazy]').wait()
        const images = Array.from(page.$$eval('img[loading=lazy]', imgs => imgs.map(img => img.getAttribute("src"))));
        console.log(images);
        for(const image of images) {
            console.log("hi");
            const result = await cloudinary.v2.uploader.upload(image);
            console.log(result.secure_url);
        }
    } catch(err) 
    {
        console.log(err);
    }
    
    
}


export{
    signupUser,
    loginUser,
    authUser, 
    getUser, 
    searchWebtoons,
     
    displayWebtoonInfo,
    getUserWebtoons,
    addWebtoon,
    getRating,
    getUserRatings,
    addRating, 
    updateRating,
    fetchWebtoons,
    authenticateToken,
    deleteWebtoon, 
    getWebtoonImages, 
    getReview,
    getUserReviews,
    addReview, 
    updateReview, 
    deleteReview
}