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
    getComments,
    addComment,
    updateArticle
} = require('./controllers/articlesController')

//Parses incoming JSON & adds to req.body
app.use(express.json())

//Topics Endpoints
app.get('/api/topics' , getTopics)

//Base Endpoints
app.get('/api' , getEndpoints)

//Article Endpoints
app.patch('/api/articles/:article_id' , updateArticle)
app.get('/api/articles/:article_id/comments' , getComments)
app.post('/api/articles/:article_id/comments' , addComment)
app.get('/api/articles' , allArticles)
app.get('/api/articles/*' , articleLookup )





//Uncaught 404s
app.all('*' , (req , res) => {
    res.status(404).send({msg : 'No Such Endpoint'})
})

app.use((err , req , res , next) => {
    console.log('ERROR' , err)
    if(err.code === '22P02'){
        res.status(404).send({
            msg : '400 - File Not Found (Invalid Input Type)',
            error : err.error
        })
    }
    else {
        next(err)
    }
    if(err.code === '23502'){
        res.status(404).send({
            msg : '404 - Missing Required Data',
            error : err.error
        })
    }
    else {
        next(err)
    }
    if(err.code === '23503'){
        res.status(404).send({
            msg : "404 - Article / User Doesn't Exist",
            error : err.error
        })
    }
    else {
        next(err)
    }
    if (err.msg === 'Article Not Found'){
        res.status(404).send({
            msg : '404 - File Not Found'
        })
    }
    else {
        next(err)
    }
    if (err.msg === "Article Doesn't Exist"){
        res.status(400).send({
            msg : "Article Doesn't Exist"
        })
    }
    else {
        next(err)
    }
    if (err.msg === 'Missing Headers'){
        res.status(404).send({
            msg : "Required Headers Missing"
        })
    }
    else {
        next(err)
    }
    if (err.code === '500'){
        console.log(`
        Error Code : ${err.code} , 
        Error Message : ${err.msg} ,

        Error Full : ${err}
        `)
    }
})



module.exports = app