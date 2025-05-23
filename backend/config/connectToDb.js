if(process.env.NODE_ENV!="production")
{
    require("dotenv").config();
}

const {Client} = require('pg');

const client = new Client({
    host: "localhost", 
    user: "postgres",
    port: 5432,
    password: "cattran2006",
    database: "postgres"
})

client.connect();

