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

  describe('Articles API - POST Comment', () => {

    test('POST request should return a 200 and the payload in response', () => {
      const commentPayload = {
        username : 'icellusedkars',
        body : 'Jest is the best!'
      }
  
        return request(app)
          .post('/api/articles/5/comments')
          .send(commentPayload)
          .expect(200)
          .then((response) => {
            expect(response.body.comment_content.article_id).toEqual(5)
            expect(response.body.comment_content.author).toEqual('icellusedkars')
            expect(response.body.comment_content.body).toEqual('Jest is the best!')
          })
    })
  
    test('POST request with missing headers should return a 404 & message', () => {
      const commentPayload = {
        username : 'NCUSER',
      }
  
      return request(app)
        .post('/api/articles/5/comments')
        .send(commentPayload)
        .expect(404)
        .then((response) => {
          console.log(response.body)
          expect(response.body.msg).toEqual('404 - Missing Required Data')
        })
    })
  
    test("POST request with an invalid user should return a 404 & message", () => {
      const commentPayload = {
        username : 'NCUSER1',
        body : 'Jest is the best!'
      }
  
      return request(app)
        .post('/api/articles/500/comments')
        .send(commentPayload)
        .expect(404)
        .then((response) => {
          console.log(response.body)
          expect(response.body.msg).toEqual("404 - Article / User Doesn't Exist")
        })
    }) 
  
    test("Valid post request to an article that doesn't exist should return a 404 & message", () => {
      const commentPayload = {
        username : 'icellusedkars',
        body : 'Jest is the best!'
      }
  
      return request(app)
        .post('/api/articles/500/comments')
        .send(commentPayload)
        .expect(404)
        .then((response) => {
          console.log(response.body)
          expect(response.body.msg).toEqual("404 - Article / User Doesn't Exist")
        })
  }) 
  });


