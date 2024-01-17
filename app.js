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
    articleLookup,
    allArticles,
    getComments
} = require('./controllers/articlesController')

//Topics Endpoints
app.get('/api/topics' , getTopics)

//Base Endpoints
app.get('/api' , getEndpoints)

//Article Endpoints
app.get('/api/articles/:article_id/comments' , getComments)
app.get('/api/articles' , allArticles)
app.get('/api/articles/*' , articleLookup )



//Uncaught 404s
app.all('*' , (req , res) => {
    res.status(404).send({msg : 'No Such Endpoint'})
})

app.use((err , req , res , next) => {
    console.log(err)
    if(err.code === '22P02'){
        res.status(404).send({
            msg : '400 - File Not Found (Invalid Input Type)',
            error : err.error
        })
    }
    else if (err.msg === 'Article Not Found'){
        res.status(404).send({
            msg : '404 - File Not Found'
        })
    }
    else if (err.msg === "Article Doesn't Exist"){
        res.status(400).send({
            msg : "Article Doesn't Exist"
        })
    }
})



module.exports = app