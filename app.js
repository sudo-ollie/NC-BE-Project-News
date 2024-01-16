const express = require('express')
const app = express()

//Controller Imports
const {
    getTopics
} = require('./controllers/topicsController')

const {
    getEndpoints
} = require('./controllers/baseController')

const {
    articleLookup
} = require('./controllers/articlesController')

//Topics Endpoints
app.get('/api/topics' , getTopics)

//Base Endpoints
app.get('/api' , getEndpoints)

//Article Endpoints
app.get('/api/articles/*' , articleLookup )

//Uncaught 404s
app.all('*' , (req , res) => {
    res.status(404).send({msg : 'No Such Endpoint'})
})

app.use((err , req , res , next) => {
    if(err.code === '22P02'){
        res.status(404).send({
            msg : '404 - File Not Found (Invalid Input Type)',
            error : err.error
        })
    }
})



module.exports = app