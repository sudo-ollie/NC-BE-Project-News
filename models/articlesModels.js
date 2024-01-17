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
    return db.query('SELECT * FROM articles ORDER BY created_at DESC')
    .then((articles) => {
        formattedArr = articles.rows.map(({article_id , title , topic , author , created_at , votes , article_img_url}) => ({
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

