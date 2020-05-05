const router = require('express').Router();
const db = require('../db/db');
const movieService = require('../services/movie-service');
const artistService = require('../services/artist-service')

router.get('/', (req, res) => {
    movieService.getMovies()
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.status(500).send({ message: 'Error occured during fetching movies', errors: err })
        })
})

router.get('/home', (req, res) => {
    if (!req.user) {
        console.log('came here')
        movieService.getLatestMovies()
            .then((result) => {
                console.log('results are', result)
                res.send(result)
            }).catch((err) => {
                res.status(500).send({ message: 'Error occured during fetching the latest movies', error: err })
            })
    } else {
        const movies = []
        const followedArtistIds = []
        const errors = []
        const getArtistIds = movieService.getArtistIdsByMovies()
            .then((result) => {
                result.forEach((movie) => {
                    movies.push({
                        id: movie.movieId,
                        title: movie.title,
                        releaseDate: movie.releaseDate,
                        description: movie.description,
                        imageName: movie.imageName,
                        artistIds: movie.artistIds.split(',').map((id) => {
                            return Number(id);
                        }),
                        relevance: 0
                    })
                })
            }).catch((err) => {
                errors.push({ name: err.name, message: err.messages })
            })
        const getFollowedArtists = artistService.getUserFollows(req.user.user_id)
            .then((result) => {
                result.forEach((artist) => {
                    followedArtistIds.push(artist.id);
                })
            }).catch((err) => {
                errors.push({ name: err.name, message: err.messages })
            })
        Promise.all([getArtistIds, getFollowedArtists])
            .then(() => {
                if (errors.length > 0) {
                    res.status(500).send({ message: 'Error occured during fetching home recommendations', errors: errors })
                } else if (followedArtistIds.length === 0) {
                    movieService.getLatestMovies()
                        .then((result) => {
                            res.send(result)
                        }).catch((err) => {
                            res.status(500).send({ message: 'Error occured during fetching the latest movies', error: err })
                        })
                } else {
                    movies.forEach((movie) => {
                        movie.artistIds.forEach((id) => {
                            if (followedArtistIds.some(artistId => artistId === id)) {
                                movie.relevance++;
                            }
                        })
                    })
                    movies.sort((a, b) => (a.relevance < b.relevance) ? 1 : -1)
                    const response = movies.slice(0, 10).map(movie => {
                        return {
                            id: movie.id,
                            title: movie.title,
                            releaseDate: movie.releaseDate,
                            description: movie.description,
                            imageName: movie.imageName
                        }
                    })
                    res.send(response);
                }
            })
    }
});

router.get('/search-home', (req, res) => {
    db.query(`SELECT * FROM movies WHERE movies.title LIKE "%${req.query.title}%"`, (err, rows, fields) => {
        res.json(rows);
    })
});

router.get('/search', (req, res) => {
    movieService.getMoviesByTitle(req.query.title)
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            res.status(500).send({ message: 'Error occuerd during fetching movies by title', error: err })
        })
})

router.post('/rate', (req, res) => {
    if (!req.user) {
        res.status(403).send({ authError: 'User is not authenticated.' })
    } else {
        db.query(`SELECT * FROM rates WHERE rates.movie_id=${req.query.movieId} AND rates.user_id=${req.user.user_id}`, (err, rows, fields) => {
            if (err) {
                res.status(500).send({ message: 'Error occured during fetching rating: ', error: err });
            } else if (rows.length > 0) {
                db.query(`UPDATE rates
                SET rating = ${req.query.rating}
                WHERE rates.movie_id=${req.query.movieId} AND rates.user_id=${req.user.user_id}`, (err, rows, fields) => {
                    if (err) {
                        res.status(500).send({ message: 'Error occured during updating rating', error: err })
                    } else {
                        res.json({ message: 'Rating updated successfully' })
                    }
                })
            } else {
                db.query(`INSERT INTO rates VALUES(${req.query.movieId},${req.user.user_id},${req.query.rating})`, (err, rows, fields) => {
                    if (err) {
                        res.status(500).send({ message: 'Error occured during adding rating: ', error: err });
                    } else {
                        res.json({ message: 'Movie successfully rated' })
                    }
                })
            }
        })
    }
})

router.post('/comment', (req, res) => {
    if (!req.user) {
        res.status(403).send({ authError: 'User is not authenticated.' })
    } else {
        db.query(`INSERT INTO comments (movie_id, user_id, content) VALUES(${req.query.movieId},${req.user.user_id},"${req.query.content}")`, (err, rows, fields) => {
            if (err) {
                res.status(500).send({ message: 'Error occured during adding comment: ', error: err });
            } else {
                res.json({ message: 'Comment successfully added' })
            }
        })
    }
});

router.get('/genres', (req, res) => {
    movieService.getGenres()
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.status(500).send({ message: 'Error occured during fetching genres: ', error: err });
        })
})

router.get('/genre', (req, res) => {
    movieService.getMoviesByGenre(req.query.id)
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            res.status(500).send({ message: 'Error occured during fetching movies by genre: ', error: err });
        })
})

router.get('/release', (req, res) => {
    movieService.getMoviesByDateInterval(req.query.fromDate, req.query.toDate)
        .then((result) => {
            res.send(result);
        }).catch((err) => {
            res.status(500).send({ message: 'Error occured during fetching movies by date interval', error: err })
        })
})

router.get('/:movieId', (req, res) => {
    const response = {};
    const errors = [];
    const getMovieDetails = movieService.getMovieById(req.params.movieId)
        .then((result) => {
            if (result.length > 0) {
                response.title = result[0].title;
                response.description = result[0].description;
                response.releaseDate = result[0].release_date;
                response.cover = result[0].movie_cover;
            } else {
                throw new Error(`Movie details not found for movie with id: ${req.params.movieId}`);
            }
        }).catch((err) => {
            errors.push({ name: err.name, message: err.message });
        });
    const getArtists = movieService.getArtistsByMovieId(req.params.movieId)
        .then((result) => {
            if (result.length > 0) {
                response.actors = result.filter((artist) => {
                    return artist.worksAs != 'Rendező';
                }).map((actor) => {
                    return { id: actor.artistId, name: actor.artistName }
                });
                response.directors = result.filter((artist) => {
                    return artist.worksAs === 'Rendező';
                }).map((director) => {
                    return { id: director.artistId, name: director.artistName }
                })
            } else {
                throw new Error(`Artist not found for movie with id:${req.params.movieId}`)
            }
        }).catch((err) => {
            errors.push({ name: err.name, message: err.message })
        })
    const getRating = movieService.getRatingByMovieId(req.params.movieId)
        .then((result) => {
            if (result.length > 0) {
                response.rating = Math.round(result[0].rating * 2) / 2;
                response.ratingCount = result[0].ratingCount;
            } else {
                response.rating = 0;
            }
        })
        .catch((err) => {
            errors.push({ name: err.name, message: err.messages })
        })
    const getComments = movieService.getCommentsByMovieId(req.params.movieId)
        .then((result) => {
            response.comments = result;
        })
        .catch((err) => {
            errors.push({ name: err.name, message: err.message });
        });
    Promise.all([getMovieDetails, getArtists, getRating, getComments]).then(() => {
        if (errors.length > 0) {
            res.status(500).send({ message: 'Error occured during fetching movie details', errors: errors })
        } else {
            res.send(response)
        }
    })
});

module.exports = router;
