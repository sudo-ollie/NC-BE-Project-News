const db = require('../db/connection')

exports.pullArticleComments = (article_id) => {
    return db.query('SELECT * FROM comments WHERE article_id= $1 ORDER BY created_at DESC' , [article_id])
    .then((comments) => {
        console.log('COMMENTS')
        return comments.rows
    })
}

exports.checkArticle = (article_id) => {
    console.log(article_id)
    return db.query('SELECT * FROM articles WHERE article_id= $1' , [article_id])
    .then((exists) => {
        console.log(exists)
        if(exists.rowCount === 0){
            return Promise.reject({
                //Change to 404
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

exports.fetchCommentCount = (article_id) => {
    console.log(article_id);
    const query = `
        SELECT articles.title,
               (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
        FROM articles
        WHERE articles.article_id = $1`
    
    return db.query(query, [article_id])
        .then((result) => {
            console.log(result.rows[0].comment_count)
            return result.rows;
        });
};

//    FROM articles WHERE article_id= $1