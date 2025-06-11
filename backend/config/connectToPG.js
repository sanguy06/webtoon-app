

import pkg from 'pg';

const{Pool, Client} = pkg;

const pool = new Pool({
    host: "localhost", 
    user: "postgres",
    port: 5432,
    password: "cattran2006",
    database: "webtoon-server"
})


export{pool};
