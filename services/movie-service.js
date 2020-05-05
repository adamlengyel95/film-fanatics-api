const db = require('../db/db');

module.exports = {
    getMovies: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT movies.title AS title, movies.movie_id AS id, movies.movie_cover AS imageName
            FROM movies`, (err, rows, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    },
    getLatestMovies: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT movies.movie_id as movieId, movies.release_date as releaseDate, movies.title, movies.description, movies.movie_cover AS imageName
            FROM movies
            ORDER BY movies.release_date DESC
            LIMIT 10`, (err, rows, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    },
    getMovieById: (movieId) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM movies WHERE movie_id=${movieId}`, (err, rows, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    },
    getMoviesByTitle: (title) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT movies.title AS title, movies.movie_id AS id, movies.movie_cover AS imageName
            FROM movies WHERE movies.title LIKE "%${title}%"`, (err, rows, field) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    },
    getArtistsByMovieId: (movieId) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT artists.artist_id as artistId, artists.artist_name as artistName, works_on.works_as as worksAs
            FROM works_on, artists 
            WHERE works_on.movie_id=${movieId} AND works_on.artist_id = artists.artist_id`,
                (err, rows, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
        });
    },
    getArtistIdsByMovies: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT GROUP_CONCAT(artists.artist_id) as artistIds, movies.movie_id as movieId, movies.release_date as releaseDate, movies.title, movies.description, movies.movie_cover AS imageName
            FROM works_on, artists , movies
            WHERE works_on.movie_id = movies.movie_id AND works_on.artist_id = artists.artist_id
            GROUP BY movies.movie_id`, (err, rows, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    },
    getRatingByMovieId: (movieId) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT AVG(rating) AS rating, COUNT(rating) as ratingCount FROM rates WHERE movie_id=${movieId}`,
                (err, rows, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
        })
    },
    getCommentsByMovieId: (movieId) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT users.display_name AS displayName, comments.content AS content, comments.comment_id AS id
            FROM comments, users
            WHERE users.user_id = comments.user_id AND comments.movie_id = ${movieId}`,
                (err, rows, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
        })
    },
    getGenres: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT genres.genre_id as id, genres.genre_name as name FROM genres`, (err, rows, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    },
    getMoviesByGenre: (genreId) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT movies.title AS title, movies.movie_id AS id, movies.movie_cover AS imageName
            FROM movies, movie_genre
            WHERE movies.movie_id = movie_genre.movie_id AND movie_genre.genre_id = ${genreId}`,
                (err, rows, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
        })
    },
    getMoviesByDateInterval: (fromDate, toDate) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT movies.title AS title, movies.movie_id AS id, movies.movie_cover AS imageName
            FROM movies
            WHERE movies.release_date BETWEEN "${fromDate}" AND "${toDate}"`,
                (err, rows, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
        })
    },
    getMoviesRatedByUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT movies.movie_id AS id, movies.title, movies.release_date as releaseDate, movies.movie_cover AS imageName,
            (SELECT rating AS rating
             FROM rates WHERE rates.movie_id = movies.movie_id AND rates.user_id = ${userId} LIMIT 1) as rating,
             (SELECT COUNT(rating) AS rating FROM rates WHERE rates.movie_id = movies.movie_id) as ratingCount,
             (SELECT GROUP_CONCAT(artists.artist_name) FROM artists, works_on WHERE artists.artist_id = works_on.artist_id AND works_on.movie_id = movies.movie_id AND works_on.works_as = "Rendező") AS directors
            FROM movies
            WHERE movies.movie_id IN (SELECT movies.movie_id FROM users, movies, rates WHERE users.user_id = rates.user_id AND rates.movie_id = movies.movie_id AND users.user_id = ${userId})`,
                (err, rows, fields) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                }
            )
        })
    }
}