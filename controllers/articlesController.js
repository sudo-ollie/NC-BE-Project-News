const {
    fetchArticle
} = require('../models/articlesModels')

exports.articleLookup = (req , res , next) => {
    const article_id = req.params['0']
    fetchArticle(article_id)
    .then((article) => res.status(200).send({article : article})
    )
    .catch(next)
}
