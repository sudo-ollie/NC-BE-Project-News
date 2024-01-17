const {
    fetchArticle,
    pullAllArticles,
    pullComments,
    checkArticle
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
        res.status(200).send({comments : comments})
    })
    .catch(next)
}