const db = require('../db/connection')

exports.fetchByID = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id= $1' , [article_id])
    .then((response) => {
        if (response.rows.length === 0){
            return Promise.reject({ 
                status : 404 , 
                msg : 'Article Not Found'})
        }
        return response.rows[0]
    })
}

exports.fetchAllArticles = (queryObj) => {
    const validSorts = ['title' , 'topic' , 'author' , 'body' , 'votes' , 'created_at']
    
    if(validSorts.includes(Object.keys(queryObj)[0]) && Object.keys(queryObj[1] === 'sorted')){
        queryObj[Object.keys(queryObj)[1]] === 'Asc'
        ? query = (`SELECT articles.* FROM articles WHERE ${Object.keys(queryObj)[0]}='${queryObj[Object.keys(queryObj)[0]]}' ORDER BY created_at ${queryObj[Object.keys(queryObj)[1]].toUpperCase()}`)
        : query = (`SELECT articles.* FROM articles WHERE ${Object.keys(queryObj)[0]}='${queryObj[Object.keys(queryObj)[0]]}' ORDER BY created_at DESC`)
        return db.query(query)
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({status : 400 , msg : 'No Matches'})
            } 
            else {
                return result.rows
            }
        })}

else if (validSorts.includes(Object.keys(queryObj)[0])) {
    let query = `SELECT articles.* FROM articles WHERE ${Object.keys(queryObj)[0]}='${queryObj[Object.keys(queryObj)[0]]}'`;
    return db.query(query)
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({status : 400 , msg : 'No Matches'})
            } 
            else {
                return result.rows
            }
        })}

    else if (Object.keys(queryObj).length === 0) {
        return db.query(`
        SELECT articles.*, 
        (SELECT COUNT(*) FROM comments 
        WHERE comments.article_id = articles.article_id) AS comment_count
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
    })}
    else {
        return new Error({status : 400 , msg : 'Non-Valid Query'})
    }
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
        return result.rows[0]
    })
}

exports.editVotes = (article_id , inc_votes) => {
    return db.query('SELECT votes FROM articles WHERE article_id= $1' , [article_id])
    .then((voteCount) => {
        if(voteCount.rowCount === 0){
            return Promise.reject({
                status : 404 , 
                msg : "Article Doesn't Exist / Error Reading Votes"
            })}
            return Number(voteCount.rows[0].votes) + Number(inc_votes)
    })
    .then((newVote) => {
        return db.query('UPDATE articles SET votes= $1 WHERE article_id= $2 RETURNING *' , [newVote , article_id])
    })
    .then((result) => {
        return result.rows[0]
    })
}