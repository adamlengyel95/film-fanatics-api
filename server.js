const express = require('express');
const db = require('./db/db');
const keys = require('./config/keys');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const moviesRoutes = require('./routes/movie-routes')
const artistRoutes = require('./routes/artist-routes')
const passportSetup = require('./config/passport-setup');
const passport = require('passport');
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session');
const app = express();

const PORT = 5000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    return next();
});

// Set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/movies', moviesRoutes);
app.use('/artists', artistRoutes)

app.get('/redirect', (req, res) => {
    res.redirect('http://localhost:3000/profile');
})

// Test for user select
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users WHERE google_id = ?', ["202894900202616524258"], function (error, results, fields) {
        if (error) throw error;
    });

    res.send("asd");
});

app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
});