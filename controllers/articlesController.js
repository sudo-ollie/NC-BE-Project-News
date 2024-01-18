const {
    fetchArticle,
    pullAllArticles,
    pullComments,
    checkArticle,
    createComment
} = require('../models/articlesModels')

exports.articleLookup = (req , res , next) => {
    const article_id = req.params['0']
    fetchArticle(article_id)
    .then((article) => {
        res.status(200).send({ article: article })
      })
      .catch(next)
}

exports.allArticles = (req , res , next) => {
    pullAllArticles()
    .then((articles) => {
        res.status(200).send({articles : articles})
    })
    .catch(next)
}

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

exports.updateArticle = (req , res , next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    console.log(article_id , inc_votes)
}