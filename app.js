const express = require('express')
const app = express()

//Controller Imports
const {
    getTopics
} = require('./controllers/topicsController')

const {
    getEndpoints
} = require('./controllers/baseController')


//Topics Endpoints
app.get('/api/topics' , getTopics)

//Base Endpoints
app.get('/api' , getEndpoints)


//Uncaught 404s
app.all('*' , (req , res) => {
    res.status(404).send({msg : 'No Such Endpoint'})
})

app.use((err , req , res , next) => {
    console.log(err)
})



module.exports = app