const {
    fetchAllUsers
} = require('../models/userModels')



exports.returnAllUsers = (req , res , next) => {
    fetchAllUsers()
    .then((users) => {
        res.status(200).send({users : users})
    })
}