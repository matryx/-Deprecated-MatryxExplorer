const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config()


//process.env.DB_HOST
const externalApiCalls = require('./api/controllers/eth/externalApiCalls');

//Routes
const platformRoutes = require('./api/routes/platform');
const tournamentRoutes = require('./api/routes/tournaments');
const roundRoutes = require('./api/routes/rounds');


    //tempAPI routes active
    const tempPlatformRoutes = require('./tempApi/platform');
    const tempTournamentRoutes = require('./tempApi/tournaments');
    const tempRoundRoutes = require('./tempApi/rounds');
    const tempActivityRoutes = require('./tempApi/activity');



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/platform', platformRoutes);
app.use('/tournament', tournamentRoutes);
app.use('/rounds', roundRoutes);

    //tempAPI routes active
    app.use('/tempAPI/platform', tempPlatformRoutes);
    app.use('/tempAPI/tournament', tempTournamentRoutes);
    app.use('/tempAPI/rounds', tempRoundRoutes);
    app.use('/tempAPI/activity', tempActivityRoutes);




//Error handling
app.use((req, res, next) =>{
    const error = new Error( 'Not Found');
    error.status = 404
    next(error)
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});




module.exports = app;
