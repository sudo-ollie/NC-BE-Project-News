const express = require('express')
const app = express()

//Controller Imports
const {
    returnAllTopics
} = require('./controllers/topicsController')

const {
    getEndpoints
} = require('./controllers/baseController')

const {
    returnByID,
    returnAllArticles,
    modifyVotes
} = require('./controllers/articlesController')

const {
    returnArticleComments,
    addComment,
    deleteComment,
} = require('./controllers/commentsController')

const {
    returnAllUsers
} = require('./controllers/userController')

//Parses incoming JSON & adds to req.body
app.use(express.json())

//Topics Endpoints
app.get('/api/topics' , returnAllTopics) //Return All Topics

//Base Endpoints
app.get('/api' , getEndpoints) //Return All Endpoints

//Article Endpoints
app.get('/api/articles' , returnAllArticles) //Return All Articles
app.get('/api/articles/:article_id' , returnByID) //Return Article By Article_ID
app.get('/api/articles/:article_id/comments' , returnArticleComments) //Get Article Comments By Comment_ID
app.post('/api/articles/:article_id/comments' , addComment) //Add Article Comment
app.patch('/api/articles/:article_id' , modifyVotes) //Modify Cote Count


//Comments Endpoints
app.delete('/api/comments/:comment_id' , deleteComment) //Delete Comment By Comment_ID

//User Endpoints
app.get('/api/users' , returnAllUsers) //Return All Users

//Uncaught 404s
app.all('*' , (req , res) => {
    res.status(404).send({msg : 'No Such Endpoint'})
})

//Middleware & Regex Rules
const invalidNaNRegex = /("NaN")/
const invalidIntRegex = /error: invalid input syntax for type integer:/
const invalidTypeErrorRegex = /TypeError/

app.use((err , req , res , next) => {
    console.log('ERROR : ' , err)
    console.log(Object.keys(err))
    if(err.msg === '22P02' && invalidNaNRegex.test(err) === true){
        res.status(400).send({
            msg : '400 - Invalid Data Provided',
            error : err.error
        })
    }
    else if(err.status === 400 && err.msg === 'No Matches'){
        res.status(400).send({
            msg : "400 - No Matches Found"
        })
    }
    else if(err.code === '22P02' && invalidIntRegex.test(err) === true){
        res.status(400).send({
            msg : "400 - INVALID COMMENT ID (NON-INT)"
        })
    }
    //This one
    else if(err.msg === 'Non-Valid Query'){
        res.status(400).send({
            msg : 'Non-Valid Query'})
    }
    else if(invalidTypeErrorRegex.test(err) === true){
        res.status(400).send({
            msg : "Non-Valid Query"
        })
    }
    else if(err.msg === "Comment Doesn't Exist"){
        res.status(404).send({
            msg : "404 - COMMENT DOESN'T EXIST"
        })
    }
    else if(err.code === '22P02'){
        res.status(404).send({
            msg : '404 - File Not Found (Invalid Input Type)',
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