const router = require('express').Router();
const movieService = require('../services/movie-service');
const artistService = require('../services/artist-service');

const authCheck = (req, res, next) => {
    if (!req.user) {
        res.send({ authError: 'User is not authenticated.' })
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    res.send(req.user);
});

router.get('/details', (req, res) => {
    if (!req.user) {
        res.status(403).send({ authError: 'User is not authenticated.' })
    } else {
        const response = {}
        const errors = []
        const getRatedMovies = movieService.getMoviesRatedByUser(req.user.user_id)
            .then((result) => {
                response.ratedMovies = result;
            }).catch((err) => {
                errors.push({ name: 'Rated movies error', message: err.message });
            })
        const getFollowedArtists = artistService.getUserFollows(req.user.user_id)
            .then((result) => {
                response.followedArtists = result;
            }).catch((err) => {
                errors.push({ name: 'Follow error', message: err.message });
            })
        Promise.all([getRatedMovies, getFollowedArtists])
            .then(() => {
                if (errors.length > 0) {
                    res.status(500).send({ message: 'Error occured during fetching profile details', errors: errors })
                } else {
                    res.send(response)
                }
            })
    }
})

module.exports = router;