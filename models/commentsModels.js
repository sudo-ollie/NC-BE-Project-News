const db = require('../db/connection')

exports.pullComments = (article_id) => {
    return db.query('SELECT * FROM comments WHERE article_id= $1 ORDER BY created_at DESC' , [article_id])
    .then((comments) => {
        return comments.rows
    })
}

exports.checkArticle = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id= $1' , [article_id])
    .then((exists) => {
        if(exists.rowCount === 0){
            return Promise.reject({
                status : 400 , 
                msg : "Article Doesn't Exist"
            })
        }
    })
}

exports.createComment = (article_id , username , body) => {
    return db.query('INSERT INTO comments (article_id , author , body) VALUES ($1 , $2 , $3) RETURNING *' , [article_id , username , body])
    .then((result) => {
        return result.rows[0]
    })
}

exports.removeComment = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id= $1 RETURNING *' , [comment_id])
    .then((result) => {
        if(result.rows.length === 0){
            return Promise.reject({
                status : 400 , 
                msg : "Comment Doesn't Exist"
            })
        }
        return result.rows[0]
    })
}