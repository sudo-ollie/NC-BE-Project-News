const {
    pullComments,
    createComment,
    checkArticle,
    removeComment
} = require('../models/commentsModels')

exports.getComments = (req , res , next) => {
    const {article_id} = req.params
    Promise.all([checkArticle(article_id) , pullComments(article_id)])
    .then((comments) => {
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