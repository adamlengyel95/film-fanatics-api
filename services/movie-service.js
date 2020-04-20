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
    getRatingByMovieId: (movieId) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT AVG(rating) AS rating FROM rates WHERE movie_id=${movieId}`,
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
            db.query(`SELECT * FROM genres`, (err, rows, fields) => {
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
            db.query(`SELECT movies.movie_id, movies.title
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
    }
}