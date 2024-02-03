const {
    fetchEndpoints
} = require('../models/topicsModels')

exports.returnAllTopics = (req , res , next) => {
    fetchEndpoints()
    .then((topics) => res.status(200).send({topics : topics}))
    .catch(next)
}


