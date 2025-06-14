

import pkg from 'pg';

const{Pool, Client} = pkg;

const connectionString = "postgresql://postgres:LXneaKXTaYqyJsFZMlMYmzJknPUZafuE@postgres.railway.internal:5432/railway"

const pool = new Pool({
    /*
    host: "localhost", 
    user: "postgres",
    port: 5432,
    password: "cattran2006",
    database: "webtoon-server"*/
    
    connectionString, 
});



export{pool};
