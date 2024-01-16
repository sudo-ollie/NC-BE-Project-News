const {
    fetchEndpoints
} = require('../models/baseModels')

exports.getEndpoints = (req , res , next) => {
    fetchEndpoints()
    .then((endpointInfo) => res.status(200).send({endpointInfo})
    )
    .catch(next)
}
