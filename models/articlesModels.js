const db = require('../db/connection')

exports.fetchArticle = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id= $1' , [article_id])
    .then((response) => {
        if (response.rows.length === 0){
            return Promise.reject({ 
                status : 404 , 
                msg : 'Article Not Found'})
        }
        return response.rows
    })
}

exports.pullAllArticles = () => {
    return db.query(`
    SELECT articles.*, 
    (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
    FROM articles 
    ORDER BY created_at DESC`)
    .then((articles) => {
        formattedArr = articles.rows.map(({article_id , title , topic , author , created_at , votes , article_img_url , comment_count}) => ({
            article_id: article_id,
            title: title,
            topic: topic,
            author: author,
            created_at: created_at,
            votes: votes,
            article_img_url: article_img_url,
            comment_count : comment_count
        }))
        return formattedArr
    })
}

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
        console.log(result , 'ERROR')
        return result.rows[0]
    })
}