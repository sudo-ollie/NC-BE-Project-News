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

  describe('Articles API - PATCH Vote Count', () => {

    test('PATCH request should return a 200 and the payload in response', () => {
      const votePayload = { inc_votes: 10 }
  
        return request(app)
          .patch('/api/articles/1')
          .send(votePayload)
          .expect(200)
          .then((response) => {
            expect(response.body.updated_article.votes).toBe(110)
          })
    })
  
    test('PATCH request with an incorrect value should return a 400 & message', () => {
      const votePayload = { inc_votes: 'ten' }
      const originalVote = commentFile[0].votes
  
        return request(app)
          .patch('/api/articles/1')
          .send(votePayload)
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('400 - Invalid Data Provided')
          })
    })
  
    test('PATCH request to an incorrect endpoint should return a 404 & message', () => {
      const votePayload = { inc_votes: 10 }
      const originalVote = commentFile[0].votes
  
        return request(app)
          .patch('/api/articles/500')
          .send(votePayload)
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Article Doesn't Exist / Error Reading Votes")
          })
    })
  });


