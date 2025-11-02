import pkg from 'pg';
import dotenv from "dotenv";

const{Pool, Client} = pkg;

/*
const pool = new Pool({
    
    host: "localhost", 
    user: "postgres",
    port: 5432,
    password: "cattran2006",
    database: "webtoon-server"
    
    
});

export{pool};
*/
dotenv.config()
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: {rejectUnauthorized: false},
});

pool.connect()
    .then(() => console.log("Connected to Supabase"))
    .catch(err => console.error("Connection err", err.stack));

export{pool};