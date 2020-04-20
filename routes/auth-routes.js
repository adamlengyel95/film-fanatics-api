// Create a router instance to which we can attach routes
const router = require('express').Router();
const passport = require('passport');

//auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

//auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200)
});

//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('http://localhost:3000/');
});

module.exports = router;
