

import pkg from 'pg';
const{Pool, Client} = pkg;

const pool = new Pool({
    host: "localhost", 
    user: "postgres",
    port: 5432,
    password: "cattran2006",
    database: "webtoon-server"
})

/*
const runQuery = async() => {
    try{
        const res = await pool.query(`SELECT * FROM users`);
        console.log(res.rows);
        console.log("Connected to database");
    } catch (err)
    {
        console.log(err.message);
    }
    pool.end;
}
*/
export{pool};
