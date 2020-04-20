const db = require('../db/db');

module.exports = {
    getDirectors: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT DISTINCT artists.artist_id AS id, artists.artist_name as name, artists.profile_picture as profilePicture
            FROM artists, works_on
            WHERE artists.artist_id=works_on.artist_id AND works_as LIKE "Rendező" ORDER BY name`,
                (err, rows, fields) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                })
        })
    },
    getActors: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT DISTINCT artists.artist_id AS id, artists.artist_name as name, artists.profile_picture as profilePicture
            FROM artists, works_on
            WHERE artists.artist_id=works_on.artist_id AND (works_as LIKE "Színész" OR works_as LIKE "Színésznő")
            ORDER BY name`,
                (err, rows, fields) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                })
        })
    },
    getDirectorsByName: (name) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT DISTINCT artists.artist_id AS id, artists.artist_name as name, artists.profile_picture as profilePicture
            FROM artists, works_on
            WHERE artists.artist_id=works_on.artist_id AND works_as LIKE "Rendező" AND artists.artist_name LIKE "%${name}%" ORDER BY name`,
                (err, rows, fields) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                })
        })
    },
    getActorsByName: (name) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT DISTINCT artists.artist_id AS id, artists.artist_name as name, artists.profile_picture as profilePicture
            FROM artists, works_on
            WHERE artists.artist_id=works_on.artist_id AND works_as NOT LIKE "Rendező" AND artists.artist_name LIKE "%${name}%" ORDER BY name`,
                (err, rows, fields) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                })
        })
    },
    getArtistById: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT artists.artist_name AS name, artists.profile_picture AS profilePicture
                FROM artists
                WHERE artists.artist_id = ${id}`, (err, rows, fields) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                })
        })
    },
    getArtistDetails: (artistId) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT movies.movie_id, movies.title, movies.release_date,
            (SELECT AVG(rating) AS rating
             FROM rates WHERE rates.movie_id = movies.movie_id) as rating,
             (SELECT COUNT(rating) AS rating FROM rates WHERE rates.movie_id = movies.movie_id) as ratingCount
            FROM movies
            WHERE movies.movie_id IN (SELECT movies.movie_id FROM artists, movies, works_on WHERE artists.artist_id = works_on.artist_id
                                      AND works_on.movie_id = movies.movie_id AND artists.artist_id = ${artistId})`,
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