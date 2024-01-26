const {
    fetchUsers
} = require('../models/userModels')



exports.getUsers = (req , res , next) => {
    fetchUsers()
    .then((users) => {
        res.status(200).send({users : users})
    })
}