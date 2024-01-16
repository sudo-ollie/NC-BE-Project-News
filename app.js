const express = require('express')
const app = express()

//Topics Methods
const {
    getTopics
} = require('./controllers/topicsController')

//Topics Endpoints
app.get('/api/topics' , getTopics)


module.exports = app