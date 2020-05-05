const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const db = require('../db/db');
const keys = require('./keys');

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser((userId, done) => {
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (error, results, fields) => {
        const user = results[0]
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        //Options for the google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accesToken, refreshToken, profile, done) => {
        db.query('SELECT * FROM users WHERE google_id = ?', [profile.id], (error, results, fields) => {
            if (error) throw error;
            if(results.length !== 0) {
                done(null, results[0])
            } else {
                const post  = {google_id: profile.id, display_name: profile.displayName};
                db.query('INSERT INTO users SET ?', post, (error, results, fields) => {
                    if (error) throw error;
                    const newUser = {
                        user_id: results.insertId,
                        google_id: profile.id,
                        display_name: profile.displayName
                    };
                    done(null, newUser)
                });
            }
        });
        
    })
);