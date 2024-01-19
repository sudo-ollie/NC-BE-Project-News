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
    updateVotes
} = require('./controllers/articlesController')

const {
    getComments,
    addComment,
    deleteComment
} = require('./controllers/commentsController')

//Parses incoming JSON & adds to req.body
app.use(express.json())

//Topics Endpoints
app.get('/api/topics' , getTopics)

//Base Endpoints
app.get('/api' , getEndpoints)

//Article Endpoints
app.patch('/api/articles/:article_id' , updateVotes)
app.get('/api/articles/:article_id/comments' , getComments)
app.post('/api/articles/:article_id/comments' , addComment)
app.get('/api/articles' , allArticles)
app.get('/api/articles/*' , articleLookup )

//Comments Endpoints
app.delete('/api/comments/:comment_id' , deleteComment)

//Uncaught 404s
app.all('*' , (req , res) => {
    res.status(404).send({msg : 'No Such Endpoint'})
})

//Middleware
const invalidNaNRegex = /("NaN")/
const invalidIntRegex = /error: invalid input syntax for type integer:/

app.use((err , req , res , next) => {
    console.error(err)
    console.log(invalidIntRegex.test(err))
    if(err.code === '22P02' && invalidNaNRegex.test(err) === true){
        res.status(400).send({
            msg : '400 - Invalid Data Provided',
            error : err.error
        })
    }
    else if(err.code === '22P02' && invalidIntRegex.test(err) === true){
        res.status(400).send({
            msg : "400 - INVALID COMMENT ID (NON-INT)"
        })
    }
    else if(err.code === '22P02'){
        res.status(404).send({
            msg : '400 - File Not Found (Invalid Input Type)',
            error : err.error
        })
    }
    else if(err.code === '23502'){
        res.status(404).send({
            msg : '404 - Missing Required Data',
            error : err.error
        })
    }
    else if(err.code === '23503'){
        res.status(404).send({
            msg : "404 - Article / User Doesn't Exist",
            error : err.error
        })
    }
    else if (err.msg === 'Article Not Found'){
        res.status(404).send({
            msg : '404 - File Not Found'
        })
    }
    else if (err.msg === "Article Doesn't Exist / Error Reading Votes"){
        res.status(404).send({
            msg : "Article Doesn't Exist / Error Reading Votes"
        })
    }
    else if (err.msg === "Article Doesn't Exist"){
        res.status(400).send({
            msg : "Article Doesn't Exist"
        })
    }
    else if (err.msg === 'Missing Headers'){
        res.status(404).send({
            msg : "Required Headers Missing"
        })
    }
    else if (err.code === '500'){
        console.error(err)
    }
})


module.exports = app