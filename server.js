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

const PORT = process.env.PORT || 5000;;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
    domain: '.rabit.hu'
}));

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://filmfanatics-client.rabit.hu');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//Set up passport
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
    res.redirect('http://filmfanatics-client.rabit.hu/profile');
})

app.listen(PORT, () => {
    console.log('Server is running on port:', PORT);
});