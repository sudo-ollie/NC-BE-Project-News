const {
    pullArticleComments,
    createComment,
    checkArticle,
    removeComment,
    fetchCommentCount
} = require('../models/commentsModels')

exports.returnArticleComments = (req , res , next) => {

    const {article_id} = req.params
    console.log(article_id)
    Promise.all([checkArticle(article_id) , pullArticleComments(article_id)])
    .then((comments) => {
        console.log('COMMENTS')
        res.status(200).send({comments : comments[1]})
    })
    .catch(next)
}

exports.addComment = (req , res , next) => {
    const {username , body} = req.body
    const {article_id} = req.params
    createComment(article_id , username , body)
    .then((result) => {
        result == {code : 404 , msg : 'Missing Headers'}
        ? next(result)
        : res.status(200).send({comment_content : result})
    })
    .catch(next)
}

exports.deleteComment = (req , res , next) => {
    const {comment_id} = req.params
    removeComment(comment_id)
    .then((response) => {
        response === undefined
        ? res.status(404).send({
            msg : "404 - COMMENT DOESN'T EXIST"
        })
        : res.status(204).end()
    })
    .catch(next)
}

exports.getCommentCount = (req , res , next) => {
    const {article_id} = req.params
    console.log(article_id)
    article_id === undefined || !(typeof article_id === 'number') 
    ? next({status : 400 , msg : 'Non-Valid Query'})
    : fetchCommentCount(article_id)
    .then((result) => {
        console.log(result)
    })
}