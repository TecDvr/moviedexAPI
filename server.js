const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const MOVIE = require('./movie.json');
const PORT = 8000;

console.log(process.env.API_TOKEN, 'test API Key'); 

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(validateBearerToken);

app.get('/movie', handleMovieGet);

function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;

    if(!authToken || authToken.split(" ")[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized Request'});
    }

    next();
}
 
function handleMovieGet(req, res) {
    let response = MOVIE

    if(req.query.genre) {
        response = response.filter(movies => {
            return movies.genre.toLowerCase().includes(req.query.genre.toLowerCase());
        })
    }

    if(req.query.country) {
        response = response.filter(movies => {
            return movies.country.toLowerCase().includes(req.query.country.toLowerCase());
        })
    }

    if(req.query.avg_vote) {
        if(req.query.avg_vote > 10) {
            res.send('avg_vote should be a number less than or equal to 10');
        } else {
            response = response.filter(movies => {
                return parseInt(movies.avg_vote) >= parseInt(req.query.avg_vote);
            })
        }
    }
    res.json(response);
}

app.listen(PORT, () => console.log(`Server is crankin at http://localhost:${PORT}`));