const router = require('express').Router();
const artistService = require('../services/artist-service');

router.get('/directors', (req, res) => {
    artistService.getDirectors()
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.status(500).send({ message: 'Error occured during fetching directors', errors: err })
        })
});

router.get('/actors', (req, res) => {
    artistService.getActors()
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.status(500).send({ message: 'Error occured during fetching actors', errors: err })
        })
});

router.get('/director', (req, res) => {
    artistService.getDirectorsByName(req.query.name)
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            res.status(500).send({ message: 'Error occured during fetching directors by name', errors: err })
        })
})

router.get('/actor', (req, res) => {
    artistService.getActorsByName(req.query.name)
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            res.status(500).send({ message: 'Error occured during fetching actors by name', errors: err })
        })
})

router.post('/follow', (req, res) => {
    if (req.user) {
        artistService.followArtist(req.user.user_id, req.query.artistId)
            .then((result) => {
                res.send(result);
            }).catch((err) => {
                res.status(500).send({ message: 'Error occured during following artist', error: err })
            })
    } else {
        res.status(403).send({ authError: 'User is not authenticated.' })
    }
})

router.get('/follow', (req, res) => {
    if (!req.user) {
        res.send({ isFollowed: false })
    } else {
        artistService.getArtistFollow(req.query.userId, req.query.artistId)
            .then((result) => {
                if (result.length > 0) {
                    res.send({ isFollowed: true })
                } else {
                    res.send({ isFollowed: false })
                }
                res.send(result);
            }).catch((err) => {
                res.status(500).send({ message: 'Error occured during fetching artist follow', error: err })
            });
    }
})

router.delete('/follow', (req, res) => {
    if (!req.user) {
        res.status(403).send({ authError: 'User is not authenticated.' })
    } else {
        artistService.deleteArtistFollow(req.user.user_id, req.query.artistId)
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            const error = { message: 'Error occured during deleting artist follow', error: err }
            res.status(500).send(error)
        })
    }
})

router.get('/:artistId', (req, res) => {
    const response = {}
    const errors = []
    const getArtistDetails = artistService.getArtistDetails(req.params.artistId)
        .then((result) => {
            response.movies = result;
        }).catch((err) => {
            errors.push({ message: 'Error occured during fetching artist movies', errors: err })
        })
    const getArtistName = artistService.getArtistById(req.params.artistId)
        .then((result) => {
            response.id = result[0].id;
            response.name = result[0].name;
            response.imageName = result[0].profilePicture;
            response.birthDate = result[0].birthDate;
            response.birthPlace = result[0].birthPlace;
            response.height = result[0].height;
        }).catch((err) => {
            errors.push({ message: 'Error occured during fetching actor name by id', error: err })
        })
    const getArtistFollow = artistService.getArtistFollow(req.user, req.params.artistId)
        .then((result) => {
            if (result === null || result.length === 0){
                response.isFollowed = false
            } else {
                response.isFollowed = true;
            }
        }).catch((err) => {
            errors.push({ message: 'Error occured during fetching artist follow', error: err})
        })
    Promise.all([getArtistDetails, getArtistName, getArtistFollow]).then(() => {
        if (errors.length > 0) {
            res.status(500).send({ message: 'Error occured during artist details', errors: errors })
        } else {
            res.send(response)
        }
    })
})

module.exports = router;