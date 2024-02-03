const db = require('../db/connection')

exports.fetchEndpoints = () => {
    return db.query('SELECT * FROM topics')
        .then((result) => {
            return result.rows
        })
}