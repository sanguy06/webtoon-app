import pkg from 'pg';

const{Pool, Client} = pkg;

const webtoonScheme = new pkg.Scheme({
    title: String,
    userRating: String,
});

