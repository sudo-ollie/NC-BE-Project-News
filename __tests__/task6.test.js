const app = require('../app')
const request = require('supertest')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data/index.js')
const endpointFile = require('../endpoints.json')
const commentFile = require('../db/data/test-data/articles.js')

beforeEach(() => seed(testData))

afterAll(() => {
  db.end()
})

describe('General Tests', () => {
    test('Requests to an incorrect endpoint should return 404 + a message', () => {
      return request(app)
        .get('/api/test')
        .expect(404)
        .then((response => {
          expect(response.body).toEqual({msg : 'No Such Endpoint'})
        }))
    })
  });

  describe('Articles API - Get Article Comments', () => {
    test('GET request should return a 200 and an array', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then((response) => {
            expect(Array.isArray(response.body.comments)).toBe(true)
          })
    })
  
    test("Array entries should contain all the correct properties && should be properly sorted", () => {       
      return request(app)
        .get('/api/articles/1/comments')
        .then((response) => {
          response.body.comments.forEach((element) => {
            console.log(element , 'ELEMENTS')
            expect(Object.keys(element)).toEqual([ 'comment_id', 'body', 'article_id', 'author', 'votes', 'created_at' ])
            expect(response.body.comments).toBeSortedBy( 'created_at' , {descending : true})
          })
        })
    })
  
    test('Articles with no comments should return an empty array', () => {
      return request(app)
        .get('/api/articles/2/comments')
        .then((response) => {
          expect(response.body.comments.length).toBe(0)
        })
    })
    
    test('Non-existent articles should respond with a 400 & message', () => {
      return request(app)
        .get('/api/articles/4000/comments')
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toEqual("Article Doesn't Exist")
        })
    })
  });


