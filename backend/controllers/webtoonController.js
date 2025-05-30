
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
    
    const {user_name, passcode} = req.body; 
    const found = await pool.query(`SELECT passcode FROM users WHERE user_name = $1`,[user_name] );
    console.log(found.rows[0].passcode);
    if(found.rows.length<0)
    {
        res.status(202).send("No match");
        return;
    }
    else 
    {        
        if(await bcrypt.compare(passcode, found.rows[0].passcode))
            res.send("match found");
        else 
            res.send("not allowed"); 
    }
};

// Authenticate User
const authUser = (req,res)=>{

    const {user_name, passcode} = req.body;  
    const user = {user_name, passcode};
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    res.json(user, accessToken);
};

// Add Webtoon to User
const addWebtoon = async (req,res)=>{
    const{webtoonTitle} = req.body;
    const userID = req.params.id;
    const smth = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
    let webtoonID = smth.rows[0].webtoon_id;
    await pool.query(`INSERT INTO user_webtoons (user_id, webtoon_id) VALUES($1,$2)`, [userID, webtoonID]);
    res.send(userID);
};

// Add User-Rating to Webtoon
const addRating = async (req, res)=>{
    const{webtoonTitle, user_rating} = req.body; 
    const userID = req.params.id; 

    const smth = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
    let webtoonID = smth.rows[0].webtoon_id;
    console.log("The ID is" + webtoonID);
    await pool.query(`INSERT INTO user_ratings (user_id, webtoon_id, rating) VALUES ($1,$2,$3)`, 
        [userID, webtoonID, user_rating]);
    res.send(user_rating);
};


// Update User-Rating
const updateRating = async (req,res)=>{
    const{webtoonTitle, userRating} = req.body; 
    const userID = req.params.id;
    const smth = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
    
    let webtoonID = smth.rows[0].webtoon_id;
    
    await pool.query(`UPDATE user_ratings SET rating = $1 WHERE user_id = $2 AND webtoon_id = $3`, 
        [userRating, userID, webtoonID]);
    res.send("Deleted");
    
};

// Delete Webtoon 
const deleteWebtoon = async (req, res)=>{
 
    const{webtoonTitle} = req.body; 
    console.log(webtoonTitle);
    const userID = req.params.id;
    const smth = await pool.query(`SELECT webtoon_id FROM webtoons where title = $1`, [webtoonTitle]);
    let webtoonID = smth.rows[0].webtoon_id;
    await pool.query(`DELETE FROM ONLY user_webtoons WHERE webtoon_id = $1 AND user_id = $2`, [webtoonID, userID]);
    
};

// Fetch Webtoons - authors is not implemented yet
const fetchWebtoons = async (req,res)=>{
    const webtoonTitles = await getWebtoonTitles();
    const webtoonAuthors = await getWebtoonAuthors();
    
    await pool.query(`INSERT INTO webtoons (title, author) SELECT * FROM unnest($1::text[],$2::text[]) AS t(title, author)`, [webtoonTitles,webtoonAuthors]);
    //await pool.query(`INSERT INTO webtoons (title) SELECT * FROM unnest ($1::text[])`, [webtoonTitles]);
    res.send(webtoonTitles);
    
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